import { Repository } from 'typeorm';
import { VideoCategoria, VideoClinico, VideoTipo } from '../../domain/entities/video-clinico.entity';
import { CreateVideoClinicoDto, UpdateVideoClinicoDto, VideoClinicoResponseDto } from '../dtos/videos/video-clinico.dto';
export declare class VideosClinicoService {
    private readonly repo;
    constructor(repo: Repository<VideoClinico>);
    listar(params: {
        page?: number;
        limit?: number;
        busca?: string;
        categoria?: VideoCategoria;
        tipo?: VideoTipo;
        apenasVisivelPaciente?: boolean;
    }): Promise<{
        data: VideoClinicoResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    buscarPorId(id: string): Promise<VideoClinicoResponseDto>;
    registrarVisualizacao(id: string): void;
    criar(dto: CreateVideoClinicoDto): Promise<VideoClinicoResponseDto>;
    atualizar(id: string, dto: UpdateVideoClinicoDto): Promise<VideoClinicoResponseDto>;
    remover(id: string): Promise<void>;
    estatisticas(): Promise<{
        categoria: string;
        total: number;
        visualizacoes: number;
    }[]>;
    private toResponse;
}
