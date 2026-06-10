import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/auth.store';

export type UserRole = 'ADMIN' | 'MEDICO' | 'RECEPCIONISTA' | 'PACIENTE';

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  ativo: boolean;
  clinicaId?: string | null;
  createdAt: string;
  ultimoLogin?: string | null;
}

export interface CreateUsuarioDto {
  email: string;
  password: string;
  nome: string;
  role: UserRole;
  clinicaId?: string;
}

export interface UpdateUsuarioDto {
  nome?: string;
  role?: UserRole;
  ativo?: boolean;
}

function token() {
  return useAuthStore.getState().accessToken ?? '';
}

export const usuariosService = {
  list(params: { page?: number; limit?: number; busca?: string } = {}) {
    const qs = new URLSearchParams();
    if (params.page) qs.set('page', String(params.page));
    if (params.limit) qs.set('limit', String(params.limit));
    if (params.busca) qs.set('busca', params.busca);
    return apiFetch<{ data: Usuario[]; total: number; page: number; limit: number }>(
      `/usuarios?${qs}`,
      { token: token() },
    );
  },

  create(dto: CreateUsuarioDto) {
    return apiFetch<Usuario>('/usuarios', {
      method: 'POST',
      body: JSON.stringify(dto),
      token: token(),
    });
  },

  update(id: string, dto: UpdateUsuarioDto) {
    return apiFetch<Usuario>(`/usuarios/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
      token: token(),
    });
  },

  deactivate(id: string) {
    return apiFetch<void>(`/usuarios/${id}`, {
      method: 'DELETE',
      token: token(),
    });
  },
};
