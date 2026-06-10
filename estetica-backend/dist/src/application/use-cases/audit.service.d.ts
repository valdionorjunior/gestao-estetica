import { Repository } from 'typeorm';
import { AuditLog } from '../../domain/entities/audit-log.entity';
export interface AuditLogData {
    userId?: string | null;
    action: string;
    entity: string;
    entityId?: string | null;
    oldValue?: unknown;
    newValue?: unknown;
    ipAddress?: string | null;
    userAgent?: string | null;
}
export declare class AuditService {
    private readonly repo;
    constructor(repo: Repository<AuditLog>);
    log(data: AuditLogData): Promise<void>;
    findByEntity(entity: string, entityId: string): Promise<AuditLog[]>;
    findByUser(userId: string, limit?: number): Promise<AuditLog[]>;
    exportUserData(userId: string): Promise<AuditLog[]>;
}
