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
exports.PacientesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const user_role_enum_1 = require("../../domain/entities/user-role.enum");
const pacientes_service_1 = require("../../application/use-cases/pacientes.service");
const create_paciente_dto_1 = require("../../application/dtos/pacientes/create-paciente.dto");
const update_paciente_dto_1 = require("../../application/dtos/pacientes/update-paciente.dto");
const list_pacientes_dto_1 = require("../../application/dtos/pacientes/list-pacientes.dto");
let PacientesController = class PacientesController {
    pacientesService;
    constructor(pacientesService) {
        this.pacientesService = pacientesService;
    }
    list(filters, user) {
        return this.pacientesService.list(user.clinicaId, filters);
    }
    findOne(id) {
        return this.pacientesService.findOne(id);
    }
    create(dto, user) {
        return this.pacientesService.create(dto, user.clinicaId);
    }
    update(id, dto) {
        return this.pacientesService.update(id, dto);
    }
    remove(id) {
        return this.pacientesService.remove(id);
    }
};
exports.PacientesController = PacientesController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, swagger_1.ApiOperation)({ summary: 'Listar pacientes com paginação e filtros' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de pacientes retornada com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissão' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_pacientes_dto_1.ListPacientesDto, Object]),
    __metadata("design:returntype", void 0)
], PacientesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar paciente por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID do paciente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paciente encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissão' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Paciente não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PacientesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, swagger_1.ApiOperation)({ summary: 'Cadastrar novo paciente' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Paciente cadastrado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissão' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_paciente_dto_1.CreatePacienteDto, Object]),
    __metadata("design:returntype", void 0)
], PacientesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar dados do paciente' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID do paciente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paciente atualizado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissão' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Paciente não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_paciente_dto_1.UpdatePacienteDto]),
    __metadata("design:returntype", void 0)
], PacientesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Desativar paciente (soft delete)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID do paciente' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Paciente desativado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissão (apenas ADMIN)' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Paciente não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PacientesController.prototype, "remove", null);
exports.PacientesController = PacientesController = __decorate([
    (0, swagger_1.ApiTags)('Pacientes'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('pacientes'),
    __metadata("design:paramtypes", [pacientes_service_1.PacientesService])
], PacientesController);
//# sourceMappingURL=pacientes.controller.js.map