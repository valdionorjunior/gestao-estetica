import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './user-role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'clinica_id', nullable: true })
  clinicaId: string | null;

  @Index({ unique: true })
  @Column({ length: 200 })
  email: string;

  @Column({ name: 'senha_hash', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nome: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.RECEPCIONISTA,
  })
  role: UserRole;

  @Column({ default: true })
  ativo: boolean;

  @Column({ type: 'text', name: 'refresh_token_hash', nullable: true })
  refreshTokenHash: string | null;

  @Column({ type: 'timestamp', name: 'ultimo_login', nullable: true })
  ultimoLogin: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
