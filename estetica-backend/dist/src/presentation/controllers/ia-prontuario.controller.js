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
exports.IaProntuarioController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const crypto_1 = require("crypto");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const user_role_enum_1 = require("../../domain/entities/user-role.enum");
const ia_prontuario_service_1 = require("../../application/use-cases/ia-prontuario.service");
const ia_consulta_log_entity_1 = require("../../domain/entities/ia-consulta-log.entity");
class ResumoDto {
    texto;
    pacienteId;
    prontuarioId;
}
__decorate([
    (0, swagger_2.ApiProperty)({ description: 'Texto das notas da consulta a ser resumido' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10, { message: 'Texto muito curto para resumir (mínimo 10 caracteres)' }),
    (0, class_validator_1.MaxLength)(8000, { message: 'Texto muito longo (máximo 8000 caracteres)' }),
    __metadata("design:type", String)
], ResumoDto.prototype, "texto", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'pacienteId deve ser UUID válido' }),
    __metadata("design:type", String)
], ResumoDto.prototype, "pacienteId", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'prontuarioId deve ser UUID válido' }),
    __metadata("design:type", String)
], ResumoDto.prototype, "prontuarioId", void 0);
class HipoteseDto {
    queixas;
    historicoRelevante;
    pacienteId;
    prontuarioId;
}
__decorate([
    (0, swagger_2.ApiProperty)({ description: 'Queixas e sintomas relatados pelo paciente' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10, { message: 'Queixas muito curtas (mínimo 10 caracteres)' }),
    (0, class_validator_1.MaxLength)(4000, { message: 'Queixas muito longas (máximo 4000 caracteres)' }),
    __metadata("design:type", String)
], HipoteseDto.prototype, "queixas", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ description: 'Histórico médico relevante' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], HipoteseDto.prototype, "historicoRelevante", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], HipoteseDto.prototype, "pacienteId", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], HipoteseDto.prototype, "prontuarioId", void 0);
const AUDIO_EXT_PERMITIDAS = new Set(['.mp3', '.mp4', '.mpeg', '.mpga', '.m4a', '.wav', '.webm', '.ogg']);
let IaProntuarioController = class IaProntuarioController {
    service;
    constructor(service) {
        this.service = service;
    }
    statusConfig() {
        return this.service.statusConfig();
    }
    async transcrever(file, pacienteId, prontuarioId) {
        if (!file) {
            return { erro: 'Arquivo de áudio obrigatório' };
        }
        return this.service.transcreverAudio({
            audioPath: file.path,
            audioNome: file.originalname,
            pacienteId: pacienteId || undefined,
            prontuarioId: prontuarioId || undefined,
        });
    }
    async resumir(dto) {
        return this.service.resumirConsulta({
            texto: dto.texto,
            pacienteId: dto.pacienteId,
            prontuarioId: dto.prontuarioId,
        });
    }
    async hipotese(dto) {
        return this.service.sugerirHipotese({
            queixas: dto.queixas,
            historicoRelevante: dto.historicoRelevante,
            pacienteId: dto.pacienteId,
            prontuarioId: dto.prontuarioId,
        });
    }
    async logs(pacienteId, operacao, page) {
        return this.service.listarLogs({
            pacienteId,
            operacao,
            page: page ? Number(page) : 1,
        });
    }
};
exports.IaProntuarioController = IaProntuarioController;
__decorate([
    (0, common_1.Get)('status'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO),
    (0, swagger_1.ApiOperation)({ summary: 'Status da configuração da IA (OpenAI)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IaProntuarioController.prototype, "statusConfig", null);
__decorate([
    (0, common_1.Post)('transcrever'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Transcrever áudio da consulta (Whisper AI)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                audio: { type: 'string', format: 'binary', description: 'Arquivo de áudio (mp3, wav, m4a, webm — máx 25MB)' },
                pacienteId: { type: 'string', format: 'uuid' },
                prontuarioId: { type: 'string', format: 'uuid' },
            },
            required: ['audio'],
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('audio', {
        storage: (0, multer_1.diskStorage)({
            destination: (0, path_1.join)(process.cwd(), 'uploads', 'ia-audio'),
            filename: (_req, file, cb) => {
                const ext = (0, path_1.extname)(file.originalname).toLowerCase();
                cb(null, `${(0, crypto_1.randomUUID)()}${ext}`);
            },
        }),
        limits: { fileSize: 25 * 1024 * 1024 },
        fileFilter: (_req, file, cb) => {
            const ext = (0, path_1.extname)(file.originalname).toLowerCase();
            if (AUDIO_EXT_PERMITIDAS.has(ext)) {
                cb(null, true);
            }
            else {
                cb(new Error(`Formato não suportado: ${ext}. Use mp3, wav, m4a ou webm.`), false);
            }
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('pacienteId')),
    __param(2, (0, common_1.Body)('prontuarioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], IaProntuarioController.prototype, "transcrever", null);
__decorate([
    (0, common_1.Post)('resumir'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Gerar resumo estruturado das notas da consulta (GPT)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ResumoDto]),
    __metadata("design:returntype", Promise)
], IaProntuarioController.prototype, "resumir", null);
__decorate([
    (0, common_1.Post)('hipotese'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Sugerir hipóteses diagnósticas com base nas queixas (GPT)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [HipoteseDto]),
    __metadata("design:returntype", Promise)
], IaProntuarioController.prototype, "hipotese", null);
__decorate([
    (0, common_1.Get)('logs'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO),
    (0, swagger_1.ApiOperation)({ summary: 'Histórico de operações de IA' }),
    (0, swagger_1.ApiQuery)({ name: 'pacienteId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'operacao', required: false, enum: ia_consulta_log_entity_1.IaOperacao }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    __param(0, (0, common_1.Query)('pacienteId')),
    __param(1, (0, common_1.Query)('operacao')),
    __param(2, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], IaProntuarioController.prototype, "logs", null);
exports.IaProntuarioController = IaProntuarioController = __decorate([
    (0, swagger_1.ApiTags)('IA no Prontuário'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('ia'),
    __metadata("design:paramtypes", [ia_prontuario_service_1.IaProntuarioService])
], IaProntuarioController);
//# sourceMappingURL=ia-prontuario.controller.js.map