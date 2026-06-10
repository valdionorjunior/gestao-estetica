import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/auth.store';

export type CanalTipo = 'EMAIL' | 'SMS' | 'WHATSAPP';
export type ComunicacaoStatus = 'PENDENTE' | 'ENVIADO' | 'FALHOU' | 'SIMULADO';
export type ComunicacaoMotivo =
  | 'LEMBRETE_AGENDAMENTO'
  | 'CONFIRMACAO_AGENDAMENTO'
  | 'CANCELAMENTO_AGENDAMENTO'
  | 'CAMPANHA_MARKETING'
  | 'ANIVERSARIO'
  | 'POS_ATENDIMENTO'
  | 'MANUAL';

export interface ComunicacaoLog {
  id: string;
  pacienteId: string;
  agendamentoId?: string;
  tipo: CanalTipo;
  motivo: ComunicacaoMotivo;
  status: ComunicacaoStatus;
  destinatario: string;
  assunto: string;
  mensagem: string;
  enviadoEm?: string;
  createdAt: string;
}

export interface MarketingEstatisticas {
  totalEnviados: number;
  totalSimulados: number;
  totalFalhas: number;
  porTipo: Record<CanalTipo, number>;
}

function token() {
  return useAuthStore.getState().accessToken ?? '';
}

export const marketingService = {
  enviar(dto: {
    pacienteId: string;
    tipo: CanalTipo;
    motivo: ComunicacaoMotivo;
    mensagem: string;
    assunto?: string;
    agendamentoId?: string;
  }) {
    return apiFetch<ComunicacaoLog>('/marketing/enviar', {
      method: 'POST',
      body: JSON.stringify(dto),
      token: token(),
    });
  },

  campanha(dto: {
    pacienteIds: string[];
    tipo: CanalTipo;
    assunto: string;
    mensagem: string;
  }) {
    return apiFetch<{ enviados: number; simulados: number; falhas: number; total: number }>(
      '/marketing/campanha',
      { method: 'POST', body: JSON.stringify(dto), token: token() },
    );
  },

  historico(params: {
    page?: number;
    limit?: number;
    tipo?: CanalTipo;
    status?: ComunicacaoStatus;
    pacienteId?: string;
  } = {}) {
    const qs = new URLSearchParams();
    if (params.page) qs.set('page', String(params.page));
    if (params.limit) qs.set('limit', String(params.limit));
    if (params.tipo) qs.set('tipo', params.tipo);
    if (params.status) qs.set('status', params.status);
    if (params.pacienteId) qs.set('pacienteId', params.pacienteId);
    return apiFetch<{ data: ComunicacaoLog[]; total: number }>(`/marketing/historico?${qs}`, {
      token: token(),
    });
  },

  estatisticas() {
    return apiFetch<MarketingEstatisticas>('/marketing/estatisticas', { token: token() });
  },
};
