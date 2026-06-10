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
exports.Paciente = void 0;
const typeorm_1 = require("typeorm");
let Paciente = class Paciente {
    id;
    clinicaId;
    nome;
    cpfEncrypted;
    dataNascimento;
    telefone;
    email;
    endereco;
    cidade;
    estado;
    cep;
    fotoUrl;
    ativo;
    createdAt;
    updatedAt;
};
exports.Paciente = Paciente;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Paciente.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'clinica_id', nullable: true }),
    __metadata("design:type", Object)
], Paciente.prototype, "clinicaId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Paciente.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'text', name: 'cpf_encrypted', nullable: true }),
    __metadata("design:type", Object)
], Paciente.prototype, "cpfEncrypted", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'data_nascimento', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Paciente.prototype, "dataNascimento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], Paciente.prototype, "telefone", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", Object)
], Paciente.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Paciente.prototype, "endereco", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Paciente.prototype, "cidade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'estado', length: 2, nullable: true }),
    __metadata("design:type", Object)
], Paciente.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'cep', length: 9, nullable: true }),
    __metadata("design:type", Object)
], Paciente.prototype, "cep", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'foto_url', nullable: true }),
    __metadata("design:type", Object)
], Paciente.prototype, "fotoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Paciente.prototype, "ativo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Paciente.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Paciente.prototype, "updatedAt", void 0);
exports.Paciente = Paciente = __decorate([
    (0, typeorm_1.Entity)('pacientes')
], Paciente);
//# sourceMappingURL=paciente.entity.js.map