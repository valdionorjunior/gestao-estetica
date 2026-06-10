"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacientesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const paciente_entity_1 = require("./domain/entities/paciente.entity");
const paciente_repository_1 = require("./infrastructure/repositories/paciente.repository");
const pacientes_service_1 = require("./application/use-cases/pacientes.service");
const pacientes_controller_1 = require("./presentation/controllers/pacientes.controller");
const auth_module_1 = require("./auth.module");
let PacientesModule = class PacientesModule {
};
exports.PacientesModule = PacientesModule;
exports.PacientesModule = PacientesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([paciente_entity_1.Paciente]), auth_module_1.AuthModule],
        providers: [paciente_repository_1.PacienteRepository, pacientes_service_1.PacientesService],
        controllers: [pacientes_controller_1.PacientesController],
        exports: [pacientes_service_1.PacientesService, paciente_repository_1.PacienteRepository],
    })
], PacientesModule);
//# sourceMappingURL=pacientes.module.js.map