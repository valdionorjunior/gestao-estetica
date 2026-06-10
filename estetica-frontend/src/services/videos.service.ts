import { apiFetch } from '../lib/api';

export type VideoTipo = 'DEMO' | 'EDUCATIVO' | 'RESULTADO' | 'TECNICA';
export type VideoCategoria =
  | 'TOXINA_BOTULINICA'
  | 'PREENCHIMENTO'
  | 'BIOESTIMULADORES'
  | 'LASER'
  | 'PEELING'
  | 'FIOS'
  | 'CORPORAL'
  | 'SKINCARE'
  | 'OUTROS';

export interface VideoClinico {
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
  createdAt: string;
}

export interface VideosResponse {
  data: VideoClinico[];
  total: number;
  page: number;
  limit: number;
}

export interface EstatisticasVideo {
  categoria: string;
  total: number;
  visualizacoes: number;
}

export const videosService = {
  async listar(params?: {
    page?: number;
    limit?: number;
    busca?: string;
    categoria?: VideoCategoria;
    tipo?: VideoTipo;
  }): Promise<VideosResponse> {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.busca) qs.set('busca', params.busca);
    if (params?.categoria) qs.set('categoria', params.categoria);
    if (params?.tipo) qs.set('tipo', params.tipo);
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return apiFetch<VideosResponse>(`/videos${query}`);
  },

  async buscarPorId(id: string): Promise<VideoClinico> {
    return apiFetch<VideoClinico>(`/videos/${id}`);
  },

  async estatisticas(): Promise<EstatisticasVideo[]> {
    return apiFetch<EstatisticasVideo[]>('/videos/estatisticas');
  },

  async criar(data: Partial<VideoClinico>): Promise<VideoClinico> {
    return apiFetch<VideoClinico>('/videos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async atualizar(id: string, data: Partial<VideoClinico>): Promise<VideoClinico> {
    return apiFetch<VideoClinico>(`/videos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async remover(id: string): Promise<void> {
    await apiFetch(`/videos/${id}`, { method: 'DELETE' });
  },
};
