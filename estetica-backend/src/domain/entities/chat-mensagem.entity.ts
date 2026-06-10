import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum MensagemTipo {
  TEXTO = 'TEXTO',
  IMAGEM = 'IMAGEM',
  ARQUIVO = 'ARQUIVO',
  SISTEMA = 'SISTEMA', // Ex: "Fulano entrou na sala"
}

/**
 * Mensagem do chat interno entre profissionais da clínica.
 * Suporta canais (sala) para separar contextos: geral, agenda, etc.
 */
@Entity('chat_mensagens')
export class ChatMensagem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Remetente — UUID do User */
  @Column({ type: 'uuid', name: 'remetente_id' })
  remetenteId: string;

  /** Nome do remetente (desnormalizado para performance) */
  @Column({ type: 'varchar', length: 100, name: 'remetente_nome' })
  remetenteNome: string;

  /** Role do remetente no momento do envio */
  @Column({ type: 'varchar', length: 30, name: 'remetente_role' })
  remetenteRole: string;

  /**
   * Canal/sala da mensagem.
   * Canais padrão: "geral", "agenda", "financeiro", "estoque"
   * Canal privado: "priv_{userId1}_{userId2}" (IDs em ordem alfabética)
   */
  @Column({ type: 'varchar', length: 100, default: 'geral' })
  canal: string;

  @Column({ type: 'text' })
  conteudo: string;

  @Column({
    type: 'enum',
    enum: MensagemTipo,
    default: MensagemTipo.TEXTO,
    name: 'tipo',
  })
  tipo: MensagemTipo;

  /** Referência opcional a outra mensagem (resposta/thread) */
  @Column({ type: 'uuid', name: 'resposta_para_id', nullable: true })
  respostaParaId: string | null;

  /** Usuários que leram a mensagem (JSON array de userIds) */
  @Column({ type: 'text', name: 'lida_por_json', nullable: true })
  lidaPorJson: string | null;

  @Column({ type: 'boolean', default: false, name: 'editada' })
  editada: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
