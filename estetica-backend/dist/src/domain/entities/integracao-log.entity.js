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
exports.IntegracaoLog = exports.IntegracaoStatus = exports.IntegracaoAcao = exports.PlataformaIntegracao = void 0;
const typeorm_1 = require("typeorm");
var PlataformaIntegracao;
(function (PlataformaIntegracao) {
    PlataformaIntegracao["RD_STATION"] = "RD_STATION";
    PlataformaIntegracao["LEADLOVERS"] = "LEADLOVERS";
})(PlataformaIntegracao || (exports.PlataformaIntegracao = PlataformaIntegracao = {}));
var IntegracaoAcao;
(function (IntegracaoAcao) {
    IntegracaoAcao["SINCRONIZAR_CONTATO"] = "SINCRONIZAR_CONTATO";
    IntegracaoAcao["REGISTRAR_EVENTO"] = "REGISTRAR_EVENTO";
    IntegracaoAcao["WEBHOOK_RECEBIDO"] = "WEBHOOK_RECEBIDO";
    IntegracaoAcao["WEBHOOK_LEAD"] = "WEBHOOK_LEAD";
})(IntegracaoAcao || (exports.IntegracaoAcao = IntegracaoAcao = {}));
var IntegracaoStatus;
(function (IntegracaoStatus) {
    IntegracaoStatus["SUCESSO"] = "SUCESSO";
    IntegracaoStatus["FALHOU"] = "FALHOU";
    IntegracaoStatus["SIMULADO"] = "SIMULADO";
})(IntegracaoStatus || (exports.IntegracaoStatus = IntegracaoStatus = {}));
let IntegracaoLog = class IntegracaoLog {
    id;
    plataforma;
    acao;
    status;
    pacienteId;
    idExterno;
    payloadJson;
    resposta;
    createdAt;
};
exports.IntegracaoLog = IntegracaoLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], IntegracaoLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PlataformaIntegracao,
        name: 'plataforma',
    }),
    __metadata("design:type", String)
], IntegracaoLog.prototype, "plataforma", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: IntegracaoAcao,
        name: 'acao',
    }),
    __metadata("design:type", String)
], IntegracaoLog.prototype, "acao", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: IntegracaoStatus,
        name: 'status',
    }),
    __metadata("design:type", String)
], IntegracaoLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'paciente_id', nullable: true }),
    __metadata("design:type", Object)
], IntegracaoLog.prototype, "pacienteId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, name: 'id_externo', nullable: true }),
    __metadata("design:type", Object)
], IntegracaoLog.prototype, "idExterno", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'payload_json', nullable: true }),
    __metadata("design:type", Object)
], IntegracaoLog.prototype, "payloadJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], IntegracaoLog.prototype, "resposta", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], IntegracaoLog.prototype, "createdAt", void 0);
exports.IntegracaoLog = IntegracaoLog = __decorate([
    (0, typeorm_1.Entity)('integracao_logs')
], IntegracaoLog);
//# sourceMappingURL=integracao-log.entity.js.map