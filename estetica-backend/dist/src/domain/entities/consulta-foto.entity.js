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
exports.ConsultaFoto = exports.TipoFotoConsulta = void 0;
const typeorm_1 = require("typeorm");
var TipoFotoConsulta;
(function (TipoFotoConsulta) {
    TipoFotoConsulta["ANTES"] = "ANTES";
    TipoFotoConsulta["DEPOIS"] = "DEPOIS";
    TipoFotoConsulta["DURANTE"] = "DURANTE";
    TipoFotoConsulta["REFERENCIA"] = "REFERENCIA";
})(TipoFotoConsulta || (exports.TipoFotoConsulta = TipoFotoConsulta = {}));
let ConsultaFoto = class ConsultaFoto {
    id;
    pacienteId;
    prontuarioId;
    profissionalId;
    tipo;
    fotoUrl;
    descricao;
    anotacoesJson;
    dataConsulta;
    createdAt;
    updatedAt;
};
exports.ConsultaFoto = ConsultaFoto;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ConsultaFoto.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'paciente_id' }),
    __metadata("design:type", String)
], ConsultaFoto.prototype, "pacienteId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'prontuario_id', nullable: true }),
    __metadata("design:type", Object)
], ConsultaFoto.prototype, "prontuarioId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'profissional_id', nullable: true }),
    __metadata("design:type", Object)
], ConsultaFoto.prototype, "profissionalId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoFotoConsulta,
        default: TipoFotoConsulta.ANTES,
        name: 'tipo',
    }),
    __metadata("design:type", String)
], ConsultaFoto.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'foto_url' }),
    __metadata("design:type", String)
], ConsultaFoto.prototype, "fotoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", Object)
], ConsultaFoto.prototype, "descricao", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'anotacoes_json', nullable: true }),
    __metadata("design:type", Object)
], ConsultaFoto.prototype, "anotacoesJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'data_consulta', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], ConsultaFoto.prototype, "dataConsulta", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], ConsultaFoto.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], ConsultaFoto.prototype, "updatedAt", void 0);
exports.ConsultaFoto = ConsultaFoto = __decorate([
    (0, typeorm_1.Entity)('consulta_fotos')
], ConsultaFoto);
//# sourceMappingURL=consulta-foto.entity.js.map