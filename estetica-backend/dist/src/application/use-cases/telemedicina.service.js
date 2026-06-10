"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TelemedicinavService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemedicinavService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const sessao_telemedicina_entity_1 = require("../../domain/entities/sessao-telemedicina.entity");
let TelemedicinavService = TelemedicinavService_1 = class TelemedicinavService {
    repo;
    config;
    logger = new common_1.Logger(TelemedicinavService_1.name);
    JITSI_BASE = 'https://meet.jit.si';
    DAILY_API = 'https://api.daily.co/v1';
    constructor(repo, config) {
        this.repo = repo;
        this.config = config;
    }
    async criar(params) {
        const dailyKey = this.config.get('DAILY_CO_API_KEY');
        const plataforma = dailyKey ? sessao_telemedicina_entity_1.PlataformaVideo.DAILY_CO : sessao_telemedicina_entity_1.PlataformaVideo.JITSI;
        const roomId = (0, crypto_1.randomUUID)();
        const prefix = this.config.get('TELEMEDICINA_ROOM_PREFIX', 'estetica-ns');
        const roomName = `${prefix}-${roomId}`;
        let roomUrl = '';
        let tokenPaciente = null;
        let tokenProfissional = null;
        if (plataforma === sessao_telemedicina_entity_1.PlataformaVideo.DAILY_CO && dailyKey) {
            const resultado = await this.criarSalaDailyCo(dailyKey, roomName);
            roomUrl = resultado.roomUrl;
            tokenPaciente = resultado.tokenParticipante;
            tokenProfissional = resultado.tokenOwner;
        }
        else {
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
            status: sessao_telemedicina_entity_1.SessaoStatus.AGENDADA,
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
    async iniciar(id) {
        const sessao = await this.buscarEntidade(id);
        if (sessao.status === sessao_telemedicina_entity_1.SessaoStatus.ENCERRADA) {
            throw new common_1.BadRequestException('Sessão já encerrada.');
        }
        if (sessao.status === sessao_telemedicina_entity_1.SessaoStatus.CANCELADA) {
            throw new common_1.BadRequestException('Sessão cancelada não pode ser iniciada.');
        }
        sessao.status = sessao_telemedicina_entity_1.SessaoStatus.EM_ANDAMENTO;
        sessao.iniciadoEm = new Date();
        return this.computar(await this.repo.save(sessao));
    }
    async encerrar(id) {
        const sessao = await this.buscarEntidade(id);
        if (sessao.status === sessao_telemedicina_entity_1.SessaoStatus.ENCERRADA) {
            throw new common_1.BadRequestException('Sessão já encerrada.');
        }
        sessao.status = sessao_telemedicina_entity_1.SessaoStatus.ENCERRADA;
        sessao.encerradoEm = new Date();
        const dailyKey = this.config.get('DAILY_CO_API_KEY');
        if (sessao.plataforma === sessao_telemedicina_entity_1.PlataformaVideo.DAILY_CO && dailyKey) {
            this.encerrarSalaDailyCo(dailyKey, sessao.roomName).catch((e) => this.logger.warn(`Erro ao encerrar sala Daily.co: ${e.message}`));
        }
        return this.computar(await this.repo.save(sessao));
    }
    async cancelar(id) {
        const sessao = await this.buscarEntidade(id);
        if (sessao.status === sessao_telemedicina_entity_1.SessaoStatus.ENCERRADA) {
            throw new common_1.BadRequestException('Sessão encerrada não pode ser cancelada.');
        }
        sessao.status = sessao_telemedicina_entity_1.SessaoStatus.CANCELADA;
        return this.computar(await this.repo.save(sessao));
    }
    async adicionarArquivo(id, arquivo) {
        const sessao = await this.buscarEntidade(id);
        const lista = JSON.parse(sessao.arquivosJson || '[]');
        lista.push({ ...arquivo, uploadadoEm: new Date().toISOString() });
        if (lista.length > 20)
            lista.shift();
        sessao.arquivosJson = JSON.stringify(lista);
        return this.computar(await this.repo.save(sessao));
    }
    async buscarPorId(id) {
        const sessao = await this.buscarEntidade(id);
        return this.computar(sessao);
    }
    async listar(params) {
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
    statusConfig() {
        const dailyKey = this.config.get('DAILY_CO_API_KEY');
        return {
            plataforma: dailyKey ? 'DAILY_CO' : 'JITSI',
            configurado: true,
            roomPrefix: this.config.get('TELEMEDICINA_ROOM_PREFIX', 'estetica-ns'),
        };
    }
    async estatisticas() {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const amanha = new Date(hoje);
        amanha.setDate(amanha.getDate() + 1);
        const [agendadas, emAndamento, encerradas, canceladas, totalHoje] = await Promise.all([
            this.repo.count({ where: { status: sessao_telemedicina_entity_1.SessaoStatus.AGENDADA } }),
            this.repo.count({ where: { status: sessao_telemedicina_entity_1.SessaoStatus.EM_ANDAMENTO } }),
            this.repo.count({ where: { status: sessao_telemedicina_entity_1.SessaoStatus.ENCERRADA } }),
            this.repo.count({ where: { status: sessao_telemedicina_entity_1.SessaoStatus.CANCELADA } }),
            this.repo
                .createQueryBuilder('s')
                .where('s.createdAt >= :hoje', { hoje })
                .andWhere('s.createdAt < :amanha', { amanha })
                .getCount(),
        ]);
        return { agendadas, emAndamento, encerradas, canceladas, totalHoje };
    }
    async criarSalaDailyCo(apiKey, roomName) {
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
        const room = (await roomResp.json());
        const tokenParticipante = await this.criarTokenDailyCo(apiKey, roomName, false, expiry);
        const tokenOwner = await this.criarTokenDailyCo(apiKey, roomName, true, expiry);
        this.logger.log(`Sala Daily.co criada: ${room.url}`);
        return { roomUrl: room.url, tokenParticipante, tokenOwner };
    }
    async criarTokenDailyCo(apiKey, roomName, isOwner, expiry) {
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
        const data = (await resp.json());
        return data.token;
    }
    async encerrarSalaDailyCo(apiKey, roomName) {
        await fetch(`${this.DAILY_API}/rooms/${roomName}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${apiKey}` },
        });
    }
    async buscarEntidade(id) {
        const sessao = await this.repo.findOne({ where: { id } });
        if (!sessao)
            throw new common_1.NotFoundException(`Sessão de telemedicina ${id} não encontrada.`);
        return sessao;
    }
    computar(sessao) {
        const arquivos = JSON.parse(sessao.arquivosJson || '[]');
        let duracaoMinutos = null;
        if (sessao.iniciadoEm && sessao.encerradoEm) {
            duracaoMinutos = Math.round((sessao.encerradoEm.getTime() - sessao.iniciadoEm.getTime()) / 60000);
        }
        return {
            ...sessao,
            arquivos,
            duracaoMinutos,
            urlEntradaPaciente: sessao.plataforma === sessao_telemedicina_entity_1.PlataformaVideo.DAILY_CO && sessao.tokenPaciente
                ? `${sessao.roomUrl}?t=${sessao.tokenPaciente}`
                : sessao.roomUrl,
            urlEntradaProfissional: sessao.plataforma === sessao_telemedicina_entity_1.PlataformaVideo.DAILY_CO && sessao.tokenProfissional
                ? `${sessao.roomUrl}?t=${sessao.tokenProfissional}`
                : sessao.roomUrl,
        };
    }
};
exports.TelemedicinavService = TelemedicinavService;
exports.TelemedicinavService = TelemedicinavService = TelemedicinavService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sessao_telemedicina_entity_1.SessaoTelemedicina)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], TelemedicinavService);
//# sourceMappingURL=telemedicina.service.js.map