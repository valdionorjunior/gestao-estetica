import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SessaoStatus {
  AGENDADA = 'AGENDADA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  ENCERRADA = 'ENCERRADA',
  CANCELADA = 'CANCELADA',
}

export enum PlataformaVideo {
  JITSI = 'JITSI',       // Gratuito, sem API key
  DAILY_CO = 'DAILY_CO', // Premium — requer DAILY_CO_API_KEY
}

/**
 * Sessão de telemedicina — videoconferência entre paciente e profissional.
 * Suporta Jitsi Meet (gratuito) e Daily.co (premium).
 */
@Entity('sessoes_telemedicina')
export class SessaoTelemedicina {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'paciente_id' })
  pacienteId: string;

  @Column({ length: 200, name: 'paciente_nome' })
  pacienteNome: string;

  @Column({ type: 'varchar', length: 200, name: 'paciente_email', nullable: true })
  pacienteEmail: string | null;

  @Column({ type: 'varchar', length: 30, name: 'paciente_telefone', nullable: true })
  pacienteTelefone: string | null;

  @Column({ type: 'uuid', name: 'profissional_id', nullable: true })
  profissionalId: string | null;

  @Column({ length: 200, name: 'profissional_nome' })
  profissionalNome: string;

  /** Vinculado a um agendamento existente (opcional) */
  @Column({ type: 'uuid', name: 'agendamento_id', nullable: true })
  agendamentoId: string | null;

  @Column({
    type: 'enum',
    enum: SessaoStatus,
    name: 'status',
    default: SessaoStatus.AGENDADA,
  })
  status: SessaoStatus;

  @Column({
    type: 'enum',
    enum: PlataformaVideo,
    name: 'plataforma',
    default: PlataformaVideo.JITSI,
  })
  plataforma: PlataformaVideo;

  /** Nome único da sala (ex: estetica-ns-{uuid}) */
  @Column({ length: 300, name: 'room_name' })
  roomName: string;

  /** URL completa para entrar na sessão */
  @Column({ length: 500, name: 'room_url' })
  roomUrl: string;

  /** Token do paciente (Daily.co) ou mesmo URL (Jitsi) */
  @Column({ type: 'varchar', length: 1000, name: 'token_paciente', nullable: true })
  tokenPaciente: string | null;

  /** Token do profissional com poderes de host (Daily.co) */
  @Column({ type: 'varchar', length: 1000, name: 'token_profissional', nullable: true })
  tokenProfissional: string | null;

  /** Data/hora agendada para a consulta */
  @Column({ type: 'timestamp', name: 'agendado_para', nullable: true })
  agendadoPara: Date | null;

  @Column({ type: 'timestamp', name: 'iniciado_em', nullable: true })
  iniciadoEm: Date | null;

  @Column({ type: 'timestamp', name: 'encerrado_em', nullable: true })
  encerradoEm: Date | null;

  /** Motivo da consulta / observações */
  @Column({ type: 'text', nullable: true })
  observacoes: string | null;

  /** Arquivos compartilhados durante a sessão (JSON array de {nome, url, tipo, tamanho}) */
  @Column({ type: 'text', name: 'arquivos_json', nullable: true, default: '[]' })
  arquivosJson: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
