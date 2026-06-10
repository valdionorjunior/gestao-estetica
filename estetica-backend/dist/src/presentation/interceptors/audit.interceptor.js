"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const audit_service_1 = require("../../application/use-cases/audit.service");
let AuditInterceptor = class AuditInterceptor {
    auditService;
    constructor(auditService) {
        this.auditService = auditService;
    }
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const method = req.method.toUpperCase();
        const WRITE_METHODS = ['POST', 'PATCH', 'PUT', 'DELETE'];
        if (!WRITE_METHODS.includes(method)) {
            return next.handle();
        }
        const user = req.user;
        const userId = user?.id ?? user?.sub ?? null;
        const ipAddress = this.extractIp(req);
        const userAgent = req.headers['user-agent'] ?? null;
        const urlParts = req.url.replace('/api/v1/', '').split('?')[0].split('/');
        const entity = urlParts[0] ?? 'unknown';
        const entityId = this.extractEntityId(urlParts);
        const action = this.buildAction(method, urlParts);
        return next.handle().pipe((0, operators_1.tap)(() => {
            this.auditService.log({
                userId,
                action,
                entity,
                entityId,
                newValue: method !== 'DELETE' ? req.body : null,
                ipAddress,
                userAgent,
            });
        }));
    }
    extractIp(req) {
        const forwarded = req.headers['x-forwarded-for'];
        if (typeof forwarded === 'string')
            return forwarded.split(',')[0].trim();
        return req.socket?.remoteAddress ?? null;
    }
    extractEntityId(parts) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return parts.find((p) => uuidRegex.test(p)) ?? null;
    }
    buildAction(method, parts) {
        const entity = parts[0];
        const hasId = parts.length > 1;
        const subAction = parts[parts.length - 1];
        const map = {
            POST: hasId ? `${entity}:${subAction}` : `${entity}:criar`,
            PATCH: hasId ? `${entity}:atualizar` : `${entity}:editar`,
            PUT: `${entity}:substituir`,
            DELETE: `${entity}:remover`,
        };
        return map[method] ?? `${entity}:${method.toLowerCase()}`;
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map