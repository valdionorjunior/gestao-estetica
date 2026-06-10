"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultaInterativaModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const platform_express_1 = require("@nestjs/platform-express");
const path_1 = require("path");
const consulta_foto_entity_1 = require("./domain/entities/consulta-foto.entity");
const consulta_interativa_service_1 = require("./application/use-cases/consulta-interativa.service");
const consulta_interativa_controller_1 = require("./presentation/controllers/consulta-interativa.controller");
let ConsultaInterativaModule = class ConsultaInterativaModule {
};
exports.ConsultaInterativaModule = ConsultaInterativaModule;
exports.ConsultaInterativaModule = ConsultaInterativaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([consulta_foto_entity_1.ConsultaFoto]),
            platform_express_1.MulterModule.register({
                dest: (0, path_1.join)(process.cwd(), 'uploads'),
            }),
        ],
        controllers: [consulta_interativa_controller_1.ConsultaInterativaController],
        providers: [consulta_interativa_service_1.ConsultaInterativaService],
        exports: [consulta_interativa_service_1.ConsultaInterativaService],
    })
], ConsultaInterativaModule);
//# sourceMappingURL=consulta-interativa.module.js.map