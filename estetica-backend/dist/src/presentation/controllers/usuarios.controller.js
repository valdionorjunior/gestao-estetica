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
exports.UsuariosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const user_role_enum_1 = require("../../domain/entities/user-role.enum");
const usuarios_service_1 = require("../../application/use-cases/usuarios.service");
const usuario_dto_1 = require("../../application/dtos/usuarios/usuario.dto");
let UsuariosController = class UsuariosController {
    service;
    constructor(service) {
        this.service = service;
    }
    listar(page = 1, limit = 20, busca) {
        return this.service.listar({ page, limit, busca });
    }
    buscarPorId(id) {
        return this.service.buscarPorId(id);
    }
    criar(dto) {
        return this.service.criar(dto);
    }
    atualizar(id, dto) {
        return this.service.atualizar(id, dto);
    }
    desativar(id) {
        return this.service.desativar(id);
    }
};
exports.UsuariosController = UsuariosController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os usuários (ADMIN only)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 20 }),
    (0, swagger_1.ApiQuery)({ name: 'busca', required: false, type: String, description: 'Busca por nome ou e-mail' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista paginada de usuários' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Acesso negado — apenas ADMIN' }),
    __param(0, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('busca')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "listar", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar usuário por ID (ADMIN only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: usuario_dto_1.UsuarioResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuário não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "buscarPorId", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Criar usuário com qualquer role (ADMIN only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: usuario_dto_1.UsuarioResponseDto, description: 'Usuário criado' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'E-mail já cadastrado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [usuario_dto_1.CreateUsuarioDto]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "criar", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Editar nome, role ou status do usuário (ADMIN only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: usuario_dto_1.UsuarioResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuário não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, usuario_dto_1.UpdateUsuarioDto]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "atualizar", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Desativar conta de usuário — soft delete (ADMIN only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Conta desativada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuário não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "desativar", null);
exports.UsuariosController = UsuariosController = __decorate([
    (0, swagger_1.ApiTags)('Usuários'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('usuarios'),
    __metadata("design:paramtypes", [usuarios_service_1.UsuariosService])
], UsuariosController);
//# sourceMappingURL=usuarios.controller.js.map