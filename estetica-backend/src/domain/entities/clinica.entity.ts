import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clinicas')
export class Clinica {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  nome: string;

  @Column({ type: 'varchar', length: 14, nullable: true })
  cnpj: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  endereco: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  email: string;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
