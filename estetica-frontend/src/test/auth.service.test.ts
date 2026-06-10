import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch globalmente
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Mock process.env
vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:3000/api/v1');

import { authService } from '../services/auth.service';

const mockAuthResponse = {
  accessToken: 'access-jwt-token',
  refreshToken: 'refresh-jwt-token',
  user: {
    id: 'uuid-1',
    email: 'admin@estetica.com',
    nome: 'Admin',
    role: 'ADMIN' as const,
    clinicaId: null,
  },
};

describe('authService', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('login', () => {
    it('chama o endpoint correto com credenciais', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockAuthResponse,
      });

      const result = await authService.login({
        email: 'admin@estetica.com',
        password: 'Admin123!',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({ method: 'POST' }),
      );
      expect(result.accessToken).toBe('access-jwt-token');
      expect(result.user.role).toBe('ADMIN');
    });

    it('lança erro com mensagem do servidor em caso de falha', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Credenciais inválidas' }),
      });

      await expect(
        authService.login({ email: 'wrong@email.com', password: 'WrongPass!' }),
      ).rejects.toThrow('Credenciais inválidas');
    });

    it('lança erro genérico quando resposta não tem mensagem', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      await expect(
        authService.login({ email: 'admin@estetica.com', password: 'Admin123!' }),
      ).rejects.toThrow('Erro 500');
    });
  });

  describe('refresh', () => {
    it('chama endpoint de refresh com token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockAuthResponse,
      });

      const result = await authService.refresh('old-refresh-token');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/refresh'),
        expect.objectContaining({ method: 'POST' }),
      );
      expect(result.accessToken).toBe('access-jwt-token');
    });
  });

  describe('logout', () => {
    it('chama endpoint de logout com token de autorização', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => undefined,
      });

      await authService.logout('access-jwt-token');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/logout'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer access-jwt-token',
          }),
        }),
      );
    });
  });
});
