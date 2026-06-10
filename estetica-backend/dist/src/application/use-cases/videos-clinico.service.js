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
exports.VideosClinicoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const video_clinico_entity_1 = require("../../domain/entities/video-clinico.entity");
let VideosClinicoService = class VideosClinicoService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async listar(params) {
        const page = Math.max(1, params.page ?? 1);
        const limit = Math.min(50, Math.max(1, params.limit ?? 12));
        const skip = (page - 1) * limit;
        const qb = this.repo
            .createQueryBuilder('v')
            .where('v.ativo = TRUE')
            .orderBy('v.createdAt', 'DESC')
            .skip(skip)
            .take(limit);
        if (params.busca) {
            qb.andWhere('(v.titulo ILIKE :busca OR v.descricao ILIKE :busca OR v.tags ILIKE :busca OR v.procedimentoNome ILIKE :busca)', { busca: `%${params.busca}%` });
        }
        if (params.categoria) {
            qb.andWhere('v.categoria = :categoria', { categoria: params.categoria });
        }
        if (params.tipo) {
            qb.andWhere('v.tipo = :tipo', { tipo: params.tipo });
        }
        if (params.apenasVisivelPaciente) {
            qb.andWhere('v.visivelPaciente = TRUE');
        }
        const [videos, total] = await qb.getManyAndCount();
        return {
            data: videos.map((v) => this.toResponse(v)),
            total,
            page,
            limit,
        };
    }
    async buscarPorId(id) {
        const video = await this.repo.findOne({ where: { id, ativo: true } });
        if (!video)
            throw new common_1.NotFoundException('Vídeo não encontrado');
        return this.toResponse(video);
    }
    registrarVisualizacao(id) {
        this.repo
            .increment({ id }, 'totalVisualizacoes', 1)
            .catch(() => { });
    }
    async criar(dto) {
        const video = this.repo.create({
            titulo: dto.titulo,
            descricao: dto.descricao ?? null,
            videoUrl: dto.videoUrl,
            thumbnailUrl: dto.thumbnailUrl ?? null,
            categoria: dto.categoria,
            tipo: dto.tipo,
            procedimentoNome: dto.procedimentoNome ?? null,
            duracaoSegundos: dto.duracaoSegundos ?? null,
            tags: dto.tags ?? null,
            visivelPaciente: dto.visivelPaciente ?? false,
        });
        const salvo = await this.repo.save(video);
        return this.toResponse(salvo);
    }
    async atualizar(id, dto) {
        const video = await this.repo.findOne({ where: { id } });
        if (!video)
            throw new common_1.NotFoundException('Vídeo não encontrado');
        Object.assign(video, {
            ...(dto.titulo !== undefined && { titulo: dto.titulo }),
            ...(dto.descricao !== undefined && { descricao: dto.descricao }),
            ...(dto.videoUrl !== undefined && { videoUrl: dto.videoUrl }),
            ...(dto.thumbnailUrl !== undefined && { thumbnailUrl: dto.thumbnailUrl }),
            ...(dto.categoria !== undefined && { categoria: dto.categoria }),
            ...(dto.tipo !== undefined && { tipo: dto.tipo }),
            ...(dto.procedimentoNome !== undefined && { procedimentoNome: dto.procedimentoNome }),
            ...(dto.duracaoSegundos !== undefined && { duracaoSegundos: dto.duracaoSegundos }),
            ...(dto.tags !== undefined && { tags: dto.tags }),
            ...(dto.ativo !== undefined && { ativo: dto.ativo }),
            ...(dto.visivelPaciente !== undefined && { visivelPaciente: dto.visivelPaciente }),
        });
        const atualizado = await this.repo.save(video);
        return this.toResponse(atualizado);
    }
    async remover(id) {
        const video = await this.repo.findOne({ where: { id } });
        if (!video)
            throw new common_1.NotFoundException('Vídeo não encontrado');
        video.ativo = false;
        await this.repo.save(video);
    }
    async estatisticas() {
        const rows = await this.repo
            .createQueryBuilder('v')
            .select('v.categoria', 'categoria')
            .addSelect('COUNT(*)', 'total')
            .addSelect('SUM(v.totalVisualizacoes)', 'visualizacoes')
            .where('v.ativo = TRUE')
            .groupBy('v.categoria')
            .orderBy('visualizacoes', 'DESC')
            .getRawMany();
        return rows.map((r) => ({
            categoria: r.categoria,
            total: Number(r.total),
            visualizacoes: Number(r.visualizacoes ?? 0),
        }));
    }
    toResponse(v) {
        const tags = v.tags
            ? v.tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
            : [];
        let duracaoFormatada = null;
        if (v.duracaoSegundos) {
            const min = Math.floor(v.duracaoSegundos / 60);
            const sec = v.duracaoSegundos % 60;
            duracaoFormatada = `${min}:${String(sec).padStart(2, '0')}`;
        }
        return {
            id: v.id,
            titulo: v.titulo,
            descricao: v.descricao,
            videoUrl: v.videoUrl,
            thumbnailUrl: v.thumbnailUrl,
            categoria: v.categoria,
            tipo: v.tipo,
            procedimentoNome: v.procedimentoNome,
            duracaoSegundos: v.duracaoSegundos,
            duracaoFormatada,
            tags,
            ativo: v.ativo,
            visivelPaciente: v.visivelPaciente,
            totalVisualizacoes: v.totalVisualizacoes,
            createdAt: v.createdAt,
        };
    }
};
exports.VideosClinicoService = VideosClinicoService;
exports.VideosClinicoService = VideosClinicoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(video_clinico_entity_1.VideoClinico)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VideosClinicoService);
//# sourceMappingURL=videos-clinico.service.js.map