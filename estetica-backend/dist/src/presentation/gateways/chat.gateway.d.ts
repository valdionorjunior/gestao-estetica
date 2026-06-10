import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatService } from '../../application/use-cases/chat.service';
import { MensagemTipo } from '../../domain/entities/chat-mensagem.entity';
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    private readonly jwtService;
    private readonly config;
    server: Server;
    private readonly logger;
    private readonly usuariosConectados;
    constructor(chatService: ChatService, jwtService: JwtService, config: ConfigService);
    afterInit(): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    entrarCanal(client: Socket, data: {
        canal: string;
    }): Promise<void>;
    sairCanal(client: Socket, data: {
        canal: string;
    }): Promise<void>;
    receberMensagem(client: Socket, data: {
        canal: string;
        conteudo: string;
        tipo?: MensagemTipo;
        respostaParaId?: string;
    }): Promise<void>;
    digitando(client: Socket, data: {
        canal: string;
        digitando: boolean;
    }): void;
    carregarHistorico(client: Socket, data: {
        canal: string;
        antes?: string;
    }): Promise<void>;
    marcarLida(client: Socket, data: {
        mensagemId: string;
    }): Promise<void>;
    usuariosOnline(client: Socket): void;
}
