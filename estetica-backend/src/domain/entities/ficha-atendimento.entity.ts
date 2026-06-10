import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Prontuario } from './prontuario.entity';

export enum FichaStatus {
  ABERTA = 'ABERTA',
  FECHADA = 'FECHADA',
}

@Entity('fichas_atendimento')
export class FichaAtendimento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'prontuario_id' })
  prontuarioId: string;

  @ManyToOne(() => Prontuario)
  @JoinColumn({ name: 'prontuario_id' })
  prontuario: Prontuario;

  @Column({ type: 'uuid', name: 'agendamento_id', nullable: true })
  agendamentoId: string | null;

  @Column({ type: 'uuid', name: 'profissional_id' })
  profissionalId: string;

  @Column({ length: 200 })
  titulo: string;

  @Column({ type: 'text', name: 'conteudo_encrypted', nullable: true })
  conteudoEncrypted: string | null;

  @Column({
    type: 'enum',
    enum: FichaStatus,
    default: FichaStatus.ABERTA,
  })
  status: FichaStatus;

  @Column({ name: 'fechada_em', type: 'timestamptz', nullable: true })
  fechadaEm: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
