import { create } from 'zustand';
import { AuthState } from '@/types/auth.types';
import { setAccessTokenInMemory } from '@/lib/api-client';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  setAuth: (user, token) => {
    setAccessTokenInMemory(token);
    set({
      user,
      accessToken: token,
      isAuthenticated: true,
    });
  },
  clearAuth: () => {
    setAccessTokenInMemory('');
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },
}));
