import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/auth.store';

export interface ContaFinanceira {
  id: string;
  descricao: string;
  tipo: 'RECEITA' | 'DESPESA';
  status: 'PENDENTE' | 'PAGO' | 'CANCELADO';
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  formaPagamento?: string;
}

export interface CreateContaDto {
  descricao: string;
  tipo: 'RECEITA' | 'DESPESA';
  valor: number;
  dataVencimento: string;
  formaPagamento?: string;
}

export interface DashboardFinanceiro {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  contasPendentes: number;
}

function token() {
  return useAuthStore.getState().accessToken ?? '';
}

export const financeiroService = {
  dashboard() {
    return apiFetch<DashboardFinanceiro>('/financeiro/dashboard', { token: token() });
  },

  list(params: { tipo?: string; status?: string; page?: number; limit?: number } = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v != null && qs.set(k, String(v)));
    return apiFetch<{ data: ContaFinanceira[]; total: number }>(`/financeiro/contas?${qs}`, { token: token() });
  },

  create(dto: CreateContaDto) {
    return apiFetch<ContaFinanceira>('/financeiro/contas', { method: 'POST', body: JSON.stringify(dto), token: token() });
  },

  markAsPaid(id: string, dataPagamento?: string) {
    return apiFetch<ContaFinanceira>(
      `/financeiro/contas/${id}/pagar`,
      { method: 'PATCH', body: JSON.stringify({ dataPagamento }), token: token() },
    );
  },

  cancel(id: string) {
    return apiFetch<ContaFinanceira>(`/financeiro/contas/${id}/cancelar`, { method: 'PATCH', token: token() });
  },
};
