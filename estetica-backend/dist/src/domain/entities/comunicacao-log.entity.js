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
exports.ComunicacaoLog = exports.ComunicacaoMotivo = exports.ComunicacaoStatus = exports.ComunicacaoTipo = void 0;
const typeorm_1 = require("typeorm");
var ComunicacaoTipo;
(function (ComunicacaoTipo) {
    ComunicacaoTipo["EMAIL"] = "EMAIL";
    ComunicacaoTipo["SMS"] = "SMS";
    ComunicacaoTipo["WHATSAPP"] = "WHATSAPP";
})(ComunicacaoTipo || (exports.ComunicacaoTipo = ComunicacaoTipo = {}));
var ComunicacaoStatus;
(function (ComunicacaoStatus) {
    ComunicacaoStatus["PENDENTE"] = "PENDENTE";
    ComunicacaoStatus["ENVIADO"] = "ENVIADO";
    ComunicacaoStatus["FALHOU"] = "FALHOU";
    ComunicacaoStatus["SIMULADO"] = "SIMULADO";
})(ComunicacaoStatus || (exports.ComunicacaoStatus = ComunicacaoStatus = {}));
var ComunicacaoMotivo;
(function (ComunicacaoMotivo) {
    ComunicacaoMotivo["LEMBRETE_AGENDAMENTO"] = "LEMBRETE_AGENDAMENTO";
    ComunicacaoMotivo["CONFIRMACAO_AGENDAMENTO"] = "CONFIRMACAO_AGENDAMENTO";
    ComunicacaoMotivo["CANCELAMENTO_AGENDAMENTO"] = "CANCELAMENTO_AGENDAMENTO";
    ComunicacaoMotivo["CAMPANHA_MARKETING"] = "CAMPANHA_MARKETING";
    ComunicacaoMotivo["ANIVERSARIO"] = "ANIVERSARIO";
    ComunicacaoMotivo["POS_ATENDIMENTO"] = "POS_ATENDIMENTO";
    ComunicacaoMotivo["MANUAL"] = "MANUAL";
})(ComunicacaoMotivo || (exports.ComunicacaoMotivo = ComunicacaoMotivo = {}));
let ComunicacaoLog = class ComunicacaoLog {
    id;
    pacienteId;
    agendamentoId;
    tipo;
    motivo;
    status;
    destinatario;
    assunto;
    mensagem;
    erroDetalhe;
    enviadoEm;
    createdAt;
};
exports.ComunicacaoLog = ComunicacaoLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ComunicacaoLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'paciente_id', nullable: true }),
    __metadata("design:type", Object)
], ComunicacaoLog.prototype, "pacienteId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'agendamento_id', nullable: true }),
    __metadata("design:type", Object)
], ComunicacaoLog.prototype, "agendamentoId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ComunicacaoTipo,
        default: ComunicacaoTipo.EMAIL,
    }),
    __metadata("design:type", String)
], ComunicacaoLog.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ComunicacaoMotivo,
        default: ComunicacaoMotivo.MANUAL,
    }),
    __metadata("design:type", String)
], ComunicacaoLog.prototype, "motivo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ComunicacaoStatus,
        default: ComunicacaoStatus.PENDENTE,
    }),
    __metadata("design:type", String)
], ComunicacaoLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", Object)
], ComunicacaoLog.prototype, "destinatario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], ComunicacaoLog.prototype, "assunto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ComunicacaoLog.prototype, "mensagem", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'erro_detalhe', nullable: true }),
    __metadata("design:type", Object)
], ComunicacaoLog.prototype, "erroDetalhe", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'enviado_em', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], ComunicacaoLog.prototype, "enviadoEm", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], ComunicacaoLog.prototype, "createdAt", void 0);
exports.ComunicacaoLog = ComunicacaoLog = __decorate([
    (0, typeorm_1.Entity)('comunicacao_logs')
], ComunicacaoLog);
//# sourceMappingURL=comunicacao-log.entity.js.map