import { VideosClinicoService } from '../../application/use-cases/videos-clinico.service';
import { CreateVideoClinicoDto, UpdateVideoClinicoDto } from '../../application/dtos/videos/video-clinico.dto';
import { VideoCategoria, VideoTipo } from '../../domain/entities/video-clinico.entity';
export declare class VideosClinicoController {
    private readonly service;
    constructor(service: VideosClinicoService);
    listar(page?: string, limit?: string, busca?: string, categoria?: VideoCategoria, tipo?: VideoTipo, visivelPaciente?: string): Promise<{
        data: import("../../application/dtos/videos/video-clinico.dto").VideoClinicoResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    estatisticas(): Promise<{
        categoria: string;
        total: number;
        visualizacoes: number;
    }[]>;
    buscarPorId(id: string): Promise<import("../../application/dtos/videos/video-clinico.dto").VideoClinicoResponseDto>;
    criar(dto: CreateVideoClinicoDto): Promise<import("../../application/dtos/videos/video-clinico.dto").VideoClinicoResponseDto>;
    atualizar(id: string, dto: UpdateVideoClinicoDto): Promise<import("../../application/dtos/videos/video-clinico.dto").VideoClinicoResponseDto>;
    remover(id: string): Promise<void>;
}
