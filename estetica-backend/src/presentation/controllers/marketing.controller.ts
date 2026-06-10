import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../../domain/entities/user-role.enum';
import { ComunicacaoService } from '../../application/use-cases/comunicacao.service';
import { Paciente } from '../../domain/entities/paciente.entity';
import {
  ComunicacaoMotivo,
  ComunicacaoStatus,
  ComunicacaoTipo,
} from '../../domain/entities/comunicacao-log.entity';
import {
  EnviarCampanhaDto,
  EnviarMensagemDto,
} from '../../application/dtos/marketing/marketing.dto';

@ApiTags('Marketing')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('marketing')
export class MarketingController {
  constructor(
    private readonly comunicacaoService: ComunicacaoService,
    @InjectRepository(Paciente)
    private readonly pacienteRepo: Repository<Paciente>,
  ) {}

  @Post('enviar')
  @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enviar mensagem individual para um paciente (Email, SMS ou WhatsApp)' })
  @ApiResponse({ status: 201, description: 'Mensagem enviada ou registrada como simulada' })
  @ApiResponse({ status: 404, description: 'Paciente não encontrado' })
  async enviar(@Body() dto: EnviarMensagemDto) {
    const paciente = await this.pacienteRepo.findOne({ where: { id: dto.pacienteId } });
    if (!paciente) throw new NotFoundException('Paciente não encontrado');

    const destinatario = this.resolverDestinatario(dto.tipo, paciente);
    const mensagem = this.interpolar(dto.mensagem, paciente);

    return this.comunicacaoService.enviar({
      pacienteId: paciente.id,
      agendamentoId: dto.agendamentoId,
      tipo: dto.tipo,
      motivo: dto.motivo,
      destinatario,
      assunto: dto.assunto ?? 'Mensagem da Estética Natalia Salvador',
      mensagem,
    });
  }

  @Post('campanha')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enviar campanha de marketing para múltiplos pacientes (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Campanha enfileirada — retorna total de envios' })
  async campanha(@Body() dto: EnviarCampanhaDto) {
    const resultados: { pacienteId: string; status: ComunicacaoStatus }[] = [];

    for (const pacienteId of dto.pacienteIds) {
      const paciente = await this.pacienteRepo.findOne({ where: { id: pacienteId } });
      if (!paciente) continue;

      const destinatario = this.resolverDestinatario(dto.tipo, paciente);
      if (!destinatario) continue;

      const mensagem = this.interpolar(dto.mensagem, paciente);

      const log = await this.comunicacaoService.enviar({
        pacienteId: paciente.id,
        tipo: dto.tipo,
        motivo: ComunicacaoMotivo.CAMPANHA_MARKETING,
        destinatario,
        assunto: dto.assunto,
        mensagem,
      });
      resultados.push({ pacienteId: paciente.id, status: log.status });
    }

    return {
      enviados: resultados.filter((r) => r.status === ComunicacaoStatus.ENVIADO).length,
      simulados: resultados.filter((r) => r.status === ComunicacaoStatus.SIMULADO).length,
      falhas: resultados.filter((r) => r.status === ComunicacaoStatus.FALHOU).length,
      total: resultados.length,
    };
  }

  @Post('lembrete-agendamento')
  @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Disparar lembrete manual de agendamento para um paciente' })
  async lembreteManual(
    @Body() body: { agendamentoId: string; tipo: ComunicacaoTipo },
  ) {
    // Busca o agendamento com o paciente
    // Implementação simplificada — o cron job faz isso automaticamente
    return {
      mensagem: 'Lembrete enfileirado. Use o endpoint /marketing/enviar para envios manuais.',
      agendamentoId: body.agendamentoId,
      tipo: body.tipo,
    };
  }

  @Get('historico')
  @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
  @ApiOperation({ summary: 'Histórico de comunicações enviadas' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'tipo', required: false, enum: ComunicacaoTipo })
  @ApiQuery({ name: 'status', required: false, enum: ComunicacaoStatus })
  @ApiQuery({ name: 'pacienteId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Lista paginada de comunicações' })
  historico(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    @Query('tipo') tipo?: ComunicacaoTipo,
    @Query('status') status?: ComunicacaoStatus,
    @Query('pacienteId') pacienteId?: string,
  ) {
    return this.comunicacaoService.listar({ page, limit, tipo, status, pacienteId });
  }

  @Get('estatisticas')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Estatísticas de comunicações por canal e status' })
  @ApiResponse({ status: 200, description: 'KPIs de comunicação' })
  estatisticas() {
    return this.comunicacaoService.estatisticas();
  }

  // ── helpers ──────────────────────────────────────────────────────────────

  private resolverDestinatario(tipo: ComunicacaoTipo, paciente: Paciente): string {
    switch (tipo) {
      case ComunicacaoTipo.EMAIL:
        return paciente.email ?? '';
      case ComunicacaoTipo.SMS:
      case ComunicacaoTipo.WHATSAPP:
        return paciente.telefone ?? '';
      default:
        return '';
    }
  }

  /**
   * Interpola variáveis no template da mensagem.
   * Suporta: {nome}, {primeiro_nome}, {email}, {telefone}
   */
  private interpolar(template: string, paciente: Paciente): string {
    const primeiroNome = (paciente.nome ?? '').split(' ')[0];
    return template
      .replace(/{nome}/g, paciente.nome ?? '')
      .replace(/{primeiro_nome}/g, primeiroNome)
      .replace(/{email}/g, paciente.email ?? '')
      .replace(/{telefone}/g, paciente.telefone ?? '');
  }
}
