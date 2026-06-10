import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/auth.store';

export interface Agendamento {
  id: string;
  pacienteId: string;
  paciente?: { nome: string; cpfMasked?: string };
  procedimento?: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: string;
  observacoes?: string;
  valor?: number;
}

export interface CreateAgendamentoDto {
  pacienteId: string;
  procedimento?: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  observacoes?: string;
  valor?: number;
}

export interface ListAgendamentosDto {
  dataInicio?: string;
  dataFim?: string;
  status?: string;
  page?: number;
  limit?: number;
}

function token() {
  return useAuthStore.getState().accessToken ?? '';
}

export const agendaService = {
  list(params: ListAgendamentosDto = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v != null && qs.set(k, String(v)));
    return apiFetch<{ data: Agendamento[]; total: number }>(`/agenda?${qs}`, { token: token() });
  },

  create(dto: CreateAgendamentoDto) {
    return apiFetch<Agendamento>('/agenda', { method: 'POST', body: JSON.stringify(dto), token: token() });
  },

  updateStatus(id: string, status: string, motivoCancelamento?: string) {
    return apiFetch<Agendamento>(
      `/agenda/${id}/status`,
      { method: 'PATCH', body: JSON.stringify({ status, motivoCancelamento }), token: token() },
    );
  },

  remove(id: string) {
    return apiFetch<void>(`/agenda/${id}`, { method: 'DELETE', token: token() });
  },
};
