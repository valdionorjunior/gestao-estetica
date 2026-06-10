import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../../application/use-cases/audit.service';

/**
 * Registra automaticamente operações de escrita (POST, PATCH, DELETE, PUT)
 * na tabela audit_logs.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const method = req.method.toUpperCase();

    // Auditar apenas operações de escrita
    const WRITE_METHODS = ['POST', 'PATCH', 'PUT', 'DELETE'];
    if (!WRITE_METHODS.includes(method)) {
      return next.handle();
    }

    const user = (req as any).user as { id?: string; sub?: string } | undefined;
    const userId = user?.id ?? user?.sub ?? null;
    const ipAddress = this.extractIp(req);
    const userAgent = req.headers['user-agent'] ?? null;

    // Inferir entidade e ação a partir da URL
    const urlParts = req.url.replace('/api/v1/', '').split('?')[0].split('/');
    const entity = urlParts[0] ?? 'unknown';
    const entityId = this.extractEntityId(urlParts);
    const action = this.buildAction(method, urlParts);

    return next.handle().pipe(
      tap(() => {
        this.auditService.log({
          userId,
          action,
          entity,
          entityId,
          newValue: method !== 'DELETE' ? req.body : null,
          ipAddress,
          userAgent,
        });
      }),
    );
  }

  private extractIp(req: Request): string | null {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
    return req.socket?.remoteAddress ?? null;
  }

  private extractEntityId(parts: string[]): string | null {
    // Padrão UUID na URL
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return parts.find((p) => uuidRegex.test(p)) ?? null;
  }

  private buildAction(method: string, parts: string[]): string {
    const entity = parts[0];
    const hasId = parts.length > 1;
    const subAction = parts[parts.length - 1];

    const map: Record<string, string> = {
      POST: hasId ? `${entity}:${subAction}` : `${entity}:criar`,
      PATCH: hasId ? `${entity}:atualizar` : `${entity}:editar`,
      PUT: `${entity}:substituir`,
      DELETE: `${entity}:remover`,
    };

    return map[method] ?? `${entity}:${method.toLowerCase()}`;
  }
}
