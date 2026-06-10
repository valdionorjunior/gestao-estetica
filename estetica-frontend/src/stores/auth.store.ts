'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthUser } from '../services/auth.service';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) => {
        // Signal middleware that user is authenticated via a session cookie
        document.cookie = 'ns-auth-active=1; path=/; SameSite=Strict';
        set({ user, accessToken, refreshToken });
      },
      clearAuth: () => {
        // Remove middleware cookie and redirect to login
        document.cookie = 'ns-auth-active=; path=/; max-age=0';
        set({ user: null, accessToken: null, refreshToken: null });
        if (typeof window !== 'undefined') window.location.href = '/login';
      },
      isAuthenticated: () => !!get().accessToken && !!get().user,
    }),
    {
      name: 'ns-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
