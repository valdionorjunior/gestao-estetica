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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const user_role_enum_1 = require("../../domain/entities/user-role.enum");
const comunicacao_service_1 = require("../../application/use-cases/comunicacao.service");
const paciente_entity_1 = require("../../domain/entities/paciente.entity");
const comunicacao_log_entity_1 = require("../../domain/entities/comunicacao-log.entity");
const marketing_dto_1 = require("../../application/dtos/marketing/marketing.dto");
let MarketingController = class MarketingController {
    comunicacaoService;
    pacienteRepo;
    constructor(comunicacaoService, pacienteRepo) {
        this.comunicacaoService = comunicacaoService;
        this.pacienteRepo = pacienteRepo;
    }
    async enviar(dto) {
        const paciente = await this.pacienteRepo.findOne({ where: { id: dto.pacienteId } });
        if (!paciente)
            throw new common_1.NotFoundException('Paciente não encontrado');
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
    async campanha(dto) {
        const resultados = [];
        for (const pacienteId of dto.pacienteIds) {
            const paciente = await this.pacienteRepo.findOne({ where: { id: pacienteId } });
            if (!paciente)
                continue;
            const destinatario = this.resolverDestinatario(dto.tipo, paciente);
            if (!destinatario)
                continue;
            const mensagem = this.interpolar(dto.mensagem, paciente);
            const log = await this.comunicacaoService.enviar({
                pacienteId: paciente.id,
                tipo: dto.tipo,
                motivo: comunicacao_log_entity_1.ComunicacaoMotivo.CAMPANHA_MARKETING,
                destinatario,
                assunto: dto.assunto,
                mensagem,
            });
            resultados.push({ pacienteId: paciente.id, status: log.status });
        }
        return {
            enviados: resultados.filter((r) => r.status === comunicacao_log_entity_1.ComunicacaoStatus.ENVIADO).length,
            simulados: resultados.filter((r) => r.status === comunicacao_log_entity_1.ComunicacaoStatus.SIMULADO).length,
            falhas: resultados.filter((r) => r.status === comunicacao_log_entity_1.ComunicacaoStatus.FALHOU).length,
            total: resultados.length,
        };
    }
    async lembreteManual(body) {
        return {
            mensagem: 'Lembrete enfileirado. Use o endpoint /marketing/enviar para envios manuais.',
            agendamentoId: body.agendamentoId,
            tipo: body.tipo,
        };
    }
    historico(page = 1, limit = 20, tipo, status, pacienteId) {
        return this.comunicacaoService.listar({ page, limit, tipo, status, pacienteId });
    }
    estatisticas() {
        return this.comunicacaoService.estatisticas();
    }
    resolverDestinatario(tipo, paciente) {
        switch (tipo) {
            case comunicacao_log_entity_1.ComunicacaoTipo.EMAIL:
                return paciente.email ?? '';
            case comunicacao_log_entity_1.ComunicacaoTipo.SMS:
            case comunicacao_log_entity_1.ComunicacaoTipo.WHATSAPP:
                return paciente.telefone ?? '';
            default:
                return '';
        }
    }
    interpolar(template, paciente) {
        const primeiroNome = (paciente.nome ?? '').split(' ')[0];
        return template
            .replace(/{nome}/g, paciente.nome ?? '')
            .replace(/{primeiro_nome}/g, primeiroNome)
            .replace(/{email}/g, paciente.email ?? '')
            .replace(/{telefone}/g, paciente.telefone ?? '');
    }
};
exports.MarketingController = MarketingController;
__decorate([
    (0, common_1.Post)('enviar'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Enviar mensagem individual para um paciente (Email, SMS ou WhatsApp)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Mensagem enviada ou registrada como simulada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Paciente não encontrado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [marketing_dto_1.EnviarMensagemDto]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "enviar", null);
__decorate([
    (0, common_1.Post)('campanha'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Enviar campanha de marketing para múltiplos pacientes (ADMIN only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Campanha enfileirada — retorna total de envios' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [marketing_dto_1.EnviarCampanhaDto]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "campanha", null);
__decorate([
    (0, common_1.Post)('lembrete-agendamento'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Disparar lembrete manual de agendamento para um paciente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "lembreteManual", null);
__decorate([
    (0, common_1.Get)('historico'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, swagger_1.ApiOperation)({ summary: 'Histórico de comunicações enviadas' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 20 }),
    (0, swagger_1.ApiQuery)({ name: 'tipo', required: false, enum: comunicacao_log_entity_1.ComunicacaoTipo }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: comunicacao_log_entity_1.ComunicacaoStatus }),
    (0, swagger_1.ApiQuery)({ name: 'pacienteId', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista paginada de comunicações' }),
    __param(0, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('tipo')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('pacienteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String]),
    __metadata("design:returntype", void 0)
], MarketingController.prototype, "historico", null);
__decorate([
    (0, common_1.Get)('estatisticas'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Estatísticas de comunicações por canal e status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KPIs de comunicação' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MarketingController.prototype, "estatisticas", null);
exports.MarketingController = MarketingController = __decorate([
    (0, swagger_1.ApiTags)('Marketing'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('marketing'),
    __param(1, (0, typeorm_1.InjectRepository)(paciente_entity_1.Paciente)),
    __metadata("design:paramtypes", [comunicacao_service_1.ComunicacaoService,
        typeorm_2.Repository])
], MarketingController);
//# sourceMappingURL=marketing.controller.js.map