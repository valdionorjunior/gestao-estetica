import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMensagem, MensagemTipo } from '../../domain/entities/chat-mensagem.entity';

export interface MensagemPayload {
  id: string;
  remetenteId: string;
  remetenteNome: string;
  remetenteRole: string;
  canal: string;
  conteudo: string;
  tipo: MensagemTipo;
  respostaParaId: string | null;
  editada: boolean;
  createdAt: Date;
}

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMensagem)
    private readonly repo: Repository<ChatMensagem>,
  ) {}

  // ─── Enviar mensagem ────────────────────────────────────────────────────────

  async salvar(params: {
    remetenteId: string;
    remetenteNome: string;
    remetenteRole: string;
    canal: string;
    conteudo: string;
    tipo?: MensagemTipo;
    respostaParaId?: string | null;
  }): Promise<MensagemPayload> {
    const msg = this.repo.create({
      remetenteId: params.remetenteId,
      remetenteNome: params.remetenteNome,
      remetenteRole: params.remetenteRole,
      canal: this.sanitizarCanal(params.canal),
      conteudo: params.conteudo.substring(0, 4000), // limite de segurança
      tipo: params.tipo ?? MensagemTipo.TEXTO,
      respostaParaId: params.respostaParaId ?? null,
    });
    const salva = await this.repo.save(msg);
    return this.toPayload(salva);
  }

  // ─── Histórico do canal ─────────────────────────────────────────────────────

  async historico(
    canal: string,
    limite = 50,
    antes?: string, // cursor: createdAt do último item carregado
  ): Promise<MensagemPayload[]> {
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

  // ─── Canais disponíveis (fixos + privados ativos) ──────────────────────────

  canaisFixos(): string[] {
    return ['geral', 'agenda', 'financeiro', 'estoque'];
  }

  canalPrivado(userIdA: string, userIdB: string): string {
    const sorted = [userIdA, userIdB].sort();
    return `priv_${sorted[0]}_${sorted[1]}`;
  }

  // ─── Marcar como lida ───────────────────────────────────────────────────────

  async marcarLida(mensagemId: string, userId: string): Promise<void> {
    const msg = await this.repo.findOne({ where: { id: mensagemId } });
    if (!msg) return;
    const lidas: string[] = msg.lidaPorJson
      ? (JSON.parse(msg.lidaPorJson) as string[])
      : [];
    if (!lidas.includes(userId)) {
      lidas.push(userId);
      msg.lidaPorJson = JSON.stringify(lidas);
      await this.repo.save(msg).catch(() => {});
    }
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private sanitizarCanal(canal: string): string {
    // Permite apenas letras, números, underscores e hifens
    return canal.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 100) || 'geral';
  }

  private toPayload(m: ChatMensagem): MensagemPayload {
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
}
