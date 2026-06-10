import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TipoFotoConsulta {
  ANTES = 'ANTES',
  DEPOIS = 'DEPOIS',
  DURANTE = 'DURANTE',
  REFERENCIA = 'REFERENCIA',
}

/**
 * Registro de fotos e anotações da consulta interativa.
 * As anotações são salvas como JSON com coordenadas relativas (%).
 * Ex: [{ x: 45.2, y: 30.1, texto: "Aplicar bioestimulador", tipo: "circulo" }]
 */
@Entity('consulta_fotos')
export class ConsultaFoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'paciente_id' })
  pacienteId: string;

  @Column({ type: 'uuid', name: 'prontuario_id', nullable: true })
  prontuarioId: string | null;

  @Column({ type: 'uuid', name: 'profissional_id', nullable: true })
  profissionalId: string | null;

  @Column({
    type: 'enum',
    enum: TipoFotoConsulta,
    default: TipoFotoConsulta.ANTES,
    name: 'tipo',
  })
  tipo: TipoFotoConsulta;

  @Column({ type: 'text', name: 'foto_url' })
  fotoUrl: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  descricao: string | null;

  /**
   * JSON array de marcações:
   * [{ id, x, y, texto, forma, cor }]
   * x, y: posição relativa em % (0–100)
   */
  @Column({ type: 'text', name: 'anotacoes_json', nullable: true })
  anotacoesJson: string | null;

  @Column({ name: 'data_consulta', type: 'date', nullable: true })
  dataConsulta: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
