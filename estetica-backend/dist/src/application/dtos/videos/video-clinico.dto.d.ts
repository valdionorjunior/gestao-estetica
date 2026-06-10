import { VideoCategoria, VideoTipo } from '../../../domain/entities/video-clinico.entity';
export declare class CreateVideoClinicoDto {
    titulo: string;
    descricao?: string;
    videoUrl: string;
    thumbnailUrl?: string;
    categoria: VideoCategoria;
    tipo: VideoTipo;
    procedimentoNome?: string;
    duracaoSegundos?: number;
    tags?: string;
    visivelPaciente?: boolean;
}
export declare class UpdateVideoClinicoDto {
    titulo?: string;
    descricao?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    categoria?: VideoCategoria;
    tipo?: VideoTipo;
    procedimentoNome?: string;
    duracaoSegundos?: number;
    tags?: string;
    ativo?: boolean;
    visivelPaciente?: boolean;
}
export declare class VideoClinicoResponseDto {
    id: string;
    titulo: string;
    descricao: string | null;
    videoUrl: string;
    thumbnailUrl: string | null;
    categoria: VideoCategoria;
    tipo: VideoTipo;
    procedimentoNome: string | null;
    duracaoSegundos: number | null;
    duracaoFormatada: string | null;
    tags: string[];
    ativo: boolean;
    visivelPaciente: boolean;
    totalVisualizacoes: number;
    createdAt: Date;
}
