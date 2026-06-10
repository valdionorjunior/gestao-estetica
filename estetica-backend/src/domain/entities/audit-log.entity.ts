import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Tabela de auditoria para rastrear operações críticas do sistema.
 * Conforme LGPD: Art. 37 — registro de operações de tratamento de dados.
 */
@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id', nullable: true })
  userId: string | null;

  @Column({ type: 'varchar', length: 100 })
  action: string;

  @Column({ type: 'varchar', length: 100 })
  entity: string;

  @Column({ type: 'uuid', name: 'entity_id', nullable: true })
  entityId: string | null;

  @Column({ type: 'text', name: 'old_value', nullable: true })
  oldValue: string | null;

  @Column({ type: 'text', name: 'new_value', nullable: true })
  newValue: string | null;

  @Column({ type: 'varchar', length: 45, name: 'ip_address', nullable: true })
  ipAddress: string | null;

  @Column({ type: 'text', name: 'user_agent', nullable: true })
  userAgent: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
