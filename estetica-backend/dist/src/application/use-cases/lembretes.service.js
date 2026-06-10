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
var LembretesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LembretesService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const agendamento_entity_1 = require("../../domain/entities/agendamento.entity");
const agendamento_status_enum_1 = require("../../domain/entities/agendamento-status.enum");
const paciente_entity_1 = require("../../domain/entities/paciente.entity");
const comunicacao_service_1 = require("../use-cases/comunicacao.service");
const comunicacao_log_entity_1 = require("../../domain/entities/comunicacao-log.entity");
let LembretesService = LembretesService_1 = class LembretesService {
    agendamentoRepo;
    pacienteRepo;
    comunicacaoService;
    logger = new common_1.Logger(LembretesService_1.name);
    constructor(agendamentoRepo, pacienteRepo, comunicacaoService) {
        this.agendamentoRepo = agendamentoRepo;
        this.pacienteRepo = pacienteRepo;
        this.comunicacaoService = comunicacaoService;
    }
    async enviarLembretesAgendamentos() {
        const amanha = new Date();
        amanha.setDate(amanha.getDate() + 1);
        amanha.setHours(0, 0, 0, 0);
        const depoisAmanha = new Date(amanha);
        depoisAmanha.setDate(depoisAmanha.getDate() + 1);
        const agendamentos = await this.agendamentoRepo.find({
            where: {
                status: agendamento_status_enum_1.AgendamentoStatus.AGENDADO,
                dataHoraInicio: (0, typeorm_2.Between)(amanha, depoisAmanha),
                lembreteEnviado: false,
            },
            relations: ['paciente'],
        });
        this.logger.log(`[Cron Lembretes] Encontrados ${agendamentos.length} agendamentos para amanhã`);
        for (const ag of agendamentos) {
            const paciente = ag.paciente;
            if (!paciente)
                continue;
            const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
                dateStyle: 'long',
                timeStyle: 'short',
                timeZone: 'America/Sao_Paulo',
            }).format(ag.dataHoraInicio);
            const mensagem = `Olá ${paciente.nome.split(' ')[0]}! 😊\n\nLembramos que você tem um agendamento na Estética Natalia Salvador:\n\n📅 ${dataFormatada}\n\nCaso precise reagendar, entre em contato conosco.\n\nAté logo! ✨`;
            const tipo = paciente.telefone ? comunicacao_log_entity_1.ComunicacaoTipo.WHATSAPP : comunicacao_log_entity_1.ComunicacaoTipo.EMAIL;
            const destinatario = paciente.telefone ?? paciente.email ?? '';
            if (!destinatario) {
                this.logger.warn(`Paciente ${paciente.id} sem contato — lembrete ignorado`);
                continue;
            }
            await this.comunicacaoService.enviar({
                pacienteId: paciente.id,
                agendamentoId: ag.id,
                tipo,
                motivo: comunicacao_log_entity_1.ComunicacaoMotivo.LEMBRETE_AGENDAMENTO,
                destinatario,
                assunto: 'Lembrete de consulta — Estética Natalia Salvador',
                mensagem,
            });
            await this.agendamentoRepo.update(ag.id, { lembreteEnviado: true });
        }
        this.logger.log(`[Cron Lembretes] ${agendamentos.length} lembretes processados`);
    }
    async enviarAniversarios() {
        const hoje = new Date();
        const dia = hoje.getDate();
        const mes = hoje.getMonth() + 1;
        const aniversariantes = await this.pacienteRepo
            .createQueryBuilder('p')
            .where('EXTRACT(DAY FROM p.data_nascimento) = :dia', { dia })
            .andWhere('EXTRACT(MONTH FROM p.data_nascimento) = :mes', { mes })
            .andWhere('p.ativo = true')
            .getMany();
        this.logger.log(`[Cron Aniversários] ${aniversariantes.length} aniversariante(s) hoje`);
        for (const paciente of aniversariantes) {
            const destinatario = paciente.telefone ?? paciente.email ?? '';
            if (!destinatario)
                continue;
            const tipo = paciente.telefone ? comunicacao_log_entity_1.ComunicacaoTipo.WHATSAPP : comunicacao_log_entity_1.ComunicacaoTipo.EMAIL;
            const mensagem = `Feliz aniversário, ${paciente.nome.split(' ')[0]}! 🎉🎂\n\nA equipe da Estética Natalia Salvador deseja um dia incrível para você!\n\nComo presente especial, você ganhou um desconto exclusivo na sua próxima visita. Entre em contato conosco! ✨`;
            await this.comunicacaoService.enviar({
                pacienteId: paciente.id,
                tipo,
                motivo: comunicacao_log_entity_1.ComunicacaoMotivo.ANIVERSARIO,
                destinatario,
                assunto: 'Feliz Aniversário! 🎉 — Estética Natalia Salvador',
                mensagem,
            });
        }
    }
};
exports.LembretesService = LembretesService;
__decorate([
    (0, schedule_1.Cron)('0 9 * * *', { name: 'lembretes-agendamentos', timeZone: 'America/Sao_Paulo' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LembretesService.prototype, "enviarLembretesAgendamentos", null);
__decorate([
    (0, schedule_1.Cron)('0 10 * * *', { name: 'aniversarios', timeZone: 'America/Sao_Paulo' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LembretesService.prototype, "enviarAniversarios", null);
exports.LembretesService = LembretesService = LembretesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agendamento_entity_1.Agendamento)),
    __param(1, (0, typeorm_1.InjectRepository)(paciente_entity_1.Paciente)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        comunicacao_service_1.ComunicacaoService])
], LembretesService);
//# sourceMappingURL=lembretes.service.js.map