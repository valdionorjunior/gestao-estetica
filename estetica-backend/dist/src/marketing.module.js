"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const marketing_controller_1 = require("./presentation/controllers/marketing.controller");
const comunicacao_service_1 = require("./application/use-cases/comunicacao.service");
const lembretes_service_1 = require("./application/use-cases/lembretes.service");
const comunicacao_log_entity_1 = require("./domain/entities/comunicacao-log.entity");
const paciente_entity_1 = require("./domain/entities/paciente.entity");
const agendamento_entity_1 = require("./domain/entities/agendamento.entity");
let MarketingModule = class MarketingModule {
};
exports.MarketingModule = MarketingModule;
exports.MarketingModule = MarketingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forFeature([comunicacao_log_entity_1.ComunicacaoLog, paciente_entity_1.Paciente, agendamento_entity_1.Agendamento]),
        ],
        controllers: [marketing_controller_1.MarketingController],
        providers: [comunicacao_service_1.ComunicacaoService, lembretes_service_1.LembretesService],
        exports: [comunicacao_service_1.ComunicacaoService],
    })
], MarketingModule);
//# sourceMappingURL=marketing.module.js.map