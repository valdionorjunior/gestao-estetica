import { apiFetch } from '../lib/api';
import type { PlataformaIntegracao } from './integracoes.types';

export type { PlataformaIntegracao };

export type IntegracaoStatus = 'SUCESSO' | 'FALHOU' | 'SIMULADO';
export type IntegracaoAcao =
  | 'SINCRONIZAR_CONTATO'
  | 'REGISTRAR_EVENTO'
  | 'WEBHOOK_RECEBIDO'
  | 'WEBHOOK_LEAD';

export interface IntegracaoLog {
  id: string;
  plataforma: PlataformaIntegracao;
  acao: IntegracaoAcao;
  status: IntegracaoStatus;
  pacienteId: string | null;
  idExterno: string | null;
  resposta: string | null;
  createdAt: string;
}

export interface EstatisticasIntegracao {
  plataforma: string;
  sucesso: number;
  falha: number;
  simulado: number;
  ultimaSincronizacao: string | null;
}

export interface StatusConfig {
  rdStation: boolean;
  leadlovers: boolean;
}

export const integracoesService = {
  async statusConfig(): Promise<StatusConfig> {
    return apiFetch<StatusConfig>('/integracoes/status');
  },

  async estatisticas(): Promise<EstatisticasIntegracao[]> {
    return apiFetch<EstatisticasIntegracao[]>('/integracoes/estatisticas');
  },

  async logs(params?: { plataforma?: string; page?: number }): Promise<{ data: IntegracaoLog[]; total: number }> {
    const qs = new URLSearchParams();
    if (params?.plataforma) qs.set('plataforma', params.plataforma);
    if (params?.page) qs.set('page', String(params.page));
    const q = qs.toString() ? `?${qs.toString()}` : '';
    return apiFetch<{ data: IntegracaoLog[]; total: number }>(`/integracoes/logs${q}`);
  },

  async sincronizarContato(data: {
    pacienteId: string;
    nome: string;
    email?: string;
    telefone?: string;
    plataforma?: string;
  }): Promise<{ resultados: { plataforma: string; status: string; id: string }[] }> {
    return apiFetch('/integracoes/sincronizar-contato', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async registrarEvento(data: {
    tipo: string;
    email?: string;
    valor?: number;
    dados?: Record<string, unknown>;
  }): Promise<{ status: string; id: string }> {
    return apiFetch('/integracoes/evento-rd-station', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
