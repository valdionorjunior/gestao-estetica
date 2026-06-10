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
exports.FichaAtendimento = exports.FichaStatus = void 0;
const typeorm_1 = require("typeorm");
const prontuario_entity_1 = require("./prontuario.entity");
var FichaStatus;
(function (FichaStatus) {
    FichaStatus["ABERTA"] = "ABERTA";
    FichaStatus["FECHADA"] = "FECHADA";
})(FichaStatus || (exports.FichaStatus = FichaStatus = {}));
let FichaAtendimento = class FichaAtendimento {
    id;
    prontuarioId;
    prontuario;
    agendamentoId;
    profissionalId;
    titulo;
    conteudoEncrypted;
    status;
    fechadaEm;
    createdAt;
    updatedAt;
};
exports.FichaAtendimento = FichaAtendimento;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FichaAtendimento.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'prontuario_id' }),
    __metadata("design:type", String)
], FichaAtendimento.prototype, "prontuarioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => prontuario_entity_1.Prontuario),
    (0, typeorm_1.JoinColumn)({ name: 'prontuario_id' }),
    __metadata("design:type", prontuario_entity_1.Prontuario)
], FichaAtendimento.prototype, "prontuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'agendamento_id', nullable: true }),
    __metadata("design:type", Object)
], FichaAtendimento.prototype, "agendamentoId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'profissional_id' }),
    __metadata("design:type", String)
], FichaAtendimento.prototype, "profissionalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], FichaAtendimento.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'conteudo_encrypted', nullable: true }),
    __metadata("design:type", Object)
], FichaAtendimento.prototype, "conteudoEncrypted", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: FichaStatus,
        default: FichaStatus.ABERTA,
    }),
    __metadata("design:type", String)
], FichaAtendimento.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fechada_em', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], FichaAtendimento.prototype, "fechadaEm", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], FichaAtendimento.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], FichaAtendimento.prototype, "updatedAt", void 0);
exports.FichaAtendimento = FichaAtendimento = __decorate([
    (0, typeorm_1.Entity)('fichas_atendimento')
], FichaAtendimento);
//# sourceMappingURL=ficha-atendimento.entity.js.map