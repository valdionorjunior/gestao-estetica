import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum VideoTipo {
  DEMO = 'DEMO',               // Demonstração de procedimento
  EDUCATIVO = 'EDUCATIVO',     // Conteúdo educativo para o paciente
  RESULTADO = 'RESULTADO',     // Resultado de tratamento real
  TECNICA = 'TECNICA',         // Técnica para profissionais
}

export enum VideoCategoria {
  TOXINA_BOTULINICA = 'TOXINA_BOTULINICA',
  PREENCHIMENTO = 'PREENCHIMENTO',
  BIOESTIMULADORES = 'BIOESTIMULADORES',
  LASER = 'LASER',
  PEELING = 'PEELING',
  FIOS = 'FIOS',
  CORPORAL = 'CORPORAL',
  SKINCARE = 'SKINCARE',
  OUTROS = 'OUTROS',
}

/**
 * Biblioteca de vídeos interativos de procedimentos estéticos.
 * Suporta URLs externas (YouTube/Vimeo) e uploads locais.
 */
@Entity('videos_clinicos')
export class VideoClinico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descricao: string | null;

  /** URL do vídeo — YouTube embed, Vimeo ou arquivo local /uploads/videos/ */
  @Column({ type: 'text', name: 'video_url' })
  videoUrl: string;

  /** URL da miniatura para exibição em cards */
  @Column({ type: 'text', name: 'thumbnail_url', nullable: true })
  thumbnailUrl: string | null;

  @Column({
    type: 'enum',
    enum: VideoCategoria,
    default: VideoCategoria.OUTROS,
  })
  categoria: VideoCategoria;

  @Column({
    type: 'enum',
    enum: VideoTipo,
    default: VideoTipo.DEMO,
    name: 'tipo',
  })
  tipo: VideoTipo;

  /** Procedimento relacionado (nome livre, não FK obrigatória) */
  @Column({ type: 'varchar', length: 150, name: 'procedimento_nome', nullable: true })
  procedimentoNome: string | null;

  /** Duração em segundos */
  @Column({ type: 'int', nullable: true, name: 'duracao_segundos' })
  duracaoSegundos: number | null;

  /** Tags separadas por vírgula para busca: "botox,testa,rugas" */
  @Column({ type: 'text', nullable: true })
  tags: string | null;

  @Column({ type: 'boolean', default: true, name: 'ativo' })
  ativo: boolean;

  /** Visível para pacientes no portal do cliente */
  @Column({ type: 'boolean', default: false, name: 'visivel_paciente' })
  visivelPaciente: boolean;

  @Column({ type: 'int', default: 0, name: 'total_visualizacoes' })
  totalVisualizacoes: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
