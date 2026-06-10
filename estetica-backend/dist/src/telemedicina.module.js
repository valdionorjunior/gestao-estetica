"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemediicinaModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sessao_telemedicina_entity_1 = require("./domain/entities/sessao-telemedicina.entity");
const telemedicina_service_1 = require("./application/use-cases/telemedicina.service");
const telemedicina_controller_1 = require("./presentation/controllers/telemedicina.controller");
let TelemediicinaModule = class TelemediicinaModule {
};
exports.TelemediicinaModule = TelemediicinaModule;
exports.TelemediicinaModule = TelemediicinaModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([sessao_telemedicina_entity_1.SessaoTelemedicina])],
        controllers: [telemedicina_controller_1.TelemediicinaController],
        providers: [telemedicina_service_1.TelemedicinavService],
        exports: [telemedicina_service_1.TelemedicinavService],
    })
], TelemediicinaModule);
//# sourceMappingURL=telemedicina.module.js.map