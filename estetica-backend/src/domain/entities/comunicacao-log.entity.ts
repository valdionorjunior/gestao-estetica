import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ComunicacaoTipo {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
}

export enum ComunicacaoStatus {
  PENDENTE = 'PENDENTE',
  ENVIADO = 'ENVIADO',
  FALHOU = 'FALHOU',
  SIMULADO = 'SIMULADO', // modo sem credenciais reais configuradas
}

export enum ComunicacaoMotivo {
  LEMBRETE_AGENDAMENTO = 'LEMBRETE_AGENDAMENTO',
  CONFIRMACAO_AGENDAMENTO = 'CONFIRMACAO_AGENDAMENTO',
  CANCELAMENTO_AGENDAMENTO = 'CANCELAMENTO_AGENDAMENTO',
  CAMPANHA_MARKETING = 'CAMPANHA_MARKETING',
  ANIVERSARIO = 'ANIVERSARIO',
  POS_ATENDIMENTO = 'POS_ATENDIMENTO',
  MANUAL = 'MANUAL',
}

/**
 * Registro de todas as comunicações enviadas pela clínica.
 * LGPD Art. 7 — base legal para comunicação (consentimento ou legítimo interesse).
 */
@Entity('comunicacao_logs')
export class ComunicacaoLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'paciente_id', nullable: true })
  pacienteId: string | null;

  @Column({ type: 'uuid', name: 'agendamento_id', nullable: true })
  agendamentoId: string | null;

  @Column({
    type: 'enum',
    enum: ComunicacaoTipo,
    default: ComunicacaoTipo.EMAIL,
  })
  tipo: ComunicacaoTipo;

  @Column({
    type: 'enum',
    enum: ComunicacaoMotivo,
    default: ComunicacaoMotivo.MANUAL,
  })
  motivo: ComunicacaoMotivo;

  @Column({
    type: 'enum',
    enum: ComunicacaoStatus,
    default: ComunicacaoStatus.PENDENTE,
  })
  status: ComunicacaoStatus;

  @Column({ type: 'varchar', length: 200, nullable: true })
  destinatario: string | null;

  @Column({ type: 'varchar', length: 200 })
  assunto: string;

  @Column({ type: 'text' })
  mensagem: string;

  @Column({ type: 'text', name: 'erro_detalhe', nullable: true })
  erroDetalhe: string | null;

  @Column({ name: 'enviado_em', type: 'timestamptz', nullable: true })
  enviadoEm: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
