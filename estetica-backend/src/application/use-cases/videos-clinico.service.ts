import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import {
  VideoCategoria,
  VideoClinico,
  VideoTipo,
} from '../../domain/entities/video-clinico.entity';
import {
  CreateVideoClinicoDto,
  UpdateVideoClinicoDto,
  VideoClinicoResponseDto,
} from '../dtos/videos/video-clinico.dto';

@Injectable()
export class VideosClinicoService {
  constructor(
    @InjectRepository(VideoClinico)
    private readonly repo: Repository<VideoClinico>,
  ) {}

  // ─── Listar com filtros e busca ──────────────────────────────────────────────

  async listar(params: {
    page?: number;
    limit?: number;
    busca?: string;
    categoria?: VideoCategoria;
    tipo?: VideoTipo;
    apenasVisivelPaciente?: boolean;
  }): Promise<{ data: VideoClinicoResponseDto[]; total: number; page: number; limit: number }> {
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
      qb.andWhere(
        '(v.titulo ILIKE :busca OR v.descricao ILIKE :busca OR v.tags ILIKE :busca OR v.procedimentoNome ILIKE :busca)',
        { busca: `%${params.busca}%` },
      );
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

  // ─── Buscar por ID e registrar visualização ──────────────────────────────────

  async buscarPorId(id: string): Promise<VideoClinicoResponseDto> {
    const video = await this.repo.findOne({ where: { id, ativo: true } });
    if (!video) throw new NotFoundException('Vídeo não encontrado');
    return this.toResponse(video);
  }

  // ─── Registrar visualização (fire-and-forget) ─────────────────────────────

  registrarVisualizacao(id: string): void {
    this.repo
      .increment({ id }, 'totalVisualizacoes', 1)
      .catch(() => { /* silencioso */ });
  }

  // ─── Criar ──────────────────────────────────────────────────────────────────

  async criar(dto: CreateVideoClinicoDto): Promise<VideoClinicoResponseDto> {
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

  // ─── Atualizar ───────────────────────────────────────────────────────────────

  async atualizar(id: string, dto: UpdateVideoClinicoDto): Promise<VideoClinicoResponseDto> {
    const video = await this.repo.findOne({ where: { id } });
    if (!video) throw new NotFoundException('Vídeo não encontrado');

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

  // ─── Remover (soft delete via ativo=false) ────────────────────────────────

  async remover(id: string): Promise<void> {
    const video = await this.repo.findOne({ where: { id } });
    if (!video) throw new NotFoundException('Vídeo não encontrado');
    video.ativo = false;
    await this.repo.save(video);
  }

  // ─── Estatísticas por categoria ──────────────────────────────────────────────

  async estatisticas(): Promise<{ categoria: string; total: number; visualizacoes: number }[]> {
    const rows = await this.repo
      .createQueryBuilder('v')
      .select('v.categoria', 'categoria')
      .addSelect('COUNT(*)', 'total')
      .addSelect('SUM(v.totalVisualizacoes)', 'visualizacoes')
      .where('v.ativo = TRUE')
      .groupBy('v.categoria')
      .orderBy('visualizacoes', 'DESC')
      .getRawMany<{ categoria: string; total: string; visualizacoes: string }>();

    return rows.map((r) => ({
      categoria: r.categoria,
      total: Number(r.total),
      visualizacoes: Number(r.visualizacoes ?? 0),
    }));
  }

  // ─── Mapper ──────────────────────────────────────────────────────────────────

  private toResponse(v: VideoClinico): VideoClinicoResponseDto {
    const tags = v.tags
      ? v.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    let duracaoFormatada: string | null = null;
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
}
