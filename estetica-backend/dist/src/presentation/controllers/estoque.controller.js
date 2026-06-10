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
exports.EstoqueController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const user_role_enum_1 = require("../../domain/entities/user-role.enum");
const estoque_service_1 = require("../../application/use-cases/estoque.service");
const estoque_dto_1 = require("../../application/dtos/estoque/estoque.dto");
let EstoqueController = class EstoqueController {
    estoqueService;
    constructor(estoqueService) {
        this.estoqueService = estoqueService;
    }
    alertas(user) {
        return this.estoqueService.alertasEstoqueMinimo(user.clinicaId);
    }
    listProdutos(filters, user) {
        return this.estoqueService.listProdutos(user.clinicaId, filters);
    }
    findOne(id) {
        return this.estoqueService.findOne(id);
    }
    create(dto, user) {
        return this.estoqueService.create(dto, user.clinicaId);
    }
    movimentar(id, dto, user) {
        return this.estoqueService.movimentar(id, dto, user.id, user.clinicaId);
    }
    listMovimentacoes(id) {
        return this.estoqueService.listMovimentacoes(id);
    }
};
exports.EstoqueController = EstoqueController;
__decorate([
    (0, common_1.Get)('alertas'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Produtos abaixo do estoque mínimo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de produtos com estoque crítico' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissão (apenas ADMIN)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EstoqueController.prototype, "alertas", null);
__decorate([
    (0, common_1.Get)('produtos'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Listar produtos do estoque' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista paginada de produtos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autenticado' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [estoque_dto_1.ListProdutosDto, Object]),
    __metadata("design:returntype", void 0)
], EstoqueController.prototype, "listProdutos", null);
__decorate([
    (0, common_1.Get)('produtos/:id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar produto por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID do produto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Produto encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produto não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EstoqueController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('produtos'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Cadastrar produto no estoque' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Produto criado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [estoque_dto_1.CreateProdutoDto, Object]),
    __metadata("design:returntype", void 0)
], EstoqueController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('produtos/:id/movimentar'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar entrada, saída ou ajuste de estoque' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID do produto' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Movimentação registrada' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Estoque insuficiente para saída' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produto não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, estoque_dto_1.MovimentarEstoqueDto, Object]),
    __metadata("design:returntype", void 0)
], EstoqueController.prototype, "movimentar", null);
__decorate([
    (0, common_1.Get)('produtos/:id/movimentacoes'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Histórico de movimentações do produto' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID do produto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Histórico de movimentações' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produto não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EstoqueController.prototype, "listMovimentacoes", null);
exports.EstoqueController = EstoqueController = __decorate([
    (0, swagger_1.ApiTags)('Estoque'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('estoque'),
    __metadata("design:paramtypes", [estoque_service_1.EstoqueService])
], EstoqueController);
//# sourceMappingURL=estoque.controller.js.map