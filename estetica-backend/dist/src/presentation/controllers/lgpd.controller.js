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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LgpdController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const user_repository_1 = require("../../infrastructure/repositories/user.repository");
const audit_service_1 = require("../../application/use-cases/audit.service");
const user_entity_1 = require("../../domain/entities/user.entity");
const audit_log_entity_1 = require("../../domain/entities/audit-log.entity");
const paciente_entity_1 = require("../../domain/entities/paciente.entity");
class ConsentimentoDto {
    aceitaPoliticaPrivacidade;
    aceitaComunicacoes;
}
__decorate([
    (0, swagger_2.ApiProperty)({ description: 'Aceite da política de privacidade' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ConsentimentoDto.prototype, "aceitaPoliticaPrivacidade", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ description: 'Aceite de comunicações de marketing' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ConsentimentoDto.prototype, "aceitaComunicacoes", void 0);
class ExclusaoContaDto {
    confirmacao;
}
__decorate([
    (0, swagger_2.ApiProperty)({ description: 'Confirmação — deve conter a palavra CONFIRMAR' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExclusaoContaDto.prototype, "confirmacao", void 0);
let LgpdController = class LgpdController {
    userRepo;
    pacienteRepo;
    auditRepo;
    auditService;
    userRepository;
    constructor(userRepo, pacienteRepo, auditRepo, auditService, userRepository) {
        this.userRepo = userRepo;
        this.pacienteRepo = pacienteRepo;
        this.auditRepo = auditRepo;
        this.auditService = auditService;
        this.userRepository = userRepository;
    }
    async exportarMeusDados(user) {
        const [userRecord, auditLogs] = await Promise.all([
            this.userRepo.findOne({ where: { id: user.id } }),
            this.auditRepo.find({ where: { userId: user.id }, order: { createdAt: 'DESC' }, take: 200 }),
        ]);
        if (!userRecord)
            throw new common_1.NotFoundException('Usuário não encontrado');
        const { passwordHash, refreshTokenHash, ...userSafe } = userRecord;
        await this.auditService.log({
            userId: user.id,
            action: 'lgpd:exportar-dados',
            entity: 'users',
            entityId: user.id,
        });
        return {
            exportadoEm: new Date().toISOString(),
            titular: userSafe,
            historicDeAtividades: auditLogs.map((l) => ({
                acao: l.action,
                entidade: l.entity,
                data: l.createdAt,
                ip: l.ipAddress,
            })),
            aviso: 'Dados exportados conforme Art. 18, incisos II e V da LGPD (Lei 13.709/2018)',
        };
    }
    async portabilidade(user) {
        const userRecord = await this.userRepo.findOne({ where: { id: user.id } });
        if (!userRecord)
            throw new common_1.NotFoundException('Usuário não encontrado');
        const { passwordHash, refreshTokenHash, ...userSafe } = userRecord;
        await this.auditService.log({
            userId: user.id,
            action: 'lgpd:portabilidade',
            entity: 'users',
            entityId: user.id,
        });
        return {
            versao: '1.0',
            formato: 'JSON',
            exportadoEm: new Date().toISOString(),
            sistema: 'Estética Natalia Salvador',
            dadosTitular: userSafe,
        };
    }
    async excluirConta(user, dto) {
        if (dto.confirmacao !== 'CONFIRMAR') {
            throw new common_1.NotFoundException('Confirmação inválida. Envie o texto CONFIRMAR para excluir a conta.');
        }
        await this.userRepo.update(user.id, {
            email: `excluido_${user.id}@anonimizado.lgpd`,
            nome: 'Conta Excluída',
            ativo: false,
            refreshTokenHash: null,
        });
        await this.auditService.log({
            userId: user.id,
            action: 'lgpd:conta-anonimizada',
            entity: 'users',
            entityId: user.id,
            oldValue: { email: user.email },
            newValue: { status: 'anonimizado' },
        });
    }
    async registrarConsentimento(user, dto) {
        await this.auditService.log({
            userId: user.id,
            action: 'lgpd:consentimento',
            entity: 'users',
            entityId: user.id,
            newValue: {
                aceitaPoliticaPrivacidade: dto.aceitaPoliticaPrivacidade,
                aceitaComunicacoes: dto.aceitaComunicacoes ?? false,
                registradoEm: new Date().toISOString(),
            },
        });
    }
};
exports.LgpdController = LgpdController;
__decorate([
    (0, common_1.Get)('meus-dados'),
    (0, swagger_1.ApiOperation)({ summary: 'LGPD — Exportar todos os meus dados (Art. 18, II e V)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dados pessoais do titular exportados' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LgpdController.prototype, "exportarMeusDados", null);
__decorate([
    (0, common_1.Get)('portabilidade'),
    (0, swagger_1.ApiOperation)({ summary: 'LGPD — Portabilidade dos dados em formato estruturado (Art. 18, V)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dados exportados em JSON portável' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LgpdController.prototype, "portabilidade", null);
__decorate([
    (0, common_1.Delete)('minha-conta'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'LGPD — Solicitar exclusão da conta (Art. 18, VI)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Conta anonimizada com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Confirmação inválida — enviar CONFIRMAR' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ExclusaoContaDto]),
    __metadata("design:returntype", Promise)
], LgpdController.prototype, "excluirConta", null);
__decorate([
    (0, common_1.Post)('consentimento'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'LGPD — Registrar consentimento do titular (Art. 7 e 8)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Consentimento registrado' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ConsentimentoDto]),
    __metadata("design:returntype", Promise)
], LgpdController.prototype, "registrarConsentimento", null);
exports.LgpdController = LgpdController = __decorate([
    (0, swagger_1.ApiTags)('LGPD'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('lgpd'),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(paciente_entity_1.Paciente)),
    __param(2, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        audit_service_1.AuditService,
        user_repository_1.UserRepository])
], LgpdController);
//# sourceMappingURL=lgpd.controller.js.map