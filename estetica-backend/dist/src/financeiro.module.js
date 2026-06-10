"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceiroModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const conta_financeira_entity_1 = require("./domain/entities/conta-financeira.entity");
const financeiro_repository_1 = require("./infrastructure/repositories/financeiro.repository");
const financeiro_service_1 = require("./application/use-cases/financeiro.service");
const financeiro_controller_1 = require("./presentation/controllers/financeiro.controller");
const auth_module_1 = require("./auth.module");
let FinanceiroModule = class FinanceiroModule {
};
exports.FinanceiroModule = FinanceiroModule;
exports.FinanceiroModule = FinanceiroModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([conta_financeira_entity_1.ContaFinanceira]), auth_module_1.AuthModule],
        providers: [financeiro_repository_1.FinanceiroRepository, financeiro_service_1.FinanceiroService],
        controllers: [financeiro_controller_1.FinanceiroController],
        exports: [financeiro_service_1.FinanceiroService],
    })
], FinanceiroModule);
//# sourceMappingURL=financeiro.module.js.map