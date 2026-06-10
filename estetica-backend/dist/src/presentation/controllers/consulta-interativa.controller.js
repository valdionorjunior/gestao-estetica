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
exports.ConsultaInterativaController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const crypto_1 = require("crypto");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const user_role_enum_1 = require("../../domain/entities/user-role.enum");
const consulta_interativa_service_1 = require("../../application/use-cases/consulta-interativa.service");
const consulta_foto_dto_1 = require("../../application/dtos/consulta/consulta-foto.dto");
const consulta_foto_entity_1 = require("../../domain/entities/consulta-foto.entity");
let ConsultaInterativaController = class ConsultaInterativaController {
    service;
    constructor(service) {
        this.service = service;
    }
    async uploadFoto(arquivo, dto, req) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        return this.service.criarFoto(dto, arquivo, baseUrl);
    }
    async listarPorPaciente(pacienteId, tipo) {
        return this.service.listarPorPaciente(pacienteId, tipo);
    }
    async buscarPorId(id) {
        return this.service.buscarPorId(id);
    }
    async salvarAnotacoes(id, dto) {
        return this.service.salvarAnotacoes(id, dto.anotacoes);
    }
    async remover(id) {
        await this.service.remover(id);
    }
};
exports.ConsultaInterativaController = ConsultaInterativaController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('foto', {
        storage: (0, multer_1.diskStorage)({
            destination: (0, path_1.join)(process.cwd(), 'uploads'),
            filename: (_req, file, cb) => {
                const nomeUnico = `consulta_${(0, crypto_1.randomUUID)()}${(0, path_1.extname)(file.originalname)}`;
                cb(null, nomeUnico);
            },
        }),
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (_req, file, cb) => {
            const permitidos = /image\/(jpeg|png|webp)/;
            if (permitidos.test(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new Error('Apenas imagens JPG, PNG e WebP são permitidas'), false);
            }
        },
    })),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                foto: { type: 'string', format: 'binary', description: 'Imagem (JPG/PNG/WebP, max 10 MB)' },
                pacienteId: { type: 'string', format: 'uuid' },
                tipo: { type: 'string', enum: Object.values(consulta_foto_entity_1.TipoFotoConsulta) },
                descricao: { type: 'string' },
                dataConsulta: { type: 'string', example: '2026-04-17' },
            },
            required: ['foto', 'pacienteId', 'tipo'],
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Fazer upload de foto de consulta (antes/depois)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Foto salva com sucesso' }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, consulta_foto_dto_1.CreateConsultaFotoDto, Object]),
    __metadata("design:returntype", Promise)
], ConsultaInterativaController.prototype, "uploadFoto", null);
__decorate([
    (0, common_1.Get)('paciente/:pacienteId'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, swagger_1.ApiOperation)({ summary: 'Listar fotos de consulta de um paciente' }),
    (0, swagger_1.ApiQuery)({ name: 'tipo', required: false, enum: consulta_foto_entity_1.TipoFotoConsulta }),
    __param(0, (0, common_1.Param)('pacienteId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('tipo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ConsultaInterativaController.prototype, "listarPorPaciente", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar foto de consulta por ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsultaInterativaController.prototype, "buscarPorId", null);
__decorate([
    (0, common_1.Patch)(':id/anotacoes'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, swagger_1.ApiOperation)({ summary: 'Salvar marcações/anotações em uma foto de consulta' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Anotações salvas com sucesso' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, consulta_foto_dto_1.UpdateAnotacoesDto]),
    __metadata("design:returntype", Promise)
], ConsultaInterativaController.prototype, "salvarAnotacoes", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remover foto de consulta e arquivo físico' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Foto removida com sucesso' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsultaInterativaController.prototype, "remover", null);
exports.ConsultaInterativaController = ConsultaInterativaController = __decorate([
    (0, swagger_1.ApiTags)('Consulta Interativa'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('consulta-interativa'),
    __metadata("design:paramtypes", [consulta_interativa_service_1.ConsultaInterativaService])
], ConsultaInterativaController);
//# sourceMappingURL=consulta-interativa.controller.js.map