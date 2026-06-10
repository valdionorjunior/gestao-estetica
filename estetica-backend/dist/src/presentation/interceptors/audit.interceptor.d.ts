import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuditService } from '../../application/use-cases/audit.service';
export declare class AuditInterceptor implements NestInterceptor {
    private readonly auditService;
    constructor(auditService: AuditService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
    private extractIp;
    private extractEntityId;
    private buildAction;
}
