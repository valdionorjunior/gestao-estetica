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
exports.ContaFinanceira = void 0;
const typeorm_1 = require("typeorm");
const financeiro_enums_1 = require("./financeiro.enums");
let ContaFinanceira = class ContaFinanceira {
    id;
    clinicaId;
    tipo;
    descricao;
    valor;
    dataVencimento;
    dataPagamento;
    status;
    formaPagamento;
    categoria;
    pacienteId;
    agendamentoId;
    observacoes;
    createdAt;
    updatedAt;
};
exports.ContaFinanceira = ContaFinanceira;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ContaFinanceira.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'clinica_id', nullable: true }),
    __metadata("design:type", Object)
], ContaFinanceira.prototype, "clinicaId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: financeiro_enums_1.ContaTipo }),
    __metadata("design:type", String)
], ContaFinanceira.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 300 }),
    __metadata("design:type", String)
], ContaFinanceira.prototype, "descricao", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], ContaFinanceira.prototype, "valor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'data_vencimento', type: 'date' }),
    __metadata("design:type", Date)
], ContaFinanceira.prototype, "dataVencimento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'data_pagamento', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], ContaFinanceira.prototype, "dataPagamento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: financeiro_enums_1.ContaStatus, default: financeiro_enums_1.ContaStatus.PENDENTE }),
    __metadata("design:type", String)
], ContaFinanceira.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'forma_pagamento', type: 'enum', enum: financeiro_enums_1.FormaPagamento, nullable: true }),
    __metadata("design:type", Object)
], ContaFinanceira.prototype, "formaPagamento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], ContaFinanceira.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'paciente_id', nullable: true }),
    __metadata("design:type", Object)
], ContaFinanceira.prototype, "pacienteId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'agendamento_id', nullable: true }),
    __metadata("design:type", Object)
], ContaFinanceira.prototype, "agendamentoId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], ContaFinanceira.prototype, "observacoes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ContaFinanceira.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ContaFinanceira.prototype, "updatedAt", void 0);
exports.ContaFinanceira = ContaFinanceira = __decorate([
    (0, typeorm_1.Entity)('contas_financeiras')
], ContaFinanceira);
//# sourceMappingURL=conta-financeira.entity.js.map