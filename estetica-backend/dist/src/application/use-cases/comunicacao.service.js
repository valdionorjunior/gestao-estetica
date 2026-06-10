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
var ComunicacaoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComunicacaoService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comunicacao_log_entity_1 = require("../../domain/entities/comunicacao-log.entity");
let ComunicacaoService = ComunicacaoService_1 = class ComunicacaoService {
    repo;
    config;
    logger = new common_1.Logger(ComunicacaoService_1.name);
    constructor(repo, config) {
        this.repo = repo;
        this.config = config;
    }
    async enviar(params) {
        const log = this.repo.create({
            pacienteId: params.pacienteId,
            agendamentoId: params.agendamentoId ?? null,
            tipo: params.tipo,
            motivo: params.motivo,
            status: comunicacao_log_entity_1.ComunicacaoStatus.PENDENTE,
            destinatario: params.destinatario,
            assunto: params.assunto,
            mensagem: params.mensagem,
        });
        await this.repo.save(log);
        try {
            switch (params.tipo) {
                case comunicacao_log_entity_1.ComunicacaoTipo.EMAIL:
                    await this.enviarEmail(params);
                    break;
                case comunicacao_log_entity_1.ComunicacaoTipo.SMS:
                    await this.enviarSms(params);
                    break;
                case comunicacao_log_entity_1.ComunicacaoTipo.WHATSAPP:
                    await this.enviarWhatsApp(params);
                    break;
            }
            log.status = comunicacao_log_entity_1.ComunicacaoStatus.ENVIADO;
            log.enviadoEm = new Date();
        }
        catch (err) {
            const errMsg = err instanceof Error ? err.message : String(err);
            if (errMsg.includes('não configurad') || errMsg.includes('not configured')) {
                log.status = comunicacao_log_entity_1.ComunicacaoStatus.SIMULADO;
                log.enviadoEm = new Date();
                this.logger.warn(`[SIMULADO] ${params.tipo} para ${params.destinatario}: ${errMsg}`);
            }
            else {
                log.status = comunicacao_log_entity_1.ComunicacaoStatus.FALHOU;
                log.erroDetalhe = errMsg;
                this.logger.error(`Falha ao enviar ${params.tipo}:`, errMsg);
            }
        }
        return this.repo.save(log);
    }
    async enviarEmail(params) {
        const smtpHost = this.config.get('SMTP_HOST');
        if (!smtpHost) {
            throw new Error('SMTP não configurado — defina SMTP_HOST no .env');
        }
        this.logger.log(`[EMAIL] Para: ${params.destinatario} | Assunto: ${params.assunto}`);
    }
    async enviarSms(params) {
        const accountSid = this.config.get('TWILIO_ACCOUNT_SID');
        if (!accountSid) {
            throw new Error('Twilio não configurado — defina TWILIO_ACCOUNT_SID no .env');
        }
        this.logger.log(`[SMS] Para: ${params.destinatario} | Msg: ${params.mensagem.substring(0, 50)}...`);
    }
    async enviarWhatsApp(params) {
        const evolutionUrl = this.config.get('EVOLUTION_API_URL');
        if (!evolutionUrl) {
            throw new Error('Evolution API não configurada — defina EVOLUTION_API_URL no .env');
        }
        this.logger.log(`[WHATSAPP] Para: ${params.destinatario} | Msg: ${params.mensagem.substring(0, 50)}...`);
    }
    async listar(params) {
        const qb = this.repo.createQueryBuilder('c').orderBy('c.createdAt', 'DESC');
        if (params.tipo)
            qb.andWhere('c.tipo = :tipo', { tipo: params.tipo });
        if (params.status)
            qb.andWhere('c.status = :status', { status: params.status });
        if (params.pacienteId)
            qb.andWhere('c.pacienteId = :pid', { pid: params.pacienteId });
        qb.skip((params.page - 1) * params.limit).take(params.limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, total };
    }
    async estatisticas() {
        const rows = await this.repo
            .createQueryBuilder('c')
            .select('c.status', 'status')
            .addSelect('c.tipo', 'tipo')
            .addSelect('COUNT(*)', 'total')
            .groupBy('c.status')
            .addGroupBy('c.tipo')
            .getRawMany();
        const result = {
            totalEnviados: 0,
            totalSimulados: 0,
            totalFalhas: 0,
            porTipo: { EMAIL: 0, SMS: 0, WHATSAPP: 0 },
        };
        for (const r of rows) {
            const n = parseInt(r.total, 10);
            if (r.status === comunicacao_log_entity_1.ComunicacaoStatus.ENVIADO)
                result.totalEnviados += n;
            if (r.status === comunicacao_log_entity_1.ComunicacaoStatus.SIMULADO)
                result.totalSimulados += n;
            if (r.status === comunicacao_log_entity_1.ComunicacaoStatus.FALHOU)
                result.totalFalhas += n;
            result.porTipo[r.tipo] = (result.porTipo[r.tipo] ?? 0) + n;
        }
        return result;
    }
};
exports.ComunicacaoService = ComunicacaoService;
exports.ComunicacaoService = ComunicacaoService = ComunicacaoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comunicacao_log_entity_1.ComunicacaoLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], ComunicacaoService);
//# sourceMappingURL=comunicacao.service.js.map