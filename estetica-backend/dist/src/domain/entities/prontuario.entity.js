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
exports.Prontuario = void 0;
const typeorm_1 = require("typeorm");
const paciente_entity_1 = require("./paciente.entity");
let Prontuario = class Prontuario {
    id;
    clinicaId;
    pacienteId;
    paciente;
    historicoMedicoEncrypted;
    alergiasEncrypted;
    medicamentosUsoEncrypted;
    observacoes;
    createdAt;
    updatedAt;
};
exports.Prontuario = Prontuario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Prontuario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'clinica_id', nullable: true }),
    __metadata("design:type", Object)
], Prontuario.prototype, "clinicaId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'paciente_id', unique: true }),
    __metadata("design:type", String)
], Prontuario.prototype, "pacienteId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => paciente_entity_1.Paciente),
    (0, typeorm_1.JoinColumn)({ name: 'paciente_id' }),
    __metadata("design:type", paciente_entity_1.Paciente)
], Prontuario.prototype, "paciente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'historico_medico_encrypted', nullable: true }),
    __metadata("design:type", Object)
], Prontuario.prototype, "historicoMedicoEncrypted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'alergias_encrypted', nullable: true }),
    __metadata("design:type", Object)
], Prontuario.prototype, "alergiasEncrypted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'medicamentos_uso_encrypted', nullable: true }),
    __metadata("design:type", Object)
], Prontuario.prototype, "medicamentosUsoEncrypted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Prontuario.prototype, "observacoes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Prontuario.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Prontuario.prototype, "updatedAt", void 0);
exports.Prontuario = Prontuario = __decorate([
    (0, typeorm_1.Entity)('prontuarios')
], Prontuario);
//# sourceMappingURL=prontuario.entity.js.map