export declare enum VideoTipo {
    DEMO = "DEMO",
    EDUCATIVO = "EDUCATIVO",
    RESULTADO = "RESULTADO",
    TECNICA = "TECNICA"
}
export declare enum VideoCategoria {
    TOXINA_BOTULINICA = "TOXINA_BOTULINICA",
    PREENCHIMENTO = "PREENCHIMENTO",
    BIOESTIMULADORES = "BIOESTIMULADORES",
    LASER = "LASER",
    PEELING = "PEELING",
    FIOS = "FIOS",
    CORPORAL = "CORPORAL",
    SKINCARE = "SKINCARE",
    OUTROS = "OUTROS"
}
export declare class VideoClinico {
    id: string;
    titulo: string;
    descricao: string | null;
    videoUrl: string;
    thumbnailUrl: string | null;
    categoria: VideoCategoria;
    tipo: VideoTipo;
    procedimentoNome: string | null;
    duracaoSegundos: number | null;
    tags: string | null;
    ativo: boolean;
    visivelPaciente: boolean;
    totalVisualizacoes: number;
    createdAt: Date;
    updatedAt: Date;
}
