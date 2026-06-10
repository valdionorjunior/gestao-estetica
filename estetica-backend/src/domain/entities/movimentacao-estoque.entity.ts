import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MovimentacaoTipo } from './movimentacao-tipo.enum';
import { Produto } from './produto.entity';

@Entity('movimentacoes_estoque')
export class MovimentacaoEstoque {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'clinica_id', nullable: true })
  clinicaId: string | null;

  @Column({ type: 'uuid', name: 'produto_id' })
  produtoId: string;

  @ManyToOne(() => Produto)
  @JoinColumn({ name: 'produto_id' })
  produto: Produto;

  @Column({ type: 'enum', enum: MovimentacaoTipo })
  tipo: MovimentacaoTipo;

  @Column({ type: 'decimal', precision: 12, scale: 3 })
  quantidade: number;

  @Column({ name: 'estoque_anterior', type: 'decimal', precision: 12, scale: 3 })
  estoqueAnterior: number;

  @Column({ name: 'estoque_posterior', type: 'decimal', precision: 12, scale: 3 })
  estoquePosterior: number;

  @Column({ type: 'varchar', length: 300, nullable: true })
  motivo: string | null;

  @Column({ type: 'uuid', name: 'usuario_id', nullable: true })
  usuarioId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
