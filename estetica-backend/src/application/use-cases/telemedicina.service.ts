import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import {
  PlataformaVideo,
  SessaoStatus,
  SessaoTelemedicina,
} from '../../domain/entities/sessao-telemedicina.entity';

// ─── Tipos públicos ───────────────────────────────────────────────────────────

export interface CriarSessaoParams {
  pacienteId: string;
  pacienteNome: string;
  pacienteEmail?: string;
  pacienteTelefone?: string;
  profissionalId?: string;
  profissionalNome: string;
  agendamentoId?: string;
  agendadoPara?: Date;
  observacoes?: string;
}

export interface ArquivoSessao {
  nome: string;
  url: string;
  tipo: string;
  tamanho: number;
  uploadadoEm: string;
}

export interface SessaoComputada extends SessaoTelemedicina {
  duracaoMinutos: number | null;
  arquivos: ArquivoSessao[];
  urlEntradaPaciente: string;
  urlEntradaProfissional: string;
}

// ─── Serviço ──────────────────────────────────────────────────────────────────

@Injectable()
export class TelemedicinavService {
  private readonly logger = new Logger(TelemedicinavService.name);
  private readonly JITSI_BASE = 'https://meet.jit.si';
  private readonly DAILY_API = 'https://api.daily.co/v1';

  constructor(
    @InjectRepository(SessaoTelemedicina)
    private readonly repo: Repository<SessaoTelemedicina>,
    private readonly config: ConfigService,
  ) {}

  // ─── Criar sessão ─────────────────────────────────────────────────────────────

  async criar(params: CriarSessaoParams): Promise<SessaoComputada> {
    const dailyKey = this.config.get<string>('DAILY_CO_API_KEY');
    const plataforma = dailyKey ? PlataformaVideo.DAILY_CO : PlataformaVideo.JITSI;

    const roomId = randomUUID();
    const prefix = this.config.get<string>('TELEMEDICINA_ROOM_PREFIX', 'estetica-ns');
    const roomName = `${prefix}-${roomId}`;

    let roomUrl = '';
    let tokenPaciente: string | null = null;
    let tokenProfissional: string | null = null;

    if (plataforma === PlataformaVideo.DAILY_CO && dailyKey) {
      const resultado = await this.criarSalaDailyCo(dailyKey, roomName);
      roomUrl = resultado.roomUrl;
      tokenPaciente = resultado.tokenParticipante;
      tokenProfissional = resultado.tokenOwner;
    } else {
      // Jitsi Meet — sem API key, funciona imediatamente
      roomUrl = `${this.JITSI_BASE}/${roomName}`;
      tokenPaciente = roomUrl;
      tokenProfissional = roomUrl;
      this.logger.log(`Sessão Jitsi criada: ${roomUrl}`);
    }

    const sessao = this.repo.create({
      pacienteId: params.pacienteId,
      pacienteNome: params.pacienteNome,
      pacienteEmail: params.pacienteEmail ?? null,
      pacienteTelefone: params.pacienteTelefone ?? null,
      profissionalId: params.profissionalId ?? null,
      profissionalNome: params.profissionalNome,
      agendamentoId: params.agendamentoId ?? null,
      status: SessaoStatus.AGENDADA,
      plataforma,
      roomName,
      roomUrl,
      tokenPaciente,
      tokenProfissional,
      agendadoPara: params.agendadoPara ?? null,
      observacoes: params.observacoes ?? null,
      arquivosJson: '[]',
    });

    const salvo = await this.repo.save(sessao);
    return this.computar(salvo);
  }

  // ─── Iniciar sessão ───────────────────────────────────────────────────────────

  async iniciar(id: string): Promise<SessaoComputada> {
    const sessao = await this.buscarEntidade(id);
    if (sessao.status === SessaoStatus.ENCERRADA) {
      throw new BadRequestException('Sessão já encerrada.');
    }
    if (sessao.status === SessaoStatus.CANCELADA) {
      throw new BadRequestException('Sessão cancelada não pode ser iniciada.');
    }
    sessao.status = SessaoStatus.EM_ANDAMENTO;
    sessao.iniciadoEm = new Date();
    return this.computar(await this.repo.save(sessao));
  }

