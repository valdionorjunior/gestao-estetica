import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum IaOperacao {
  TRANSCRICAO_AUDIO = 'TRANSCRICAO_AUDIO',
  RESUMO_CONSULTA = 'RESUMO_CONSULTA',
  HIPOTESE_DIAGNOSTICA = 'HIPOTESE_DIAGNOSTICA',
}

export enum IaStatus {
  SUCESSO = 'SUCESSO',
  FALHOU = 'FALHOU',
  SIMULADO = 'SIMULADO',
}

/**
 * Log de todas as operações de IA no prontuário eletrônico.
 * Permite rastrear transcrições, resumos e hipóteses diagnósticas.
 */
@Entity('ia_consulta_logs')
export class IaConsultaLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: IaOperacao, name: 'operacao' })
  operacao: IaOperacao;

  @Column({ type: 'enum', enum: IaStatus, name: 'status' })
  status: IaStatus;

  /** ID do paciente (quando aplicável) */
  @Column({ type: 'uuid', name: 'paciente_id', nullable: true })
  pacienteId: string | null;

  /** ID do prontuário (quando aplicável) */
  @Column({ type: 'uuid', name: 'prontuario_id', nullable: true })
  prontuarioId: string | null;

  /** ID do profissional que executou a operação */
  @Column({ type: 'uuid', name: 'profissional_id', nullable: true })
  profissionalId: string | null;

  /** Entrada: texto ou nome do arquivo de áudio */
  @Column({ type: 'text', name: 'entrada', nullable: true })
  entrada: string | null;

  /** Resultado gerado pela IA */
  @Column({ type: 'text', name: 'resultado', nullable: true })
  resultado: string | null;

  /** Tokens consumidos (custo) */
  @Column({ type: 'int', name: 'tokens_utilizados', nullable: true, default: 0 })
  tokensUtilizados: number | null;

  /** Modelo utilizado (ex: gpt-4o-mini, whisper-1) */
  @Column({ type: 'varchar', length: 100, name: 'modelo_ia', nullable: true })
  modeloIa: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
