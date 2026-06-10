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
exports.VideosClinicoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const user_role_enum_1 = require("../../domain/entities/user-role.enum");
const videos_clinico_service_1 = require("../../application/use-cases/videos-clinico.service");
const video_clinico_dto_1 = require("../../application/dtos/videos/video-clinico.dto");
const video_clinico_entity_1 = require("../../domain/entities/video-clinico.entity");
let VideosClinicoController = class VideosClinicoController {
    service;
    constructor(service) {
        this.service = service;
    }
    async listar(page, limit, busca, categoria, tipo, visivelPaciente) {
        return this.service.listar({
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 12,
            busca,
            categoria,
            tipo,
            apenasVisivelPaciente: visivelPaciente === 'true',
        });
    }
    async estatisticas() {
        return this.service.estatisticas();
    }
    async buscarPorId(id) {
        const video = await this.service.buscarPorId(id);
        this.service.registrarVisualizacao(id);
        return video;
    }
    async criar(dto) {
        return this.service.criar(dto);
    }
    async atualizar(id, dto) {
        return this.service.atualizar(id, dto);
    }
    async remover(id) {
        await this.service.remover(id);
    }
};
exports.VideosClinicoController = VideosClinicoController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO, user_role_enum_1.UserRole.RECEPCIONISTA, user_role_enum_1.UserRole.PACIENTE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar vídeos da biblioteca com filtros' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'busca', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'categoria', required: false, enum: video_clinico_entity_1.VideoCategoria }),
    (0, swagger_1.ApiQuery)({ name: 'tipo', required: false, enum: video_clinico_entity_1.VideoTipo }),
    (0, swagger_1.ApiQuery)({ name: 'visivelPaciente', required: false, type: Boolean }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('busca')),
    __param(3, (0, common_1.Query)('categoria')),
    __param(4, (0, common_1.Query)('tipo')),
    __param(5, (0, common_1.Query)('visivelPaciente')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], VideosClinicoController.prototype, "listar", null);
__decorate([
    (0, common_1.Get)('estatisticas'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO),
    (0, swagger_1.ApiOperation)({ summary: 'Estatísticas de visualizações por categoria' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VideosClinicoController.prototype, "estatisticas", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO, user_role_enum_1.UserRole.RECEPCIONISTA, user_role_enum_1.UserRole.PACIENTE),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar vídeo por ID e registrar visualização' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideosClinicoController.prototype, "buscarPorId", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Adicionar vídeo à biblioteca (ADMIN)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Vídeo criado com sucesso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [video_clinico_dto_1.CreateVideoClinicoDto]),
    __metadata("design:returntype", Promise)
], VideosClinicoController.prototype, "criar", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar dados do vídeo (ADMIN)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, video_clinico_dto_1.UpdateVideoClinicoDto]),
    __metadata("design:returntype", Promise)
], VideosClinicoController.prototype, "atualizar", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Desativar vídeo da biblioteca (ADMIN)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideosClinicoController.prototype, "remover", null);
exports.VideosClinicoController = VideosClinicoController = __decorate([
    (0, swagger_1.ApiTags)('Vídeos Interativos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('videos'),
    __metadata("design:paramtypes", [videos_clinico_service_1.VideosClinicoService])
], VideosClinicoController);
//# sourceMappingURL=videos-clinico.controller.js.map