  // ─── Encerrar sessão ──────────────────────────────────────────────────────────

  async encerrar(id: string): Promise<SessaoComputada> {
    const sessao = await this.buscarEntidade(id);
    if (sessao.status === SessaoStatus.ENCERRADA) {
      throw new BadRequestException('Sessão já encerrada.');
    }
    sessao.status = SessaoStatus.ENCERRADA;
    sessao.encerradoEm = new Date();

    // Encerrar sala no Daily.co (fire-and-forget)
    const dailyKey = this.config.get<string>('DAILY_CO_API_KEY');
    if (sessao.plataforma === PlataformaVideo.DAILY_CO && dailyKey) {
      this.encerrarSalaDailyCo(dailyKey, sessao.roomName).catch((e) =>
        this.logger.warn(`Erro ao encerrar sala Daily.co: ${(e as Error).message}`),
      );
    }

    return this.computar(await this.repo.save(sessao));
  }

  // ─── Cancelar sessão ─────────────────────────────────────────────────────────

  async cancelar(id: string): Promise<SessaoComputada> {
    const sessao = await this.buscarEntidade(id);
    if (sessao.status === SessaoStatus.ENCERRADA) {
      throw new BadRequestException('Sessão encerrada não pode ser cancelada.');
    }
    sessao.status = SessaoStatus.CANCELADA;
    return this.computar(await this.repo.save(sessao));
  }

  // ─── Adicionar arquivo compartilhado ─────────────────────────────────────────

  async adicionarArquivo(
    id: string,
    arquivo: Omit<ArquivoSessao, 'uploadadoEm'>,
  ): Promise<SessaoComputada> {
    const sessao = await this.buscarEntidade(id);
    const lista: ArquivoSessao[] = JSON.parse(sessao.arquivosJson || '[]') as ArquivoSessao[];
    lista.push({ ...arquivo, uploadadoEm: new Date().toISOString() });
    // Limite de 20 arquivos por sessão
    if (lista.length > 20) lista.shift();
    sessao.arquivosJson = JSON.stringify(lista);
    return this.computar(await this.repo.save(sessao));
  }

  // ─── Buscar por ID ────────────────────────────────────────────────────────────

  async buscarPorId(id: string): Promise<SessaoComputada> {
    const sessao = await this.buscarEntidade(id);
    return this.computar(sessao);
  }

  // ─── Listar sessões ───────────────────────────────────────────────────────────

  async listar(params: {
    pacienteId?: string;
    profissionalId?: string;
    status?: SessaoStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: SessaoComputada[]; total: number }> {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, params.limit ?? 20);

    const qb = this.repo
      .createQueryBuilder('s')
      .orderBy('s.agendadoPara', 'DESC', 'NULLS LAST')
      .addOrderBy('s.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (params.pacienteId) {
      qb.andWhere('s.pacienteId = :pacienteId', { pacienteId: params.pacienteId });
    }
    if (params.profissionalId) {
      qb.andWhere('s.profissionalId = :profissionalId', { profissionalId: params.profissionalId });
    }
    if (params.status) {
      qb.andWhere('s.status = :status', { status: params.status });
    }

    const [data, total] = await qb.getManyAndCount();
    return { data: data.map((s) => this.computar(s)), total };
  }

  // ─── Status de configuração ─────────────────────────────────────────────────

  statusConfig(): {
    plataforma: 'DAILY_CO' | 'JITSI';
    configurado: boolean;
    roomPrefix: string;
  } {
    const dailyKey = this.config.get<string>('DAILY_CO_API_KEY');
    return {
      plataforma: dailyKey ? 'DAILY_CO' : 'JITSI',
      configurado: true, // Jitsi não precisa de config
      roomPrefix: this.config.get<string>('TELEMEDICINA_ROOM_PREFIX', 'estetica-ns'),
    };
  }

  // ─── Estatísticas ─────────────────────────────────────────────────────────────

