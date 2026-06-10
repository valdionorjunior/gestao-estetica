import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserRole } from '../../domain/entities/user-role.enum';
import { TelemedicinavService } from '../../application/use-cases/telemedicina.service';
import { SessaoStatus } from '../../domain/entities/sessao-telemedicina.entity';

// ─── DTOs ─────────────────────────────────────────────────────────────────────

class CriarSessaoDto {
  @ApiProperty()
  @IsUUID('4', { message: 'pacienteId deve ser UUID válido' })
  pacienteId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  pacienteNome: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail({}, { message: 'E-mail do paciente inválido' })
  pacienteEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  pacienteTelefone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  profissionalId?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  profissionalNome: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  agendamentoId?: string;

  @ApiPropertyOptional({ description: 'ISO 8601 — ex: 2024-05-20T14:30:00Z' })
  @IsOptional()
  @IsDateString({}, { message: 'agendadoPara deve ser data ISO 8601 válida' })
  agendadoPara?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  observacoes?: string;
}

class AdicionarArquivoDto {
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  nome: string;

  @ApiProperty()
  @IsString()
  @MaxLength(500)
  url: string;

  @ApiProperty({ example: 'application/pdf' })
  @IsString()
  tipo: string;

  @ApiProperty()
  tamanho: number;
}

interface JwtPayload {
  sub: string;
  nome?: string;
  email?: string;
  role?: string;
}

@ApiTags('Telemedicina')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('telemedicina')
export class TelemediicinaController {
  constructor(private readonly service: TelemedicinavService) {}

  // ─── Status de configuração ─────────────────────────────────────────────────

  @Get('status')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.RECEPCIONISTA)
  @ApiOperation({ summary: 'Status da plataforma de videoconferência configurada' })
  statusConfig() {
    return this.service.statusConfig();
  }

  // ─── Estatísticas ───────────────────────────────────────────────────────────

  @Get('estatisticas')
  @Roles(UserRole.ADMIN, UserRole.MEDICO)
  @ApiOperation({ summary: 'Estatísticas das sessões de telemedicina' })
  async estatisticas() {
    return this.service.estatisticas();
  }

  // ─── Criar sessão ───────────────────────────────────────────────────────────

  @Post('sessoes')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.RECEPCIONISTA)
  @ApiOperation({ summary: 'Criar nova sessão de telemedicina' })
  async criar(@Body() dto: CriarSessaoDto) {
    return this.service.criar({
      pacienteId: dto.pacienteId,
      pacienteNome: dto.pacienteNome,
      pacienteEmail: dto.pacienteEmail,
      pacienteTelefone: dto.pacienteTelefone,
      profissionalId: dto.profissionalId,
      profissionalNome: dto.profissionalNome,
      agendamentoId: dto.agendamentoId,
      agendadoPara: dto.agendadoPara ? new Date(dto.agendadoPara) : undefined,
      observacoes: dto.observacoes,
    });
  }

  // ─── Listar sessões ─────────────────────────────────────────────────────────

  @Get('sessoes')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.RECEPCIONISTA)
  @ApiOperation({ summary: 'Listar sessões de telemedicina' })
  @ApiQuery({ name: 'pacienteId', required: false })
  @ApiQuery({ name: 'profissionalId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: SessaoStatus })
  @ApiQuery({ name: 'page', required: false })
  async listar(
    @Query('pacienteId') pacienteId?: string,
    @Query('profissionalId') profissionalId?: string,
    @Query('status') status?: SessaoStatus,
    @Query('page') page?: string,
  ) {
    return this.service.listar({
      pacienteId,
      profissionalId,
      status,
      page: page ? Number(page) : 1,
    });
  }

  // ─── Minhas sessões (profissional logado) ────────────────────────────────────

  @Get('sessoes/minhas')
  @Roles(UserRole.MEDICO, UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar sessões do profissional logado' })
  async minhas(
    @CurrentUser() user: JwtPayload,
    @Query('status') status?: SessaoStatus,
    @Query('page') page?: string,
  ) {
    return this.service.listar({
      profissionalId: user.sub,
      status,
      page: page ? Number(page) : 1,
    });
  }

  // ─── Buscar sessão por ID ────────────────────────────────────────────────────

  @Get('sessoes/:id')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.RECEPCIONISTA)
  @ApiOperation({ summary: 'Buscar sessão por ID' })
  async buscar(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.buscarPorId(id);
  }

  // ─── Iniciar sessão ──────────────────────────────────────────────────────────

  @Post('sessoes/:id/iniciar')
  @Roles(UserRole.ADMIN, UserRole.MEDICO)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sessão de telemedicina' })
  async iniciar(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.iniciar(id);
  }

  // ─── Encerrar sessão ─────────────────────────────────────────────────────────

  @Post('sessoes/:id/encerrar')
  @Roles(UserRole.ADMIN, UserRole.MEDICO)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Encerrar sessão de telemedicina' })
  async encerrar(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.encerrar(id);
  }

  // ─── Cancelar sessão ─────────────────────────────────────────────────────────

  @Post('sessoes/:id/cancelar')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.RECEPCIONISTA)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar sessão de telemedicina' })
  async cancelar(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.cancelar(id);
  }

  // ─── Adicionar arquivo compartilhado ─────────────────────────────────────────

  @Post('sessoes/:id/arquivo')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.RECEPCIONISTA)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Registrar arquivo compartilhado durante a sessão' })
  async adicionarArquivo(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdicionarArquivoDto,
  ) {
    return this.service.adicionarArquivo(id, {
      nome: dto.nome,
      url: dto.url,
      tipo: dto.tipo,
      tamanho: dto.tamanho,
    });
  }

  // ─── Enum de status (para select de filtro) ───────────────────────────────────

  @Get('status-opcoes')
  @Roles(UserRole.ADMIN, UserRole.MEDICO, UserRole.RECEPCIONISTA)
  @ApiOperation({ summary: 'Opções de status para filtros' })
  statusOpcoes() {
    return Object.values(SessaoStatus);
  }
}
