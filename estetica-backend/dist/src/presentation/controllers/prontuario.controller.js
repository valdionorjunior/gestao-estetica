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
exports.ProntuarioController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const user_role_enum_1 = require("../../domain/entities/user-role.enum");
const prontuario_service_1 = require("../../application/use-cases/prontuario.service");
const update_prontuario_dto_1 = require("../../application/dtos/prontuario/update-prontuario.dto");
const ficha_dto_1 = require("../../application/dtos/prontuario/ficha.dto");
let ProntuarioController = class ProntuarioController {
    prontuarioService;
    constructor(prontuarioService) {
        this.prontuarioService = prontuarioService;
    }
    get(pacienteId, user) {
        return this.prontuarioService.getOrCreateByPacienteId(pacienteId, user.clinicaId);
    }
    update(pacienteId, dto, user) {
        return this.prontuarioService.update(pacienteId, dto, user.clinicaId);
    }
    listFichas(pacienteId) {
        return this.prontuarioService.listFichas(pacienteId);
    }
    createFicha(pacienteId, dto, user) {
        return this.prontuarioService.createFicha(pacienteId, dto, user.id, user.clinicaId);
    }
    updateFicha(fichaId, dto, user) {
        return this.prontuarioService.updateFicha(fichaId, dto, user.id);
    }
};
exports.ProntuarioController = ProntuarioController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO),
    (0, swagger_1.ApiOperation)({ summary: 'Obter prontuário do paciente (dados descriptografados)' }),
    (0, swagger_1.ApiParam)({ name: 'pacienteId', description: 'UUID do paciente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prontuário retornado (cria se não existir)' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissão (apenas ADMIN e MEDICO)' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Paciente não encontrado' }),
    __param(0, (0, common_1.Param)('pacienteId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProntuarioController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar prontuário do paciente' }),
    (0, swagger_1.ApiParam)({ name: 'pacienteId', description: 'UUID do paciente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prontuário atualizado' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissão' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prontuário não encontrado' }),
    __param(0, (0, common_1.Param)('pacienteId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_prontuario_dto_1.UpdateProntuarioDto, Object]),
    __metadata("design:returntype", void 0)
], ProntuarioController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('fichas'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO),
    (0, swagger_1.ApiOperation)({ summary: 'Listar fichas de atendimento' }),
    (0, swagger_1.ApiParam)({ name: 'pacienteId', description: 'UUID do paciente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de fichas de atendimento' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissão' }),
    __param(0, (0, common_1.Param)('pacienteId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProntuarioController.prototype, "listFichas", null);
__decorate([
    (0, common_1.Post)('fichas'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO),
    (0, swagger_1.ApiOperation)({ summary: 'Criar nova ficha de atendimento' }),
    (0, swagger_1.ApiParam)({ name: 'pacienteId', description: 'UUID do paciente' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Ficha criada com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissão' }),
    __param(0, (0, common_1.Param)('pacienteId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ficha_dto_1.CreateFichaDto, Object]),
    __metadata("design:returntype", void 0)
], ProntuarioController.prototype, "createFicha", null);
__decorate([
    (0, common_1.Patch)('fichas/:fichaId'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar ficha de atendimento' }),
    (0, swagger_1.ApiParam)({ name: 'pacienteId', description: 'UUID do paciente' }),
    (0, swagger_1.ApiParam)({ name: 'fichaId', description: 'UUID da ficha' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ficha atualizada' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Ficha já fechada ou dados inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ficha não encontrada' }),
    __param(0, (0, common_1.Param)('fichaId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ficha_dto_1.UpdateFichaDto, Object]),
    __metadata("design:returntype", void 0)
], ProntuarioController.prototype, "updateFicha", null);
exports.ProntuarioController = ProntuarioController = __decorate([
    (0, swagger_1.ApiTags)('Prontuário'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('pacientes/:pacienteId/prontuario'),
    __metadata("design:paramtypes", [prontuario_service_1.ProntuarioService])
], ProntuarioController);
//# sourceMappingURL=prontuario.controller.js.map