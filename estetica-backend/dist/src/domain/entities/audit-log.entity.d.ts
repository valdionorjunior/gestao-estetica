export declare class AuditLog {
    id: string;
    userId: string | null;
    action: string;
    entity: string;
    entityId: string | null;
    oldValue: string | null;
    newValue: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
}
