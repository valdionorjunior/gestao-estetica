import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('pacientes')
export class Paciente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'clinica_id', nullable: true })
  clinicaId: string | null;

  @Column({ length: 200 })
  nome: string;

  @Index()
  @Column({ type: 'text', name: 'cpf_encrypted', nullable: true })
  cpfEncrypted: string | null;

  @Column({ name: 'data_nascimento', type: 'date', nullable: true })
  dataNascimento: Date | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone: string | null;

  @Index()
  @Column({ type: 'varchar', length: 200, nullable: true })
  email: string | null;

  @Column({ type: 'text', nullable: true })
  endereco: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cidade: string | null;

  @Column({ type: 'varchar', name: 'estado', length: 2, nullable: true })
  estado: string | null;

  @Column({ type: 'varchar', name: 'cep', length: 9, nullable: true })
  cep: string | null;

  @Column({ type: 'text', name: 'foto_url', nullable: true })
  fotoUrl: string | null;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
