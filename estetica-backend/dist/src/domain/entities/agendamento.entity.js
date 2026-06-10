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
exports.Agendamento = void 0;
const typeorm_1 = require("typeorm");
const agendamento_status_enum_1 = require("./agendamento-status.enum");
const paciente_entity_1 = require("./paciente.entity");
let Agendamento = class Agendamento {
    id;
    clinicaId;
    pacienteId;
    paciente;
    profissionalId;
    procedimentoId;
    dataHoraInicio;
    dataHoraFim;
    status;
    observacoes;
    valor;
    lembreteEnviado;
    confirmadoEm;
    canceladoEm;
    motivoCancelamento;
    createdAt;
    updatedAt;
};
exports.Agendamento = Agendamento;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Agendamento.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'clinica_id', nullable: true }),
    __metadata("design:type", Object)
], Agendamento.prototype, "clinicaId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'uuid', name: 'paciente_id' }),
    __metadata("design:type", String)
], Agendamento.prototype, "pacienteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => paciente_entity_1.Paciente),
    (0, typeorm_1.JoinColumn)({ name: 'paciente_id' }),
    __metadata("design:type", paciente_entity_1.Paciente)
], Agendamento.prototype, "paciente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'profissional_id' }),
    __metadata("design:type", String)
], Agendamento.prototype, "profissionalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'procedimento_id', nullable: true }),
    __metadata("design:type", Object)
], Agendamento.prototype, "procedimentoId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'data_hora_inicio', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Agendamento.prototype, "dataHoraInicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'data_hora_fim', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Agendamento.prototype, "dataHoraFim", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: agendamento_status_enum_1.AgendamentoStatus,
        default: agendamento_status_enum_1.AgendamentoStatus.AGENDADO,
    }),
    __metadata("design:type", String)
], Agendamento.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Agendamento.prototype, "observacoes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Agendamento.prototype, "valor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lembrete_enviado', default: false }),
    __metadata("design:type", Boolean)
], Agendamento.prototype, "lembreteEnviado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'confirmado_em', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Agendamento.prototype, "confirmadoEm", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelado_em', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Agendamento.prototype, "canceladoEm", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'motivo_cancelamento', nullable: true }),
    __metadata("design:type", Object)
], Agendamento.prototype, "motivoCancelamento", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Agendamento.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Agendamento.prototype, "updatedAt", void 0);
exports.Agendamento = Agendamento = __decorate([
    (0, typeorm_1.Entity)('agendamentos')
], Agendamento);
//# sourceMappingURL=agendamento.entity.js.map