"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LgpdModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const lgpd_controller_1 = require("./presentation/controllers/lgpd.controller");
const audit_service_1 = require("./application/use-cases/audit.service");
const audit_log_entity_1 = require("./domain/entities/audit-log.entity");
const user_entity_1 = require("./domain/entities/user.entity");
const paciente_entity_1 = require("./domain/entities/paciente.entity");
const user_repository_1 = require("./infrastructure/repositories/user.repository");
let LgpdModule = class LgpdModule {
};
exports.LgpdModule = LgpdModule;
exports.LgpdModule = LgpdModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([audit_log_entity_1.AuditLog, user_entity_1.User, paciente_entity_1.Paciente]),
        ],
        controllers: [lgpd_controller_1.LgpdController],
        providers: [audit_service_1.AuditService, user_repository_1.UserRepository],
        exports: [audit_service_1.AuditService],
    })
], LgpdModule);
//# sourceMappingURL=lgpd.module.js.map