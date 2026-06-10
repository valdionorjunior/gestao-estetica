"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const agendamento_entity_1 = require("./domain/entities/agendamento.entity");
const agenda_repository_1 = require("./infrastructure/repositories/agenda.repository");
const agenda_service_1 = require("./application/use-cases/agenda.service");
const agenda_controller_1 = require("./presentation/controllers/agenda.controller");
const auth_module_1 = require("./auth.module");
let AgendaModule = class AgendaModule {
};
exports.AgendaModule = AgendaModule;
exports.AgendaModule = AgendaModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([agendamento_entity_1.Agendamento]), auth_module_1.AuthModule],
        providers: [agenda_repository_1.AgendaRepository, agenda_service_1.AgendaService],
        controllers: [agenda_controller_1.AgendaController],
        exports: [agenda_service_1.AgendaService, agenda_repository_1.AgendaRepository],
    })
], AgendaModule);
//# sourceMappingURL=agenda.module.js.map