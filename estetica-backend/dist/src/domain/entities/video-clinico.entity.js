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
exports.VideoClinico = exports.VideoCategoria = exports.VideoTipo = void 0;
const typeorm_1 = require("typeorm");
var VideoTipo;
(function (VideoTipo) {
    VideoTipo["DEMO"] = "DEMO";
    VideoTipo["EDUCATIVO"] = "EDUCATIVO";
    VideoTipo["RESULTADO"] = "RESULTADO";
    VideoTipo["TECNICA"] = "TECNICA";
})(VideoTipo || (exports.VideoTipo = VideoTipo = {}));
var VideoCategoria;
(function (VideoCategoria) {
    VideoCategoria["TOXINA_BOTULINICA"] = "TOXINA_BOTULINICA";
    VideoCategoria["PREENCHIMENTO"] = "PREENCHIMENTO";
    VideoCategoria["BIOESTIMULADORES"] = "BIOESTIMULADORES";
    VideoCategoria["LASER"] = "LASER";
    VideoCategoria["PEELING"] = "PEELING";
    VideoCategoria["FIOS"] = "FIOS";
    VideoCategoria["CORPORAL"] = "CORPORAL";
    VideoCategoria["SKINCARE"] = "SKINCARE";
    VideoCategoria["OUTROS"] = "OUTROS";
})(VideoCategoria || (exports.VideoCategoria = VideoCategoria = {}));
let VideoClinico = class VideoClinico {
    id;
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
    totalVisualizacoes;
    createdAt;
    updatedAt;
};
exports.VideoClinico = VideoClinico;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], VideoClinico.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], VideoClinico.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], VideoClinico.prototype, "descricao", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'video_url' }),
    __metadata("design:type", String)
], VideoClinico.prototype, "videoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'thumbnail_url', nullable: true }),
    __metadata("design:type", Object)
], VideoClinico.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: VideoCategoria,
        default: VideoCategoria.OUTROS,
    }),
    __metadata("design:type", String)
], VideoClinico.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: VideoTipo,
        default: VideoTipo.DEMO,
        name: 'tipo',
    }),
    __metadata("design:type", String)
], VideoClinico.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150, name: 'procedimento_nome', nullable: true }),
    __metadata("design:type", Object)
], VideoClinico.prototype, "procedimentoNome", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, name: 'duracao_segundos' }),
    __metadata("design:type", Object)
], VideoClinico.prototype, "duracaoSegundos", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], VideoClinico.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true, name: 'ativo' }),
    __metadata("design:type", Boolean)
], VideoClinico.prototype, "ativo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'visivel_paciente' }),
    __metadata("design:type", Boolean)
], VideoClinico.prototype, "visivelPaciente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'total_visualizacoes' }),
    __metadata("design:type", Number)
], VideoClinico.prototype, "totalVisualizacoes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], VideoClinico.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], VideoClinico.prototype, "updatedAt", void 0);
exports.VideoClinico = VideoClinico = __decorate([
    (0, typeorm_1.Entity)('videos_clinicos')
], VideoClinico);
//# sourceMappingURL=video-clinico.entity.js.map