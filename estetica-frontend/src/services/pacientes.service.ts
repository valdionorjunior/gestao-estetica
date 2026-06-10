import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/auth.store';

export interface Paciente {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  cpfMasked?: string;
  dataNascimento?: string;
  ativo: boolean;
}

export interface CreatePacienteDto {
  nome: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
}

function token() {
  return useAuthStore.getState().accessToken ?? '';
}

export const pacientesService = {
  list(params: { search?: string; page?: number; limit?: number } = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v != null && qs.set(k, String(v)));
    return apiFetch<{ data: Paciente[]; total: number }>(`/pacientes?${qs}`, { token: token() });
  },

  findOne(id: string) {
    return apiFetch<Paciente>(`/pacientes/${id}`, { token: token() });
  },

  create(dto: CreatePacienteDto) {
    return apiFetch<Paciente>('/pacientes', { method: 'POST', body: JSON.stringify(dto), token: token() });
  },

  update(id: string, dto: Partial<CreatePacienteDto>) {
    return apiFetch<Paciente>(`/pacientes/${id}`, { method: 'PATCH', body: JSON.stringify(dto), token: token() });
  },

  remove(id: string) {
    return apiFetch<void>(`/pacientes/${id}`, { method: 'DELETE', token: token() });
  },
};
