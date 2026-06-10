import { apiFetch } from '../lib/api';

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  nome: string;
  role: 'ADMIN' | 'MEDICO' | 'RECEPCIONISTA' | 'PACIENTE';
  clinicaId: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export const authService = {
  async login(dto: LoginDto): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  async logout(token: string): Promise<void> {
    return apiFetch<void>('/auth/logout', {
      method: 'POST',
      token,
    });
  },
};
