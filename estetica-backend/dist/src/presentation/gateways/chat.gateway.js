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
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const chat_service_1 = require("../../application/use-cases/chat.service");
const chat_mensagem_entity_1 = require("../../domain/entities/chat-mensagem.entity");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    chatService;
    jwtService;
    config;
    server;
    logger = new common_1.Logger(ChatGateway_1.name);
    usuariosConectados = new Map();
    constructor(chatService, jwtService, config) {
        this.chatService = chatService;
        this.jwtService = jwtService;
        this.config = config;
    }
    afterInit() {
        this.logger.log('ChatGateway iniciado — WebSocket /chat');
    }
    async handleConnection(client) {
        const token = client.handshake.auth?.token ??
            client.handshake.headers?.authorization?.replace('Bearer ', '');
        if (!token) {
            this.logger.warn(`Socket ${client.id} rejeitado — sem token`);
            client.emit('erro', { message: 'Token JWT obrigatório' });
            client.disconnect();
            return;
        }
        try {
            const payload = this.jwtService.verify(token, { secret: this.config.get('JWT_SECRET') });
            this.usuariosConectados.set(client.id, {
                userId: payload.sub,
                nome: payload.nome,
                role: payload.role,
                email: payload.email,
                canaisAtivos: new Set(['geral']),
            });
            await client.join('geral');
            this.logger.log(`${payload.nome} conectado (${client.id})`);
            client.emit('conectado', {
                userId: payload.sub,
                canaisFixos: this.chatService.canaisFixos(),
            });
            this.server.to('geral').emit('usuario_online', {
                userId: payload.sub,
                nome: payload.nome,
                role: payload.role,
            });
        }
        catch {
            this.logger.warn(`Socket ${client.id} rejeitado — token inválido`);
            client.emit('erro', { message: 'Token inválido ou expirado' });
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const usuario = this.usuariosConectados.get(client.id);
        if (usuario) {
            this.server.to('geral').emit('usuario_offline', { userId: usuario.userId });
            this.usuariosConectados.delete(client.id);
            this.logger.log(`${usuario.nome} desconectado (${client.id})`);
        }
    }
    async entrarCanal(client, data) {
        const usuario = this.usuariosConectados.get(client.id);
        if (!usuario)
            return;
        await client.join(data.canal);
        usuario.canaisAtivos.add(data.canal);
        const historico = await this.chatService.historico(data.canal, 50);
        client.emit('historico', { canal: data.canal, mensagens: historico });
    }
    async sairCanal(client, data) {
        const usuario = this.usuariosConectados.get(client.id);
        if (!usuario || data.canal === 'geral')
            return;
        await client.leave(data.canal);
        usuario.canaisAtivos.delete(data.canal);
    }
    async receberMensagem(client, data) {
        const usuario = this.usuariosConectados.get(client.id);
        if (!usuario)
            return;
        if (!data.conteudo?.trim())
            return;
        const msg = await this.chatService.salvar({
            remetenteId: usuario.userId,
            remetenteNome: usuario.nome,
            remetenteRole: usuario.role,
            canal: data.canal ?? 'geral',
            conteudo: data.conteudo.trim(),
            tipo: data.tipo ?? chat_mensagem_entity_1.MensagemTipo.TEXTO,
            respostaParaId: data.respostaParaId ?? null,
        });
        this.server.to(msg.canal).emit('nova_mensagem', msg);
    }
    digitando(client, data) {
        const usuario = this.usuariosConectados.get(client.id);
        if (!usuario)
            return;
        client.to(data.canal).emit('usuario_digitando', {
            userId: usuario.userId,
            nome: usuario.nome,
            canal: data.canal,
            digitando: data.digitando,
        });
    }
    async carregarHistorico(client, data) {
        const mensagens = await this.chatService.historico(data.canal, 50, data.antes);
        client.emit('historico_paginado', { canal: data.canal, mensagens });
    }
    async marcarLida(client, data) {
        const usuario = this.usuariosConectados.get(client.id);
        if (!usuario)
            return;
        await this.chatService.marcarLida(data.mensagemId, usuario.userId);
    }
    usuariosOnline(client) {
        const online = Array.from(this.usuariosConectados.values()).map((u) => ({
            userId: u.userId,
            nome: u.nome,
            role: u.role,
        }));
        client.emit('lista_usuarios_online', online);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('entrar_canal'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "entrarCanal", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sair_canal'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "sairCanal", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('mensagem'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "receberMensagem", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('digitando'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "digitando", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('carregar_historico'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "carregarHistorico", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('marcar_lida'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "marcarLida", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('usuarios_online'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "usuariosOnline", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            credentials: true,
        },
        namespace: '/chat',
        transports: ['websocket', 'polling'],
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        jwt_1.JwtService,
        config_1.ConfigService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map