import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PlataformaIntegracao {
  RD_STATION = 'RD_STATION',
  LEADLOVERS = 'LEADLOVERS',
}

export enum IntegracaoAcao {
  SINCRONIZAR_CONTATO = 'SINCRONIZAR_CONTATO',
  REGISTRAR_EVENTO = 'REGISTRAR_EVENTO',
  WEBHOOK_RECEBIDO = 'WEBHOOK_RECEBIDO',
  WEBHOOK_LEAD = 'WEBHOOK_LEAD',
}

export enum IntegracaoStatus {
  SUCESSO = 'SUCESSO',
  FALHOU = 'FALHOU',
  SIMULADO = 'SIMULADO', // Sem credenciais configuradas
}

/**
 * Log de todas as operações de integração com plataformas externas.
 * Permite rastrear sincronizações, webhooks e erros.
 */
@Entity('integracao_logs')
export class IntegracaoLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PlataformaIntegracao,
    name: 'plataforma',
  })
  plataforma: PlataformaIntegracao;

  @Column({
    type: 'enum',
    enum: IntegracaoAcao,
    name: 'acao',
  })
  acao: IntegracaoAcao;

  @Column({
    type: 'enum',
    enum: IntegracaoStatus,
    name: 'status',
  })
  status: IntegracaoStatus;

  /** ID do paciente sincronizado (quando aplicável) */
  @Column({ type: 'uuid', name: 'paciente_id', nullable: true })
  pacienteId: string | null;

  /** ID externo na plataforma (ex: contact_uuid no RD Station) */
  @Column({ type: 'varchar', length: 200, name: 'id_externo', nullable: true })
  idExterno: string | null;

  /** Payload enviado ou recebido (JSON) */
  @Column({ type: 'text', name: 'payload_json', nullable: true })
  payloadJson: string | null;

  /** Resposta da API ou mensagem de erro */
  @Column({ type: 'text', nullable: true })
  resposta: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
