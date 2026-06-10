import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContaTipo, ContaStatus, FormaPagamento } from './financeiro.enums';

@Entity('contas_financeiras')
export class ContaFinanceira {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'clinica_id', nullable: true })
  clinicaId: string | null;

  @Column({ type: 'enum', enum: ContaTipo })
  tipo: ContaTipo;

  @Column({ length: 300 })
  descricao: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  valor: number;

  @Column({ name: 'data_vencimento', type: 'date' })
  dataVencimento: Date;

  @Column({ name: 'data_pagamento', type: 'date', nullable: true })
  dataPagamento: Date | null;

  @Column({ type: 'enum', enum: ContaStatus, default: ContaStatus.PENDENTE })
  status: ContaStatus;

  @Column({ name: 'forma_pagamento', type: 'enum', enum: FormaPagamento, nullable: true })
  formaPagamento: FormaPagamento | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  categoria: string | null;

  @Column({ type: 'uuid', name: 'paciente_id', nullable: true })
  pacienteId: string | null;

  @Column({ type: 'uuid', name: 'agendamento_id', nullable: true })
  agendamentoId: string | null;

  @Column({ type: 'text', nullable: true })
  observacoes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
