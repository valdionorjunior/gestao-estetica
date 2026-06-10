import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { AgendamentoStatus } from './agendamento-status.enum';
import { Paciente } from './paciente.entity';

@Entity('agendamentos')
export class Agendamento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'clinica_id', nullable: true })
  clinicaId: string | null;

  @Index()
  @Column({ type: 'uuid', name: 'paciente_id' })
  pacienteId: string;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @Column({ type: 'uuid', name: 'profissional_id' })
  profissionalId: string;

  @Column({ type: 'uuid', name: 'procedimento_id', nullable: true })
  procedimentoId: string | null;

  @Index()
  @Column({ name: 'data_hora_inicio', type: 'timestamptz' })
  dataHoraInicio: Date;

  @Column({ name: 'data_hora_fim', type: 'timestamptz' })
  dataHoraFim: Date;

  @Column({
    type: 'enum',
    enum: AgendamentoStatus,
    default: AgendamentoStatus.AGENDADO,
  })
  status: AgendamentoStatus;

  @Column({ type: 'text', nullable: true })
  observacoes: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  valor: number | null;

  @Column({ name: 'lembrete_enviado', default: false })
  lembreteEnviado: boolean;

  @Column({ name: 'confirmado_em', type: 'timestamptz', nullable: true })
  confirmadoEm: Date | null;

  @Column({ name: 'cancelado_em', type: 'timestamptz', nullable: true })
  canceladoEm: Date | null;

  @Column({ type: 'text', name: 'motivo_cancelamento', nullable: true })
  motivoCancelamento: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
