import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repo: Repository<AuditLog>,
  ) {}

  async log(data: AuditLogData): Promise<void> {
    const entry = this.repo.create({
      userId: data.userId ?? null,
      action: data.action,
      entity: data.entity,
      entityId: data.entityId ?? null,
      oldValue: data.oldValue ? JSON.stringify(data.oldValue) : null,
      newValue: data.newValue ? JSON.stringify(data.newValue) : null,
      ipAddress: data.ipAddress ?? null,
      userAgent: data.userAgent ?? null,
    });
    // Fire-and-forget: não bloqueia a requisição
    this.repo.save(entry).catch(() => {
      // Auditoria nunca deve derrubar a operação principal
    });
  }

  async findByEntity(entity: string, entityId: string): Promise<AuditLog[]> {
    return this.repo.find({
      where: { entity, entityId },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async findByUser(userId: string, limit = 50): Promise<AuditLog[]> {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async exportUserData(userId: string): Promise<AuditLog[]> {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
