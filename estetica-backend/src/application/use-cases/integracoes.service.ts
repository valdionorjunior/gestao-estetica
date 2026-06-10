import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  IntegracaoAcao,
  IntegracaoLog,
  IntegracaoStatus,
  PlataformaIntegracao,
} from '../../domain/entities/integracao-log.entity';

interface ContatoPayload {
  nome: string;
  email?: string;
  telefone?: string;
  tags?: string[];
  camposExtras?: Record<string, string>;
}

interface EventoPayload {
  tipo: string;
  email?: string;
  valor?: number;
  dados?: Record<string, unknown>;
}

export interface LogSummary {
  plataforma: string;
  sucesso: number;
  falha: number;
  simulado: number;
  ultimaSincronizacao: Date | null;
}

@Injectable()
export class IntegracoesService {
  private readonly logger = new Logger(IntegracoesService.name);

  constructor(
    @InjectRepository(IntegracaoLog)
    private readonly repo: Repository<IntegracaoLog>,
    private readonly config: ConfigService,
  ) {}

  // ─── RD STATION ──────────────────────────────────────────────────────────────

  async rdStationSincronizarContato(
    pacienteId: string,
    contato: ContatoPayload,
  ): Promise<IntegracaoLog> {
    const apiKey = this.config.get<string>('RD_STATION_API_KEY');
    const payload = {
      contact: {
        name: contato.nome,
        email: contato.email,
        mobile_phone: contato.telefone,
        tags: contato.tags ?? ['estetica-ns'],
        ...contato.camposExtras,
      },
    };

    return this.executar({
      plataforma: PlataformaIntegracao.RD_STATION,
      acao: IntegracaoAcao.SINCRONIZAR_CONTATO,
      pacienteId,
      payload,
      handler: async () => {
        if (!apiKey) throw new Error('RD_STATION_API_KEY não configurada');
        const resp = await fetch('https://api.rd.services/platform/contacts', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        if (!resp.ok) {
          const err = await resp.text();
          throw new Error(`RD Station: ${resp.status} — ${err}`);
        }
        const data = (await resp.json()) as { uuid?: string };
        return { idExterno: data.uuid };
      },
    });
  }

  async rdStationRegistrarEvento(
    pacienteId: string | null,
    evento: EventoPayload,
  ): Promise<IntegracaoLog> {
    const apiKey = this.config.get<string>('RD_STATION_API_KEY');
    const payload = {
      event_type: evento.tipo,
      event_family: 'CDP',
      payload: {
        email: evento.email,
        value: evento.valor,
        ...evento.dados,
      },
    };

    return this.executar({
      plataforma: PlataformaIntegracao.RD_STATION,
      acao: IntegracaoAcao.REGISTRAR_EVENTO,
      pacienteId,
      payload,
      handler: async () => {
        if (!apiKey) throw new Error('RD_STATION_API_KEY não configurada');
        const resp = await fetch('https://api.rd.services/platform/events', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        if (!resp.ok) {
          const err = await resp.text();
          throw new Error(`RD Station evento: ${resp.status} — ${err}`);
        }
        return {};
      },
    });
  }

  // ─── LEADLOVERS ──────────────────────────────────────────────────────────────

  async leadloversSincronizarContato(
    pacienteId: string,
    contato: ContatoPayload,
  ): Promise<IntegracaoLog> {
    const apiKey = this.config.get<string>('LEADLOVERS_API_KEY');
    const maquinaId = this.config.get<string>('LEADLOVERS_MAQUINA_ID');
    const payload = {
      EmailLead: contato.email,
      NomeLead: contato.nome,
      TelefoneLead: contato.telefone,
      CodigoMaquina: maquinaId,
      Tags: (contato.tags ?? ['estetica-ns']).join(','),
    };

    return this.executar({
      plataforma: PlataformaIntegracao.LEADLOVERS,
      acao: IntegracaoAcao.SINCRONIZAR_CONTATO,
      pacienteId,
      payload,
      handler: async () => {
        if (!apiKey || !maquinaId)
          throw new Error('LEADLOVERS_API_KEY ou LEADLOVERS_MAQUINA_ID não configurados');
        const resp = await fetch(
          'https://api.leadlovers.com/api/v2/lead',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          },
        );
        if (!resp.ok) {
          const err = await resp.text();
          throw new Error(`LeadLovers: ${resp.status} — ${err}`);
        }
        const data = (await resp.json()) as { id?: string };
        return { idExterno: String(data.id ?? '') };
      },
    });
  }

  // ─── Processar webhook recebido ──────────────────────────────────────────────

  async processarWebhook(
    plataforma: PlataformaIntegracao,
    payload: Record<string, unknown>,
  ): Promise<IntegracaoLog> {
    return this.executar({
      plataforma,
      acao: IntegracaoAcao.WEBHOOK_RECEBIDO,
      pacienteId: null,
      payload,
      handler: async () => {
        // Extrair dados do lead recebido
        const email =
          (payload['email'] as string | undefined) ??
          (payload['email_lead'] as string | undefined) ??
          null;
        const nome =
          (payload['name'] as string | undefined) ??
          (payload['nome_lead'] as string | undefined) ??
          'Lead sem nome';

        this.logger.log(
          `Webhook ${plataforma} — novo lead: ${nome} <${email ?? 'sem email'}>`,
        );
        return { idExterno: email ?? undefined };
      },
    });
  }

  // ─── Listar logs ─────────────────────────────────────────────────────────────

  async listar(params: {
    plataforma?: PlataformaIntegracao;
    page?: number;
    limit?: number;
  }): Promise<{ data: IntegracaoLog[]; total: number }> {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, params.limit ?? 20);
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder('l')
      .orderBy('l.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (params.plataforma) {
      qb.where('l.plataforma = :plataforma', { plataforma: params.plataforma });
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  // ─── Estatísticas por plataforma ─────────────────────────────────────────────

  async estatisticas(): Promise<LogSummary[]> {
    const rows = await this.repo
      .createQueryBuilder('l')
      .select('l.plataforma', 'plataforma')
      .addSelect(
        `SUM(CASE WHEN l.status = '${IntegracaoStatus.SUCESSO}' THEN 1 ELSE 0 END)`,
        'sucesso',
      )
      .addSelect(
        `SUM(CASE WHEN l.status = '${IntegracaoStatus.FALHOU}' THEN 1 ELSE 0 END)`,
        'falha',
      )
      .addSelect(
        `SUM(CASE WHEN l.status = '${IntegracaoStatus.SIMULADO}' THEN 1 ELSE 0 END)`,
        'simulado',
      )
      .addSelect('MAX(l.createdAt)', 'ultimaSincronizacao')
      .groupBy('l.plataforma')
      .getRawMany<{
        plataforma: string;
        sucesso: string;
        falha: string;
        simulado: string;
        ultimaSincronizacao: string;
      }>();

    return rows.map((r) => ({
      plataforma: r.plataforma,
      sucesso: Number(r.sucesso ?? 0),
      falha: Number(r.falha ?? 0),
      simulado: Number(r.simulado ?? 0),
      ultimaSincronizacao: r.ultimaSincronizacao ? new Date(r.ultimaSincronizacao) : null,
    }));
  }

  // ─── Status de configuração das integrações ──────────────────────────────────

  statusConfig(): {
    rdStation: boolean;
    leadlovers: boolean;
  } {
    return {
      rdStation: !!this.config.get<string>('RD_STATION_API_KEY'),
      leadlovers:
        !!this.config.get<string>('LEADLOVERS_API_KEY') &&
        !!this.config.get<string>('LEADLOVERS_MAQUINA_ID'),
    };
  }

  // ─── Helper executor com tratamento gracioso ─────────────────────────────────

  private async executar(params: {
    plataforma: PlataformaIntegracao;
    acao: IntegracaoAcao;
    pacienteId: string | null;
    payload: Record<string, unknown>;
    handler: () => Promise<{ idExterno?: string }>;
  }): Promise<IntegracaoLog> {
    let status = IntegracaoStatus.SUCESSO;
    let resposta: string | null = null;
    let idExterno: string | null = null;

    try {
      const resultado = await params.handler();
      idExterno = resultado.idExterno ?? null;
      resposta = 'OK';
      this.logger.log(`[${params.plataforma}] ${params.acao} — SUCESSO`);
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.includes('não configurad') || msg.includes('not configured')) {
        status = IntegracaoStatus.SIMULADO;
        resposta = `SIMULADO: ${msg}`;
        this.logger.warn(`[${params.plataforma}] ${params.acao} — SIMULADO (sem credenciais)`);
      } else {
        status = IntegracaoStatus.FALHOU;
        resposta = msg;
        this.logger.error(`[${params.plataforma}] ${params.acao} — FALHOU: ${msg}`);
      }
    }

    const log = this.repo.create({
      plataforma: params.plataforma,
      acao: params.acao,
      status,
      pacienteId: params.pacienteId,
      idExterno,
      payloadJson: JSON.stringify(params.payload),
      resposta,
    });

    return this.repo.save(log);
  }
}
