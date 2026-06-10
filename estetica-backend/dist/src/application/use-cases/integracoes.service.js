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
var IntegracoesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegracoesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const integracao_log_entity_1 = require("../../domain/entities/integracao-log.entity");
let IntegracoesService = IntegracoesService_1 = class IntegracoesService {
    repo;
    config;
    logger = new common_1.Logger(IntegracoesService_1.name);
    constructor(repo, config) {
        this.repo = repo;
        this.config = config;
    }
    async rdStationSincronizarContato(pacienteId, contato) {
        const apiKey = this.config.get('RD_STATION_API_KEY');
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
            plataforma: integracao_log_entity_1.PlataformaIntegracao.RD_STATION,
            acao: integracao_log_entity_1.IntegracaoAcao.SINCRONIZAR_CONTATO,
            pacienteId,
            payload,
            handler: async () => {
                if (!apiKey)
                    throw new Error('RD_STATION_API_KEY não configurada');
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
                const data = (await resp.json());
                return { idExterno: data.uuid };
            },
        });
    }
    async rdStationRegistrarEvento(pacienteId, evento) {
        const apiKey = this.config.get('RD_STATION_API_KEY');
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
            plataforma: integracao_log_entity_1.PlataformaIntegracao.RD_STATION,
            acao: integracao_log_entity_1.IntegracaoAcao.REGISTRAR_EVENTO,
            pacienteId,
            payload,
            handler: async () => {
                if (!apiKey)
                    throw new Error('RD_STATION_API_KEY não configurada');
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
    async leadloversSincronizarContato(pacienteId, contato) {
        const apiKey = this.config.get('LEADLOVERS_API_KEY');
        const maquinaId = this.config.get('LEADLOVERS_MAQUINA_ID');
        const payload = {
            EmailLead: contato.email,
            NomeLead: contato.nome,
            TelefoneLead: contato.telefone,
            CodigoMaquina: maquinaId,
            Tags: (contato.tags ?? ['estetica-ns']).join(','),
        };
        return this.executar({
            plataforma: integracao_log_entity_1.PlataformaIntegracao.LEADLOVERS,
            acao: integracao_log_entity_1.IntegracaoAcao.SINCRONIZAR_CONTATO,
            pacienteId,
            payload,
            handler: async () => {
                if (!apiKey || !maquinaId)
                    throw new Error('LEADLOVERS_API_KEY ou LEADLOVERS_MAQUINA_ID não configurados');
                const resp = await fetch('https://api.leadlovers.com/api/v2/lead', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
                if (!resp.ok) {
                    const err = await resp.text();
                    throw new Error(`LeadLovers: ${resp.status} — ${err}`);
                }
                const data = (await resp.json());
                return { idExterno: String(data.id ?? '') };
            },
        });
    }
    async processarWebhook(plataforma, payload) {
        return this.executar({
            plataforma,
            acao: integracao_log_entity_1.IntegracaoAcao.WEBHOOK_RECEBIDO,
            pacienteId: null,
            payload,
            handler: async () => {
                const email = payload['email'] ??
                    payload['email_lead'] ??
                    null;
                const nome = payload['name'] ??
                    payload['nome_lead'] ??
                    'Lead sem nome';
                this.logger.log(`Webhook ${plataforma} — novo lead: ${nome} <${email ?? 'sem email'}>`);
                return { idExterno: email ?? undefined };
            },
        });
    }
    async listar(params) {
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
    async estatisticas() {
        const rows = await this.repo
            .createQueryBuilder('l')
            .select('l.plataforma', 'plataforma')
            .addSelect(`SUM(CASE WHEN l.status = '${integracao_log_entity_1.IntegracaoStatus.SUCESSO}' THEN 1 ELSE 0 END)`, 'sucesso')
            .addSelect(`SUM(CASE WHEN l.status = '${integracao_log_entity_1.IntegracaoStatus.FALHOU}' THEN 1 ELSE 0 END)`, 'falha')
            .addSelect(`SUM(CASE WHEN l.status = '${integracao_log_entity_1.IntegracaoStatus.SIMULADO}' THEN 1 ELSE 0 END)`, 'simulado')
            .addSelect('MAX(l.createdAt)', 'ultimaSincronizacao')
            .groupBy('l.plataforma')
            .getRawMany();
        return rows.map((r) => ({
            plataforma: r.plataforma,
            sucesso: Number(r.sucesso ?? 0),
            falha: Number(r.falha ?? 0),
            simulado: Number(r.simulado ?? 0),
            ultimaSincronizacao: r.ultimaSincronizacao ? new Date(r.ultimaSincronizacao) : null,
        }));
    }
    statusConfig() {
        return {
            rdStation: !!this.config.get('RD_STATION_API_KEY'),
            leadlovers: !!this.config.get('LEADLOVERS_API_KEY') &&
                !!this.config.get('LEADLOVERS_MAQUINA_ID'),
        };
    }
    async executar(params) {
        let status = integracao_log_entity_1.IntegracaoStatus.SUCESSO;
        let resposta = null;
        let idExterno = null;
        try {
            const resultado = await params.handler();
            idExterno = resultado.idExterno ?? null;
            resposta = 'OK';
            this.logger.log(`[${params.plataforma}] ${params.acao} — SUCESSO`);
        }
        catch (err) {
            const msg = err.message;
            if (msg.includes('não configurad') || msg.includes('not configured')) {
                status = integracao_log_entity_1.IntegracaoStatus.SIMULADO;
                resposta = `SIMULADO: ${msg}`;
                this.logger.warn(`[${params.plataforma}] ${params.acao} — SIMULADO (sem credenciais)`);
            }
            else {
                status = integracao_log_entity_1.IntegracaoStatus.FALHOU;
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
};
exports.IntegracoesService = IntegracoesService;
exports.IntegracoesService = IntegracoesService = IntegracoesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(integracao_log_entity_1.IntegracaoLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], IntegracoesService);
//# sourceMappingURL=integracoes.service.js.map