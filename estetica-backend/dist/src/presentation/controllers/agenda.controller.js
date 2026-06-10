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
exports.AgendaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const user_role_enum_1 = require("../../domain/entities/user-role.enum");
const agenda_service_1 = require("../../application/use-cases/agenda.service");
const create_agendamento_dto_1 = require("../../application/dtos/agenda/create-agendamento.dto");
const update_agendamento_dto_1 = require("../../application/dtos/agenda/update-agendamento.dto");
const list_agendamentos_dto_1 = require("../../application/dtos/agenda/list-agendamentos.dto");
const update_agendamento_status_dto_1 = require("../../application/dtos/agenda/update-agendamento-status.dto");
let AgendaController = class AgendaController {
    agendaService;
    constructor(agendaService) {
        this.agendaService = agendaService;
    }
    list(filters, user) {
        return this.agendaService.list(user.clinicaId, filters);
    }
    findOne(id) {
        return this.agendaService.findOne(id);
    }
    create(dto, user) {
        return this.agendaService.create(dto, user.clinicaId);
    }
    update(id, dto) {
        return this.agendaService.update(id, dto);
    }
    updateStatus(id, dto) {
        return this.agendaService.updateStatus(id, dto);
    }
    cancel(id) {
        return this.agendaService.cancel(id);
    }
};
exports.AgendaController = AgendaController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, swagger_1.ApiOperation)({ summary: 'Listar agendamentos com filtros' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de agendamentos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autenticado' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_agendamentos_dto_1.ListAgendamentosDto, Object]),
    __metadata("design:returntype", void 0)
], AgendaController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar agendamento por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID do agendamento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agendamento encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Agendamento não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgendaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, swagger_1.ApiOperation)({ summary: 'Criar agendamento' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Agendamento criado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflito de horário' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_agendamento_dto_1.CreateAgendamentoDto, Object]),
    __metadata("design:returntype", void 0)
], AgendaController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar agendamento' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID do agendamento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agendamento atualizado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Agendamento não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_agendamento_dto_1.UpdateAgendamentoDto]),
    __metadata("design:returntype", void 0)
], AgendaController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar status do agendamento' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID do agendamento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status atualizado' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Transição de status inválida' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Agendamento não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_agendamento_status_dto_1.UpdateAgendamentoStatusDto]),
    __metadata("design:returntype", void 0)
], AgendaController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, swagger_1.ApiOperation)({ summary: 'Cancelar agendamento' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID do agendamento' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Agendamento cancelado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Agendamento não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgendaController.prototype, "cancel", null);
exports.AgendaController = AgendaController = __decorate([
    (0, swagger_1.ApiTags)('Agenda'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('agenda'),
    __metadata("design:paramtypes", [agenda_service_1.AgendaService])
], AgendaController);
//# sourceMappingURL=agenda.controller.js.map