import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ComunicacaoLog,
  ComunicacaoMotivo,
  ComunicacaoStatus,
  ComunicacaoTipo,
} from '../../domain/entities/comunicacao-log.entity';

export interface EnvioParams {
  pacienteId: string;
  agendamentoId?: string;
  tipo: ComunicacaoTipo;
  motivo: ComunicacaoMotivo;
  destinatario: string;
  assunto: string;
  mensagem: string;
}

/**
 * Service de comunicação multicanal.
 * Suporta Email, SMS e WhatsApp.
 * Quando credenciais não estão configuradas, registra como SIMULADO (modo dev).
 */
@Injectable()
export class ComunicacaoService {
  private readonly logger = new Logger(ComunicacaoService.name);

  constructor(
    @InjectRepository(ComunicacaoLog)
    private readonly repo: Repository<ComunicacaoLog>,
    private readonly config: ConfigService,
  ) {}

  async enviar(params: EnvioParams): Promise<ComunicacaoLog> {
    const log = this.repo.create({
      pacienteId: params.pacienteId,
      agendamentoId: params.agendamentoId ?? null,
      tipo: params.tipo,
      motivo: params.motivo,
      status: ComunicacaoStatus.PENDENTE,
      destinatario: params.destinatario,
      assunto: params.assunto,
      mensagem: params.mensagem,
    });
    await this.repo.save(log);

    try {
      switch (params.tipo) {
        case ComunicacaoTipo.EMAIL:
          await this.enviarEmail(params);
          break;
        case ComunicacaoTipo.SMS:
          await this.enviarSms(params);
          break;
        case ComunicacaoTipo.WHATSAPP:
          await this.enviarWhatsApp(params);
          break;
      }

      log.status = ComunicacaoStatus.ENVIADO;
      log.enviadoEm = new Date();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      // Se for falta de config, marca como SIMULADO (não falha em dev)
      if (errMsg.includes('não configurad') || errMsg.includes('not configured')) {
        log.status = ComunicacaoStatus.SIMULADO;
        log.enviadoEm = new Date();
        this.logger.warn(`[SIMULADO] ${params.tipo} para ${params.destinatario}: ${errMsg}`);
      } else {
        log.status = ComunicacaoStatus.FALHOU;
        log.erroDetalhe = errMsg;
        this.logger.error(`Falha ao enviar ${params.tipo}:`, errMsg);
      }
    }

    return this.repo.save(log);
  }

  private async enviarEmail(params: EnvioParams): Promise<void> {
    const smtpHost = this.config.get<string>('SMTP_HOST');
    if (!smtpHost) {
      throw new Error('SMTP não configurado — defina SMTP_HOST no .env');
    }

    // Integração com Nodemailer (instalar: npm install nodemailer @types/nodemailer)
    // Descomentado assim que as credenciais SMTP estiverem no .env:
    //
    // const transporter = nodemailer.createTransport({
    //   host: smtpHost,
    //   port: this.config.get<number>('SMTP_PORT', 587),
    //   secure: false,
    //   auth: {
    //     user: this.config.get('SMTP_USER'),
    //     pass: this.config.get('SMTP_PASS'),
    //   },
    // });
    // await transporter.sendMail({
    //   from: `"Estética Natalia Salvador" <${this.config.get('SMTP_FROM')}>`,
    //   to: params.destinatario,
    //   subject: params.assunto,
    //   html: params.mensagem,
    // });

    this.logger.log(`[EMAIL] Para: ${params.destinatario} | Assunto: ${params.assunto}`);
  }

  private async enviarSms(params: EnvioParams): Promise<void> {
    const accountSid = this.config.get<string>('TWILIO_ACCOUNT_SID');
    if (!accountSid) {
      throw new Error('Twilio não configurado — defina TWILIO_ACCOUNT_SID no .env');
    }

    // Integração com Twilio (instalar: npm install twilio):
    //
    // const client = twilio(accountSid, this.config.get('TWILIO_AUTH_TOKEN'));
    // await client.messages.create({
    //   body: params.mensagem,
    //   from: this.config.get('TWILIO_FROM_NUMBER'),
    //   to: params.destinatario,
    // });

    this.logger.log(`[SMS] Para: ${params.destinatario} | Msg: ${params.mensagem.substring(0, 50)}...`);
  }

  private async enviarWhatsApp(params: EnvioParams): Promise<void> {
    const evolutionUrl = this.config.get<string>('EVOLUTION_API_URL');
    if (!evolutionUrl) {
      throw new Error('Evolution API não configurada — defina EVOLUTION_API_URL no .env');
    }

    // Integração com Evolution API (WhatsApp):
    //
    // await fetch(`${evolutionUrl}/message/sendText/${this.config.get('EVOLUTION_INSTANCE')}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'apikey': this.config.get('EVOLUTION_API_KEY'),
    //   },
    //   body: JSON.stringify({
    //     number: params.destinatario.replace(/\D/g, ''),
    //     text: params.mensagem,
    //   }),
    // });

    this.logger.log(`[WHATSAPP] Para: ${params.destinatario} | Msg: ${params.mensagem.substring(0, 50)}...`);
  }

  async listar(params: {
    page: number;
    limit: number;
    tipo?: ComunicacaoTipo;
    status?: ComunicacaoStatus;
    pacienteId?: string;
  }): Promise<{ data: ComunicacaoLog[]; total: number }> {
    const qb = this.repo.createQueryBuilder('c').orderBy('c.createdAt', 'DESC');

    if (params.tipo) qb.andWhere('c.tipo = :tipo', { tipo: params.tipo });
    if (params.status) qb.andWhere('c.status = :status', { status: params.status });
    if (params.pacienteId) qb.andWhere('c.pacienteId = :pid', { pid: params.pacienteId });

    qb.skip((params.page - 1) * params.limit).take(params.limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async estatisticas(): Promise<{
    totalEnviados: number;
    totalSimulados: number;
    totalFalhas: number;
    porTipo: Record<string, number>;
  }> {
    const rows = await this.repo
      .createQueryBuilder('c')
      .select('c.status', 'status')
      .addSelect('c.tipo', 'tipo')
      .addSelect('COUNT(*)', 'total')
      .groupBy('c.status')
      .addGroupBy('c.tipo')
      .getRawMany<{ status: string; tipo: string; total: string }>();

    const result = {
      totalEnviados: 0,
      totalSimulados: 0,
      totalFalhas: 0,
      porTipo: { EMAIL: 0, SMS: 0, WHATSAPP: 0 } as Record<string, number>,
    };

    for (const r of rows) {
      const n = parseInt(r.total, 10);
      if (r.status === ComunicacaoStatus.ENVIADO) result.totalEnviados += n;
      if (r.status === ComunicacaoStatus.SIMULADO) result.totalSimulados += n;
      if (r.status === ComunicacaoStatus.FALHOU) result.totalFalhas += n;
      result.porTipo[r.tipo] = (result.porTipo[r.tipo] ?? 0) + n;
    }

    return result;
  }
}
