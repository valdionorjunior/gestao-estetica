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
exports.ChatMensagem = exports.MensagemTipo = void 0;
const typeorm_1 = require("typeorm");
var MensagemTipo;
(function (MensagemTipo) {
    MensagemTipo["TEXTO"] = "TEXTO";
    MensagemTipo["IMAGEM"] = "IMAGEM";
    MensagemTipo["ARQUIVO"] = "ARQUIVO";
    MensagemTipo["SISTEMA"] = "SISTEMA";
})(MensagemTipo || (exports.MensagemTipo = MensagemTipo = {}));
let ChatMensagem = class ChatMensagem {
    id;
    remetenteId;
    remetenteNome;
    remetenteRole;
    canal;
    conteudo;
    tipo;
    respostaParaId;
    lidaPorJson;
    editada;
    createdAt;
};
exports.ChatMensagem = ChatMensagem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ChatMensagem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'remetente_id' }),
    __metadata("design:type", String)
], ChatMensagem.prototype, "remetenteId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'remetente_nome' }),
    __metadata("design:type", String)
], ChatMensagem.prototype, "remetenteNome", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, name: 'remetente_role' }),
    __metadata("design:type", String)
], ChatMensagem.prototype, "remetenteRole", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, default: 'geral' }),
    __metadata("design:type", String)
], ChatMensagem.prototype, "canal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ChatMensagem.prototype, "conteudo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MensagemTipo,
        default: MensagemTipo.TEXTO,
        name: 'tipo',
    }),
    __metadata("design:type", String)
], ChatMensagem.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'resposta_para_id', nullable: true }),
    __metadata("design:type", Object)
], ChatMensagem.prototype, "respostaParaId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'lida_por_json', nullable: true }),
    __metadata("design:type", Object)
], ChatMensagem.prototype, "lidaPorJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'editada' }),
    __metadata("design:type", Boolean)
], ChatMensagem.prototype, "editada", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], ChatMensagem.prototype, "createdAt", void 0);
exports.ChatMensagem = ChatMensagem = __decorate([
    (0, typeorm_1.Entity)('chat_mensagens')
], ChatMensagem);
//# sourceMappingURL=chat-mensagem.entity.js.map