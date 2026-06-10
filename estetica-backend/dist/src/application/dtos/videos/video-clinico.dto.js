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
exports.VideoClinicoResponseDto = exports.UpdateVideoClinicoDto = exports.CreateVideoClinicoDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const video_clinico_entity_1 = require("../../../domain/entities/video-clinico.entity");
class CreateVideoClinicoDto {
    titulo;
    descricao;
    videoUrl;
    thumbnailUrl;
    categoria;
    tipo;
    procedimentoNome;
    duracaoSegundos;
    tags;
    visivelPaciente;
}
exports.CreateVideoClinicoDto = CreateVideoClinicoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Título do vídeo', example: 'Botox — Técnica de Aplicação' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200, { message: 'Título máximo de 200 caracteres' }),
    __metadata("design:type", String)
], CreateVideoClinicoDto.prototype, "titulo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Descrição detalhada do conteúdo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVideoClinicoDto.prototype, "descricao", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL do vídeo (YouTube embed, Vimeo ou arquivo local)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateVideoClinicoDto.prototype, "videoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'URL da miniatura (thumbnail)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVideoClinicoDto.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: video_clinico_entity_1.VideoCategoria }),
    (0, class_validator_1.IsEnum)(video_clinico_entity_1.VideoCategoria, { message: 'Categoria inválida' }),
    __metadata("design:type", String)
], CreateVideoClinicoDto.prototype, "categoria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: video_clinico_entity_1.VideoTipo }),
    (0, class_validator_1.IsEnum)(video_clinico_entity_1.VideoTipo, { message: 'Tipo inválido' }),
    __metadata("design:type", String)
], CreateVideoClinicoDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nome do procedimento relacionado' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateVideoClinicoDto.prototype, "procedimentoNome", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Duração em segundos' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateVideoClinicoDto.prototype, "duracaoSegundos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tags para busca, separadas por vírgula' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVideoClinicoDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Visível para pacientes no portal', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateVideoClinicoDto.prototype, "visivelPaciente", void 0);
class UpdateVideoClinicoDto {
    titulo;
    descricao;
    videoUrl;
    thumbnailUrl;
    categoria;
    tipo;
    procedimentoNome;
    duracaoSegundos;
    tags;
    ativo;
    visivelPaciente;
}
exports.UpdateVideoClinicoDto = UpdateVideoClinicoDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateVideoClinicoDto.prototype, "titulo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVideoClinicoDto.prototype, "descricao", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVideoClinicoDto.prototype, "videoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVideoClinicoDto.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: video_clinico_entity_1.VideoCategoria }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(video_clinico_entity_1.VideoCategoria),
    __metadata("design:type", String)
], UpdateVideoClinicoDto.prototype, "categoria", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: video_clinico_entity_1.VideoTipo }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(video_clinico_entity_1.VideoTipo),
    __metadata("design:type", String)
], UpdateVideoClinicoDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], UpdateVideoClinicoDto.prototype, "procedimentoNome", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateVideoClinicoDto.prototype, "duracaoSegundos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVideoClinicoDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateVideoClinicoDto.prototype, "ativo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateVideoClinicoDto.prototype, "visivelPaciente", void 0);
class VideoClinicoResponseDto {
    id;
    titulo;
    descricao;
    videoUrl;
    thumbnailUrl;
    categoria;
    tipo;
    procedimentoNome;
    duracaoSegundos;
    duracaoFormatada;
    tags;
    ativo;
    visivelPaciente;
    totalVisualizacoes;
    createdAt;
}
exports.VideoClinicoResponseDto = VideoClinicoResponseDto;
//# sourceMappingURL=video-clinico.dto.js.map