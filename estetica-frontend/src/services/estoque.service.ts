import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/auth.store';

export interface Produto {
  id: string;
  nome: string;
  unidade: string;
  estoqueAtual: number;
  estoqueMinimo: number;
  preco?: number;
  ativo: boolean;
}

export interface Movimentacao {
  id: string;
  produtoId: string;
  tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE';
  quantidade: number;
  estoqueAnterior: number;
  estoquePosterior: number;
  observacoes?: string;
  createdAt: string;
}

export interface CreateProdutoDto {
  nome: string;
  unidade: string;
  estoqueMinimo: number;
  preco?: number;
}

function token() {
  return useAuthStore.getState().accessToken ?? '';
}

export const estoqueService = {
  alertas() {
    return apiFetch<Produto[]>('/estoque/alertas', { token: token() });
  },

  listProdutos(params: { search?: string; abaixoMinimo?: boolean; page?: number; limit?: number } = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v != null && qs.set(k, String(v)));
    return apiFetch<{ data: Produto[]; total: number }>(`/estoque/produtos?${qs}`, { token: token() });
  },

  create(dto: CreateProdutoDto) {
    return apiFetch<Produto>('/estoque/produtos', { method: 'POST', body: JSON.stringify(dto), token: token() });
  },

  movimentar(produtoId: string, tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE', quantidade: number, observacoes?: string) {
    return apiFetch<Movimentacao>(
      `/estoque/produtos/${produtoId}/movimentar`,
      { method: 'POST', body: JSON.stringify({ tipo, quantidade, observacoes }), token: token() },
    );
  },
};
