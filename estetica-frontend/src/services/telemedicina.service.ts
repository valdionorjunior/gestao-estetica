import { apiFetch } from '../lib/api';

export type SessaoStatus = 'AGENDADA' | 'EM_ANDAMENTO' | 'ENCERRADA' | 'CANCELADA';
export type PlataformaVideo = 'JITSI' | 'DAILY_CO';

export interface ArquivoSessao {
  nome: string;
  url: string;
  tipo: string;
  tamanho: number;
  uploadadoEm: string;
}

export interface SessaoTelemedicina {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  pacienteEmail: string | null;
  pacienteTelefone: string | null;
  profissionalId: string | null;
  profissionalNome: string;
  agendamentoId: string | null;
  status: SessaoStatus;
  plataforma: PlataformaVideo;
  roomName: string;
  roomUrl: string;
  agendadoPara: string | null;
  iniciadoEm: string | null;
  encerradoEm: string | null;
  observacoes: string | null;
  duracaoMinutos: number | null;
  arquivos: ArquivoSessao[];
  urlEntradaPaciente: string;
  urlEntradaProfissional: string;
  createdAt: string;
  updatedAt: string;
}

export interface TelemedStatusConfig {
  plataforma: PlataformaVideo;
  configurado: boolean;
  roomPrefix: string;
}

export interface TelemedEstatisticas {
  agendadas: number;
  emAndamento: number;
  encerradas: number;
  canceladas: number;
  totalHoje: number;
}

export const telemedService = {
  async statusConfig(): Promise<TelemedStatusConfig> {
    return apiFetch<TelemedStatusConfig>('/telemedicina/status');
  },

  async estatisticas(): Promise<TelemedEstatisticas> {
    return apiFetch<TelemedEstatisticas>('/telemedicina/estatisticas');
  },

  async listar(params?: {
    status?: SessaoStatus;
    pacienteId?: string;
    page?: number;
  }): Promise<{ data: SessaoTelemedicina[]; total: number }> {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.pacienteId) qs.set('pacienteId', params.pacienteId);
    if (params?.page) qs.set('page', String(params.page));
    const q = qs.toString() ? `?${qs.toString()}` : '';
    return apiFetch<{ data: SessaoTelemedicina[]; total: number }>(`/telemedicina/sessoes${q}`);
  },

  async buscar(id: string): Promise<SessaoTelemedicina> {
    return apiFetch<SessaoTelemedicina>(`/telemedicina/sessoes/${id}`);
  },

  async criar(data: {
    pacienteId: string;
    pacienteNome: string;
    pacienteEmail?: string;
    pacienteTelefone?: string;
    profissionalId?: string;
    profissionalNome: string;
    agendadoPara?: string;
    observacoes?: string;
  }): Promise<SessaoTelemedicina> {
    return apiFetch<SessaoTelemedicina>('/telemedicina/sessoes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async iniciar(id: string): Promise<SessaoTelemedicina> {
    return apiFetch<SessaoTelemedicina>(`/telemedicina/sessoes/${id}/iniciar`, { method: 'POST' });
  },

  async encerrar(id: string): Promise<SessaoTelemedicina> {
    return apiFetch<SessaoTelemedicina>(`/telemedicina/sessoes/${id}/encerrar`, { method: 'POST' });
  },

  async cancelar(id: string): Promise<SessaoTelemedicina> {
    return apiFetch<SessaoTelemedicina>(`/telemedicina/sessoes/${id}/cancelar`, { method: 'POST' });
  },

  async adicionarArquivo(
    id: string,
    arquivo: Omit<ArquivoSessao, 'uploadadoEm'>,
  ): Promise<SessaoTelemedicina> {
    return apiFetch<SessaoTelemedicina>(`/telemedicina/sessoes/${id}/arquivo`, {
      method: 'POST',
      body: JSON.stringify(arquivo),
    });
  },
};
