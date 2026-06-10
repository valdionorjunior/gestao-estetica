import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('produtos')
export class Produto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'clinica_id', nullable: true })
  clinicaId: string | null;

  @Column({ type: 'uuid', name: 'categoria_id', nullable: true })
  categoriaId: string | null;

  @Column({ length: 200 })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string | null;

  @Column({ length: 20, default: 'UN' })
  unidade: string;

  @Column({ name: 'estoque_atual', type: 'decimal', precision: 12, scale: 3, default: 0 })
  estoqueAtual: number;

  @Column({ name: 'estoque_minimo', type: 'decimal', precision: 12, scale: 3, default: 0 })
  estoqueMinimo: number;

  @Column({ name: 'preco_custo', type: 'decimal', precision: 12, scale: 2, nullable: true })
  precoCusto: number | null;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
