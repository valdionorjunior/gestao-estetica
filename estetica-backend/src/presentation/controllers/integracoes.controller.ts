import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { IsEmail, IsEnum, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../../domain/entities/user-role.enum';
import { IntegracoesService } from '../../application/use-cases/integracoes.service';
import { PlataformaIntegracao } from '../../domain/entities/integracao-log.entity';

class SincronizarContatoDto {
  @ApiProperty({ description: 'UUID do paciente' })
  @IsUUID('4', { message: 'pacienteId deve ser um UUID válido' })
  pacienteId: string;

  @ApiProperty({ description: 'Nome do contato' })
  @IsString()
  nome: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiPropertyOptional({ enum: PlataformaIntegracao })
  @IsOptional()
  @IsEnum(PlataformaIntegracao, { message: 'Plataforma inválida' })
  plataforma?: PlataformaIntegracao;
}

class RegistrarEventoDto {
  @ApiProperty({ description: 'Tipo do evento (ex: CONVERSION, PAGE_VIEW)' })
  @IsString()
  tipo: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  pacienteId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  valor?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  dados?: Record<string, unknown>;
}

@ApiTags('Integrações')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('integracoes')
export class IntegracoesController {
  constructor(private readonly service: IntegracoesService) {}

  // ─── Status de configuração ─────────────────────────────────────────────────

  @Get('status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Verificar status de configuração das integrações' })
  statusConfig() {
    return this.service.statusConfig();
  }

  // ─── Estatísticas ───────────────────────────────────────────────────────────

  @Get('estatisticas')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Estatísticas de logs por plataforma' })
  async estatisticas() {
    return this.service.estatisticas();
  }

  // ─── Logs ───────────────────────────────────────────────────────────────────

  @Get('logs')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Histórico de logs de integração' })
  @ApiQuery({ name: 'plataforma', required: false, enum: PlataformaIntegracao })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async logs(
    @Query('plataforma') plataforma?: PlataformaIntegracao,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.listar({
      plataforma,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
  }

  // ─── Sincronizar contato (ambas plataformas ou específica) ─────────────────

  @Post('sincronizar-contato')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sincronizar paciente como contato em RD Station e/ou LeadLovers' })
  async sincronizarContato(@Body() dto: SincronizarContatoDto) {
    const resultados: Record<string, unknown>[] = [];
    const plataformas = dto.plataforma
      ? [dto.plataforma]
      : Object.values(PlataformaIntegracao);

    for (const plat of plataformas) {
      if (plat === PlataformaIntegracao.RD_STATION) {
        const log = await this.service.rdStationSincronizarContato(dto.pacienteId, {
          nome: dto.nome,
          email: dto.email,
          telefone: dto.telefone,
        });
        resultados.push({ plataforma: 'RD_STATION', status: log.status, id: log.id });
      } else if (plat === PlataformaIntegracao.LEADLOVERS) {
        const log = await this.service.leadloversSincronizarContato(dto.pacienteId, {
          nome: dto.nome,
          email: dto.email,
          telefone: dto.telefone,
        });
        resultados.push({ plataforma: 'LEADLOVERS', status: log.status, id: log.id });
      }
    }

    return { resultados };
  }

  // ─── Registrar evento no RD Station ─────────────────────────────────────────

  @Post('evento-rd-station')
  @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Registrar evento de conversão no RD Station' })
  async registrarEvento(@Body() dto: RegistrarEventoDto) {
    const log = await this.service.rdStationRegistrarEvento(dto.pacienteId ?? null, {
      tipo: dto.tipo,
      email: dto.email,
      valor: dto.valor,
      dados: dto.dados,
    });
    return { status: log.status, id: log.id };
  }

  // ─── Webhook RD Station ──────────────────────────────────────────────────────

  @Post('webhook/rd-station')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Endpoint público para receber webhooks do RD Station' })
  async webhookRdStation(@Body() payload: Record<string, unknown>) {
    // Sem autenticação — RD Station não envia token no header
    const log = await this.service.processarWebhook(
      PlataformaIntegracao.RD_STATION,
      payload,
    );
    return { recebido: true, logId: log.id };
  }

  // ─── Webhook LeadLovers ──────────────────────────────────────────────────────

  @Post('webhook/leadlovers')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Endpoint público para receber webhooks do LeadLovers' })
  async webhookLeadLovers(@Body() payload: Record<string, unknown>) {
    const log = await this.service.processarWebhook(
      PlataformaIntegracao.LEADLOVERS,
      payload,
    );
    return { recebido: true, logId: log.id };
  }
}
