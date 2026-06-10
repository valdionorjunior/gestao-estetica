import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Paciente } from './paciente.entity';

@Entity('prontuarios')
export class Prontuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'clinica_id', nullable: true })
  clinicaId: string | null;

  @Column({ type: 'uuid', name: 'paciente_id', unique: true })
  pacienteId: string;

  @OneToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  /** Campos sensíveis criptografados AES-256-GCM pela aplicação */
  @Column({ type: 'text', name: 'historico_medico_encrypted', nullable: true })
  historicoMedicoEncrypted: string | null;

  @Column({ type: 'text', name: 'alergias_encrypted', nullable: true })
  alergiasEncrypted: string | null;

  @Column({ type: 'text', name: 'medicamentos_uso_encrypted', nullable: true })
  medicamentosUsoEncrypted: string | null;

  @Column({ type: 'text', nullable: true })
  observacoes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
