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
exports.SessaoTelemedicina = exports.PlataformaVideo = exports.SessaoStatus = void 0;
const typeorm_1 = require("typeorm");
var SessaoStatus;
(function (SessaoStatus) {
    SessaoStatus["AGENDADA"] = "AGENDADA";
    SessaoStatus["EM_ANDAMENTO"] = "EM_ANDAMENTO";
    SessaoStatus["ENCERRADA"] = "ENCERRADA";
    SessaoStatus["CANCELADA"] = "CANCELADA";
})(SessaoStatus || (exports.SessaoStatus = SessaoStatus = {}));
var PlataformaVideo;
(function (PlataformaVideo) {
    PlataformaVideo["JITSI"] = "JITSI";
    PlataformaVideo["DAILY_CO"] = "DAILY_CO";
})(PlataformaVideo || (exports.PlataformaVideo = PlataformaVideo = {}));
let SessaoTelemedicina = class SessaoTelemedicina {
    id;
    pacienteId;
    pacienteNome;
    pacienteEmail;
    pacienteTelefone;
    profissionalId;
    profissionalNome;
    agendamentoId;
    status;
    plataforma;
    roomName;
    roomUrl;
    tokenPaciente;
    tokenProfissional;
    agendadoPara;
    iniciadoEm;
    encerradoEm;
    observacoes;
    arquivosJson;
    createdAt;
    updatedAt;
};
exports.SessaoTelemedicina = SessaoTelemedicina;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SessaoTelemedicina.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'paciente_id' }),
    __metadata("design:type", String)
], SessaoTelemedicina.prototype, "pacienteId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, name: 'paciente_nome' }),
    __metadata("design:type", String)
], SessaoTelemedicina.prototype, "pacienteNome", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, name: 'paciente_email', nullable: true }),
    __metadata("design:type", Object)
], SessaoTelemedicina.prototype, "pacienteEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, name: 'paciente_telefone', nullable: true }),
    __metadata("design:type", Object)
], SessaoTelemedicina.prototype, "pacienteTelefone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'profissional_id', nullable: true }),
    __metadata("design:type", Object)
], SessaoTelemedicina.prototype, "profissionalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, name: 'profissional_nome' }),
    __metadata("design:type", String)
], SessaoTelemedicina.prototype, "profissionalNome", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'agendamento_id', nullable: true }),
    __metadata("design:type", Object)
], SessaoTelemedicina.prototype, "agendamentoId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SessaoStatus,
        name: 'status',
        default: SessaoStatus.AGENDADA,
    }),
    __metadata("design:type", String)
], SessaoTelemedicina.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PlataformaVideo,
        name: 'plataforma',
        default: PlataformaVideo.JITSI,
    }),
    __metadata("design:type", String)
], SessaoTelemedicina.prototype, "plataforma", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 300, name: 'room_name' }),
    __metadata("design:type", String)
], SessaoTelemedicina.prototype, "roomName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, name: 'room_url' }),
    __metadata("design:type", String)
], SessaoTelemedicina.prototype, "roomUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 1000, name: 'token_paciente', nullable: true }),
    __metadata("design:type", Object)
], SessaoTelemedicina.prototype, "tokenPaciente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 1000, name: 'token_profissional', nullable: true }),
    __metadata("design:type", Object)
], SessaoTelemedicina.prototype, "tokenProfissional", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'agendado_para', nullable: true }),
    __metadata("design:type", Object)
], SessaoTelemedicina.prototype, "agendadoPara", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'iniciado_em', nullable: true }),
    __metadata("design:type", Object)
], SessaoTelemedicina.prototype, "iniciadoEm", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'encerrado_em', nullable: true }),
    __metadata("design:type", Object)
], SessaoTelemedicina.prototype, "encerradoEm", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SessaoTelemedicina.prototype, "observacoes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'arquivos_json', nullable: true, default: '[]' }),
    __metadata("design:type", String)
], SessaoTelemedicina.prototype, "arquivosJson", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], SessaoTelemedicina.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], SessaoTelemedicina.prototype, "updatedAt", void 0);
exports.SessaoTelemedicina = SessaoTelemedicina = __decorate([
    (0, typeorm_1.Entity)('sessoes_telemedicina')
], SessaoTelemedicina);
//# sourceMappingURL=sessao-telemedicina.entity.js.map