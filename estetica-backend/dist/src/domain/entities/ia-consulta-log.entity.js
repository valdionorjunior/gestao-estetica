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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IaConsultaLog = exports.IaStatus = exports.IaOperacao = void 0;
const typeorm_1 = require("typeorm");
var IaOperacao;
(function (IaOperacao) {
    IaOperacao["TRANSCRICAO_AUDIO"] = "TRANSCRICAO_AUDIO";
    IaOperacao["RESUMO_CONSULTA"] = "RESUMO_CONSULTA";
    IaOperacao["HIPOTESE_DIAGNOSTICA"] = "HIPOTESE_DIAGNOSTICA";
})(IaOperacao || (exports.IaOperacao = IaOperacao = {}));
var IaStatus;
(function (IaStatus) {
    IaStatus["SUCESSO"] = "SUCESSO";
    IaStatus["FALHOU"] = "FALHOU";
    IaStatus["SIMULADO"] = "SIMULADO";
})(IaStatus || (exports.IaStatus = IaStatus = {}));
let IaConsultaLog = class IaConsultaLog {
    id;
    operacao;
    status;
    pacienteId;
    prontuarioId;
    profissionalId;
    entrada;
    resultado;
    tokensUtilizados;
    modeloIa;
    createdAt;
};
exports.IaConsultaLog = IaConsultaLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], IaConsultaLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: IaOperacao, name: 'operacao' }),
    __metadata("design:type", String)
], IaConsultaLog.prototype, "operacao", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: IaStatus, name: 'status' }),
    __metadata("design:type", String)
], IaConsultaLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'paciente_id', nullable: true }),
    __metadata("design:type", Object)
], IaConsultaLog.prototype, "pacienteId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'prontuario_id', nullable: true }),
    __metadata("design:type", Object)
], IaConsultaLog.prototype, "prontuarioId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'profissional_id', nullable: true }),
    __metadata("design:type", Object)
], IaConsultaLog.prototype, "profissionalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'entrada', nullable: true }),
    __metadata("design:type", Object)
], IaConsultaLog.prototype, "entrada", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'resultado', nullable: true }),
    __metadata("design:type", Object)
], IaConsultaLog.prototype, "resultado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'tokens_utilizados', nullable: true, default: 0 }),
    __metadata("design:type", Object)
], IaConsultaLog.prototype, "tokensUtilizados", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'modelo_ia', nullable: true }),
    __metadata("design:type", Object)
], IaConsultaLog.prototype, "modeloIa", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], IaConsultaLog.prototype, "createdAt", void 0);
exports.IaConsultaLog = IaConsultaLog = __decorate([
    (0, typeorm_1.Entity)('ia_consulta_logs')
], IaConsultaLog);
//# sourceMappingURL=ia-consulta-log.entity.js.map