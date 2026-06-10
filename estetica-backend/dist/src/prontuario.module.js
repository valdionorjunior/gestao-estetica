"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProntuarioModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const prontuario_entity_1 = require("./domain/entities/prontuario.entity");
const ficha_atendimento_entity_1 = require("./domain/entities/ficha-atendimento.entity");
const prontuario_repository_1 = require("./infrastructure/repositories/prontuario.repository");
const prontuario_service_1 = require("./application/use-cases/prontuario.service");
const prontuario_controller_1 = require("./presentation/controllers/prontuario.controller");
const auth_module_1 = require("./auth.module");
let ProntuarioModule = class ProntuarioModule {
};
exports.ProntuarioModule = ProntuarioModule;
exports.ProntuarioModule = ProntuarioModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([prontuario_entity_1.Prontuario, ficha_atendimento_entity_1.FichaAtendimento]), auth_module_1.AuthModule],
        providers: [prontuario_repository_1.ProntuarioRepository, prontuario_service_1.ProntuarioService],
        controllers: [prontuario_controller_1.ProntuarioController],
        exports: [prontuario_service_1.ProntuarioService],
    })
], ProntuarioModule);
//# sourceMappingURL=prontuario.module.js.map