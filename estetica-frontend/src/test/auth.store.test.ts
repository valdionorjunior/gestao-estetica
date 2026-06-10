import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock sessionStorage before importing the store
const mockStorage: Record<string, string> = {};
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: (key: string) => mockStorage[key] ?? null,
    setItem: (key: string, value: string) => { mockStorage[key] = value; },
    removeItem: (key: string) => { delete mockStorage[key]; },
    clear: () => Object.keys(mockStorage).forEach(k => delete mockStorage[k]),
  },
  writable: true,
});

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
});

// Mock window.location
const mockLocation = { href: '' };
Object.defineProperty(window, 'location', { value: mockLocation, writable: true });

import { useAuthStore } from '../stores/auth.store';
import type { AuthUser } from '../services/auth.service';

const mockUser: AuthUser = {
  id: 'uuid-1',
  email: 'admin@estetica.com',
  nome: 'Admin Teste',
  role: 'ADMIN',
  clinicaId: null,
};

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
    });
    mockLocation.href = '';
  });

  describe('estado inicial', () => {
    it('começa sem usuário autenticado', () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
    });

    it('isAuthenticated() retorna false quando não autenticado', () => {
      expect(useAuthStore.getState().isAuthenticated()).toBe(false);
    });
  });

  describe('setAuth', () => {
    it('armazena usuário e tokens corretamente', () => {
      useAuthStore.getState().setAuth(mockUser, 'access-token-123', 'refresh-token-456');
      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.accessToken).toBe('access-token-123');
      expect(state.refreshToken).toBe('refresh-token-456');
    });

    it('isAuthenticated() retorna true após setAuth', () => {
      useAuthStore.getState().setAuth(mockUser, 'access-token', 'refresh-token');
      expect(useAuthStore.getState().isAuthenticated()).toBe(true);
    });

    it('armazena role do usuário corretamente', () => {
      useAuthStore.getState().setAuth(mockUser, 'token', 'refresh');
      expect(useAuthStore.getState().user?.role).toBe('ADMIN');
    });
  });

  describe('clearAuth', () => {
    it('limpa estado após logout', () => {
      useAuthStore.getState().setAuth(mockUser, 'token', 'refresh');
      useAuthStore.getState().clearAuth();
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
    });

    it('isAuthenticated() retorna false após clearAuth', () => {
      useAuthStore.getState().setAuth(mockUser, 'token', 'refresh');
      useAuthStore.getState().clearAuth();
      expect(useAuthStore.getState().isAuthenticated()).toBe(false);
    });
  });
});
