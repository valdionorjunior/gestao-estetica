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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chat_mensagem_entity_1 = require("../../domain/entities/chat-mensagem.entity");
let ChatService = class ChatService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async salvar(params) {
        const msg = this.repo.create({
            remetenteId: params.remetenteId,
            remetenteNome: params.remetenteNome,
            remetenteRole: params.remetenteRole,
            canal: this.sanitizarCanal(params.canal),
            conteudo: params.conteudo.substring(0, 4000),
            tipo: params.tipo ?? chat_mensagem_entity_1.MensagemTipo.TEXTO,
            respostaParaId: params.respostaParaId ?? null,
        });
        const salva = await this.repo.save(msg);
        return this.toPayload(salva);
    }
    async historico(canal, limite = 50, antes) {
        const canalSanitizado = this.sanitizarCanal(canal);
        const qb = this.repo
            .createQueryBuilder('m')
            .where('m.canal = :canal', { canal: canalSanitizado })
            .orderBy('m.createdAt', 'DESC')
            .take(Math.min(100, limite));
        if (antes) {
            qb.andWhere('m.createdAt < :antes', { antes: new Date(antes) });
        }
        const msgs = await qb.getMany();
        return msgs.reverse().map((m) => this.toPayload(m));
    }
    canaisFixos() {
        return ['geral', 'agenda', 'financeiro', 'estoque'];
    }
    canalPrivado(userIdA, userIdB) {
        const sorted = [userIdA, userIdB].sort();
        return `priv_${sorted[0]}_${sorted[1]}`;
    }
    async marcarLida(mensagemId, userId) {
        const msg = await this.repo.findOne({ where: { id: mensagemId } });
        if (!msg)
            return;
        const lidas = msg.lidaPorJson
            ? JSON.parse(msg.lidaPorJson)
            : [];
        if (!lidas.includes(userId)) {
            lidas.push(userId);
            msg.lidaPorJson = JSON.stringify(lidas);
            await this.repo.save(msg).catch(() => { });
        }
    }
    sanitizarCanal(canal) {
        return canal.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 100) || 'geral';
    }
    toPayload(m) {
        return {
            id: m.id,
            remetenteId: m.remetenteId,
            remetenteNome: m.remetenteNome,
            remetenteRole: m.remetenteRole,
            canal: m.canal,
            conteudo: m.conteudo,
            tipo: m.tipo,
            respostaParaId: m.respostaParaId,
            editada: m.editada,
            createdAt: m.createdAt,
        };
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_mensagem_entity_1.ChatMensagem)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ChatService);
//# sourceMappingURL=chat.service.js.map