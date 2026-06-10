import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { ChatService } from '../../application/use-cases/chat.service';
import { MensagemTipo } from '../../domain/entities/chat-mensagem.entity';

interface UsuarioConectado {
  userId: string;
  nome: string;
  role: string;
  email: string;
  canaisAtivos: Set<string>;
}

@WebSocketGateway({
  cors: {
    origin: '*', // Em produção, restringir ao domínio do frontend
    credentials: true,
  },
  namespace: '/chat',
  transports: ['websocket', 'polling'],
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  // Mapa socket.id → dados do usuário
  private readonly usuariosConectados = new Map<string, UsuarioConectado>();

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  afterInit() {
    this.logger.log('ChatGateway iniciado — WebSocket /chat');
  }

  // ─── Autenticação na conexão ─────────────────────────────────────────────

  async handleConnection(client: Socket) {
    const token =
      (client.handshake.auth?.token as string | undefined) ??
      (client.handshake.headers?.authorization as string | undefined)?.replace('Bearer ', '');

    if (!token) {
      this.logger.warn(`Socket ${client.id} rejeitado — sem token`);
      client.emit('erro', { message: 'Token JWT obrigatório' });
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify<{
        sub: string;
        nome: string;
        role: string;
        email: string;
      }>(token, { secret: this.config.get<string>('JWT_SECRET') });

      this.usuariosConectados.set(client.id, {
        userId: payload.sub,
        nome: payload.nome,
        role: payload.role,
        email: payload.email,
        canaisAtivos: new Set(['geral']),
      });

      // Entrar no canal geral automaticamente
      await client.join('geral');

      this.logger.log(`${payload.nome} conectado (${client.id})`);
      client.emit('conectado', {
        userId: payload.sub,
        canaisFixos: this.chatService.canaisFixos(),
      });

      // Notificar canal geral
      this.server.to('geral').emit('usuario_online', {
        userId: payload.sub,
        nome: payload.nome,
        role: payload.role,
      });
    } catch {
      this.logger.warn(`Socket ${client.id} rejeitado — token inválido`);
      client.emit('erro', { message: 'Token inválido ou expirado' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const usuario = this.usuariosConectados.get(client.id);
    if (usuario) {
      this.server.to('geral').emit('usuario_offline', { userId: usuario.userId });
      this.usuariosConectados.delete(client.id);
      this.logger.log(`${usuario.nome} desconectado (${client.id})`);
    }
  }

  // ─── Entrar em canal ─────────────────────────────────────────────────────

  @SubscribeMessage('entrar_canal')
  async entrarCanal(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { canal: string },
  ) {
    const usuario = this.usuariosConectados.get(client.id);
    if (!usuario) return;

    await client.join(data.canal);
    usuario.canaisAtivos.add(data.canal);

    // Enviar histórico das últimas 50 mensagens
    const historico = await this.chatService.historico(data.canal, 50);
    client.emit('historico', { canal: data.canal, mensagens: historico });
  }

  // ─── Sair de canal ───────────────────────────────────────────────────────

  @SubscribeMessage('sair_canal')
  async sairCanal(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { canal: string },
  ) {
    const usuario = this.usuariosConectados.get(client.id);
    if (!usuario || data.canal === 'geral') return;
    await client.leave(data.canal);
    usuario.canaisAtivos.delete(data.canal);
  }

  // ─── Enviar mensagem ──────────────────────────────────────────────────────

  @SubscribeMessage('mensagem')
  async receberMensagem(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      canal: string;
      conteudo: string;
      tipo?: MensagemTipo;
      respostaParaId?: string;
    },
  ) {
    const usuario = this.usuariosConectados.get(client.id);
    if (!usuario) return;
    if (!data.conteudo?.trim()) return;

    const msg = await this.chatService.salvar({
      remetenteId: usuario.userId,
      remetenteNome: usuario.nome,
      remetenteRole: usuario.role,
      canal: data.canal ?? 'geral',
      conteudo: data.conteudo.trim(),
      tipo: data.tipo ?? MensagemTipo.TEXTO,
      respostaParaId: data.respostaParaId ?? null,
    });

    // Broadcast para todos no canal
    this.server.to(msg.canal).emit('nova_mensagem', msg);
  }

  // ─── Indicador de digitação ──────────────────────────────────────────────

  @SubscribeMessage('digitando')
  digitando(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { canal: string; digitando: boolean },
  ) {
    const usuario = this.usuariosConectados.get(client.id);
    if (!usuario) return;
    client.to(data.canal).emit('usuario_digitando', {
      userId: usuario.userId,
      nome: usuario.nome,
      canal: data.canal,
      digitando: data.digitando,
    });
  }

  // ─── Carregar histórico paginado ─────────────────────────────────────────

  @SubscribeMessage('carregar_historico')
  async carregarHistorico(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { canal: string; antes?: string },
  ) {
    const mensagens = await this.chatService.historico(data.canal, 50, data.antes);
    client.emit('historico_paginado', { canal: data.canal, mensagens });
  }

  // ─── Marcar como lida ────────────────────────────────────────────────────

  @SubscribeMessage('marcar_lida')
  async marcarLida(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { mensagemId: string },
  ) {
    const usuario = this.usuariosConectados.get(client.id);
    if (!usuario) return;
    await this.chatService.marcarLida(data.mensagemId, usuario.userId);
  }

  // ─── Lista de usuários online ─────────────────────────────────────────────

  @SubscribeMessage('usuarios_online')
  usuariosOnline(@ConnectedSocket() client: Socket) {
    const online = Array.from(this.usuariosConectados.values()).map((u) => ({
      userId: u.userId,
      nome: u.nome,
      role: u.role,
    }));
    client.emit('lista_usuarios_online', online);
  }
}
