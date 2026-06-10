import { apiFetch } from '../lib/api';

export interface ResultadoTranscricao {
  transcricao: string;
  simulado: boolean;
  logId: string;
}

export interface ResultadoResumo {
  resumo: string;
  topicos: string[];
  proximasAcoes: string[];
  simulado: boolean;
  logId: string;
}

export interface HipoteseItem {
  condicao: string;
  probabilidade: 'ALTA' | 'MEDIA' | 'BAIXA';
  descricao: string;
}

export interface ResultadoHipotese {
  hipoteses: HipoteseItem[];
  procedimentosSugeridos: string[];
  observacoesClinicas: string;
  simulado: boolean;
  logId: string;
}

export interface IaStatusConfig {
  openAiConfigurado: boolean;
  modelo: string;
}

export interface IaLog {
  id: string;
  operacao: string;
  status: string;
  pacienteId: string | null;
  resultado: string | null;
  tokensUtilizados: number | null;
  modeloIa: string | null;
  createdAt: string;
}

export const iaService = {
  async statusConfig(): Promise<IaStatusConfig> {
    return apiFetch<IaStatusConfig>('/ia/status');
  },

  async transcreverAudio(params: {
    audioFile: File;
    pacienteId?: string;
    prontuarioId?: string;
  }): Promise<ResultadoTranscricao> {
    const token = (() => {
      try {
        const s = localStorage.getItem('auth-storage');
        return s ? (JSON.parse(s) as { state?: { accessToken?: string } }).state?.accessToken : null;
      } catch { return null; }
    })();

    const formData = new FormData();
    formData.append('audio', params.audioFile);
    if (params.pacienteId) formData.append('pacienteId', params.pacienteId);
    if (params.prontuarioId) formData.append('prontuarioId', params.prontuarioId);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';
    const resp = await fetch(`${apiUrl}/ia/transcrever`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(err || 'Erro ao transcrever áudio');
    }
    return resp.json() as Promise<ResultadoTranscricao>;
  },

  async resumir(params: {
    texto: string;
    pacienteId?: string;
    prontuarioId?: string;
  }): Promise<ResultadoResumo> {
    return apiFetch<ResultadoResumo>('/ia/resumir', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async hipotese(params: {
    queixas: string;
    historicoRelevante?: string;
    pacienteId?: string;
    prontuarioId?: string;
  }): Promise<ResultadoHipotese> {
    return apiFetch<ResultadoHipotese>('/ia/hipotese', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async logs(params?: { pacienteId?: string; page?: number }): Promise<{ data: IaLog[]; total: number }> {
    const qs = new URLSearchParams();
    if (params?.pacienteId) qs.set('pacienteId', params.pacienteId);
    if (params?.page) qs.set('page', String(params.page));
    const q = qs.toString() ? `?${qs.toString()}` : '';
    return apiFetch<{ data: IaLog[]; total: number }>(`/ia/logs${q}`);
  },
};
