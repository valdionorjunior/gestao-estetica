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
exports.IntegracoesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const user_role_enum_1 = require("../../domain/entities/user-role.enum");
const integracoes_service_1 = require("../../application/use-cases/integracoes.service");
const integracao_log_entity_1 = require("../../domain/entities/integracao-log.entity");
class SincronizarContatoDto {
    pacienteId;
    nome;
    email;
    telefone;
    plataforma;
}
__decorate([
    (0, swagger_2.ApiProperty)({ description: 'UUID do paciente' }),
    (0, class_validator_1.IsUUID)('4', { message: 'pacienteId deve ser um UUID válido' }),
    __metadata("design:type", String)
], SincronizarContatoDto.prototype, "pacienteId", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ description: 'Nome do contato' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SincronizarContatoDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Email inválido' }),
    __metadata("design:type", String)
], SincronizarContatoDto.prototype, "email", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SincronizarContatoDto.prototype, "telefone", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ enum: integracao_log_entity_1.PlataformaIntegracao }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(integracao_log_entity_1.PlataformaIntegracao, { message: 'Plataforma inválida' }),
    __metadata("design:type", String)
], SincronizarContatoDto.prototype, "plataforma", void 0);
class RegistrarEventoDto {
    tipo;
    email;
    pacienteId;
    valor;
    dados;
}
__decorate([
    (0, swagger_2.ApiProperty)({ description: 'Tipo do evento (ex: CONVERSION, PAGE_VIEW)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegistrarEventoDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Email inválido' }),
    __metadata("design:type", String)
], RegistrarEventoDto.prototype, "email", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegistrarEventoDto.prototype, "pacienteId", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RegistrarEventoDto.prototype, "valor", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], RegistrarEventoDto.prototype, "dados", void 0);
let IntegracoesController = class IntegracoesController {
    service;
    constructor(service) {
        this.service = service;
    }
    statusConfig() {
        return this.service.statusConfig();
    }
    async estatisticas() {
        return this.service.estatisticas();
    }
    async logs(plataforma, page, limit) {
        return this.service.listar({
            plataforma,
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 20,
        });
    }
    async sincronizarContato(dto) {
        const resultados = [];
        const plataformas = dto.plataforma
            ? [dto.plataforma]
            : Object.values(integracao_log_entity_1.PlataformaIntegracao);
        for (const plat of plataformas) {
            if (plat === integracao_log_entity_1.PlataformaIntegracao.RD_STATION) {
                const log = await this.service.rdStationSincronizarContato(dto.pacienteId, {
                    nome: dto.nome,
                    email: dto.email,
                    telefone: dto.telefone,
                });
                resultados.push({ plataforma: 'RD_STATION', status: log.status, id: log.id });
            }
            else if (plat === integracao_log_entity_1.PlataformaIntegracao.LEADLOVERS) {
                const log = await this.service.leadloversSincronizarContato(dto.pacienteId, {
                    nome: dto.nome,
                    email: dto.email,
                    telefone: dto.telefone,
                });
                resultados.push({ plataforma: 'LEADLOVERS', status: log.status, id: log.id });
            }
        }
        return { resultados };
    }
    async registrarEvento(dto) {
        const log = await this.service.rdStationRegistrarEvento(dto.pacienteId ?? null, {
            tipo: dto.tipo,
            email: dto.email,
            valor: dto.valor,
            dados: dto.dados,
        });
        return { status: log.status, id: log.id };
    }
    async webhookRdStation(payload) {
        const log = await this.service.processarWebhook(integracao_log_entity_1.PlataformaIntegracao.RD_STATION, payload);
        return { recebido: true, logId: log.id };
    }
    async webhookLeadLovers(payload) {
        const log = await this.service.processarWebhook(integracao_log_entity_1.PlataformaIntegracao.LEADLOVERS, payload);
        return { recebido: true, logId: log.id };
    }
};
exports.IntegracoesController = IntegracoesController;
__decorate([
    (0, common_1.Get)('status'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Verificar status de configuração das integrações' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IntegracoesController.prototype, "statusConfig", null);
__decorate([
    (0, common_1.Get)('estatisticas'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Estatísticas de logs por plataforma' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IntegracoesController.prototype, "estatisticas", null);
__decorate([
    (0, common_1.Get)('logs'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Histórico de logs de integração' }),
    (0, swagger_1.ApiQuery)({ name: 'plataforma', required: false, enum: integracao_log_entity_1.PlataformaIntegracao }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    __param(0, (0, common_1.Query)('plataforma')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], IntegracoesController.prototype, "logs", null);
__decorate([
    (0, common_1.Post)('sincronizar-contato'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Sincronizar paciente como contato em RD Station e/ou LeadLovers' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SincronizarContatoDto]),
    __metadata("design:returntype", Promise)
], IntegracoesController.prototype, "sincronizarContato", null);
__decorate([
    (0, common_1.Post)('evento-rd-station'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar evento de conversão no RD Station' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegistrarEventoDto]),
    __metadata("design:returntype", Promise)
], IntegracoesController.prototype, "registrarEvento", null);
__decorate([
    (0, common_1.Post)('webhook/rd-station'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Endpoint público para receber webhooks do RD Station' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IntegracoesController.prototype, "webhookRdStation", null);
__decorate([
    (0, common_1.Post)('webhook/leadlovers'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Endpoint público para receber webhooks do LeadLovers' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IntegracoesController.prototype, "webhookLeadLovers", null);
exports.IntegracoesController = IntegracoesController = __decorate([
    (0, swagger_1.ApiTags)('Integrações'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('integracoes'),
    __metadata("design:paramtypes", [integracoes_service_1.IntegracoesService])
], IntegracoesController);
//# sourceMappingURL=integracoes.controller.js.map