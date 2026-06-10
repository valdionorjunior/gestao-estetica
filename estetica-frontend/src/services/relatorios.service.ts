import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/auth.store';

export interface RelatorioAgendaItem {
  data: string;
  total: number;
  concluidos: number;
  cancelados: number;
}

export interface RelatorioFinanceiroItem {
  mes: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface RelatorioPacientesNovos {
  mes: string;
  total: number;
}

function token() {
  return useAuthStore.getState().accessToken ?? '';
}

export const relatoriosService = {
  agenda(params: { dataInicio?: string; dataFim?: string } = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v && qs.set(k, v));
    return apiFetch<RelatorioAgendaItem[]>(`/relatorios/agenda?${qs}`, { token: token() });
  },

  financeiro(params: { dataInicio?: string; dataFim?: string } = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v && qs.set(k, v));
    return apiFetch<RelatorioFinanceiroItem[]>(`/relatorios/financeiro?${qs}`, { token: token() });
  },

  pacientesNovos(params: { dataInicio?: string; dataFim?: string } = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v && qs.set(k, v));
    return apiFetch<RelatorioPacientesNovos[]>(`/relatorios/pacientes/novos?${qs}`, { token: token() });
  },
};
