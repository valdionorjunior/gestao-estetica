"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstoqueModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const produto_entity_1 = require("./domain/entities/produto.entity");
const movimentacao_estoque_entity_1 = require("./domain/entities/movimentacao-estoque.entity");
const estoque_repository_1 = require("./infrastructure/repositories/estoque.repository");
const estoque_service_1 = require("./application/use-cases/estoque.service");
const estoque_controller_1 = require("./presentation/controllers/estoque.controller");
const auth_module_1 = require("./auth.module");
let EstoqueModule = class EstoqueModule {
};
exports.EstoqueModule = EstoqueModule;
exports.EstoqueModule = EstoqueModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([produto_entity_1.Produto, movimentacao_estoque_entity_1.MovimentacaoEstoque]), auth_module_1.AuthModule],
        providers: [estoque_repository_1.EstoqueRepository, estoque_service_1.EstoqueService],
        controllers: [estoque_controller_1.EstoqueController],
        exports: [estoque_service_1.EstoqueService],
    })
], EstoqueModule);
//# sourceMappingURL=estoque.module.js.map