  async estatisticas(): Promise<{
    agendadas: number;
    emAndamento: number;
    encerradas: number;
    canceladas: number;
    totalHoje: number;
  }> {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const [agendadas, emAndamento, encerradas, canceladas, totalHoje] = await Promise.all([
      this.repo.count({ where: { status: SessaoStatus.AGENDADA } }),
      this.repo.count({ where: { status: SessaoStatus.EM_ANDAMENTO } }),
      this.repo.count({ where: { status: SessaoStatus.ENCERRADA } }),
      this.repo.count({ where: { status: SessaoStatus.CANCELADA } }),
      this.repo
        .createQueryBuilder('s')
        .where('s.createdAt >= :hoje', { hoje })
        .andWhere('s.createdAt < :amanha', { amanha })
        .getCount(),
    ]);

    return { agendadas, emAndamento, encerradas, canceladas, totalHoje };
  }

  // ─── Daily.co helpers ─────────────────────────────────────────────────────────

  private async criarSalaDailyCo(
    apiKey: string,
    roomName: string,
  ): Promise<{ roomUrl: string; tokenParticipante: string; tokenOwner: string }> {
    // Criar sala com expiração de 24h
    const expiry = Math.floor(Date.now() / 1000) + 60 * 60 * 24;

    const roomResp = await fetch(`${this.DAILY_API}/rooms`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: roomName,
        privacy: 'private',
        properties: {
          exp: expiry,
          enable_recording: false,
          start_video_off: false,
          start_audio_off: false,
        },
      }),
    });

    if (!roomResp.ok) {
      const err = await roomResp.text();
      throw new Error(`Daily.co criar sala: ${roomResp.status} — ${err}`);
    }

    const room = (await roomResp.json()) as { url: string };

    // Token do participante (paciente)
    const tokenParticipante = await this.criarTokenDailyCo(apiKey, roomName, false, expiry);
    // Token do owner (profissional com controles de host)
    const tokenOwner = await this.criarTokenDailyCo(apiKey, roomName, true, expiry);

    this.logger.log(`Sala Daily.co criada: ${room.url}`);
    return { roomUrl: room.url, tokenParticipante, tokenOwner };
  }

  private async criarTokenDailyCo(
    apiKey: string,
    roomName: string,
    isOwner: boolean,
    expiry: number,
  ): Promise<string> {
    const resp = await fetch(`${this.DAILY_API}/meeting-tokens`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        properties: {
          room_name: roomName,
          is_owner: isOwner,
          exp: expiry,
        },
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Daily.co token: ${resp.status} — ${err}`);
    }

    const data = (await resp.json()) as { token: string };
    return data.token;
  }

  private async encerrarSalaDailyCo(apiKey: string, roomName: string): Promise<void> {
    await fetch(`${this.DAILY_API}/rooms/${roomName}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiKey}` },
    });
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────────

  private async buscarEntidade(id: string): Promise<SessaoTelemedicina> {
    const sessao = await this.repo.findOne({ where: { id } });
    if (!sessao) throw new NotFoundException(`Sessão de telemedicina ${id} não encontrada.`);
    return sessao;
  }

  private computar(sessao: SessaoTelemedicina): SessaoComputada {
    const arquivos: ArquivoSessao[] = JSON.parse(sessao.arquivosJson || '[]') as ArquivoSessao[];

    let duracaoMinutos: number | null = null;
    if (sessao.iniciadoEm && sessao.encerradoEm) {
      duracaoMinutos = Math.round(
        (sessao.encerradoEm.getTime() - sessao.iniciadoEm.getTime()) / 60000,
      );
    }

    return {
      ...sessao,
      arquivos,
      duracaoMinutos,
      urlEntradaPaciente:
        sessao.plataforma === PlataformaVideo.DAILY_CO && sessao.tokenPaciente
          ? `${sessao.roomUrl}?t=${sessao.tokenPaciente}`
          : sessao.roomUrl,
      urlEntradaProfissional:
        sessao.plataforma === PlataformaVideo.DAILY_CO && sessao.tokenProfissional
          ? `${sessao.roomUrl}?t=${sessao.tokenProfissional}`
          : sessao.roomUrl,
    };
  }
}
