'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { apiClient } from '@/lib/api-client';

interface AuthContextType {
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({ isLoading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await apiClient.get('/auth/me');
        if (response.data?.success) {
          const { user, accessToken } = response.data.data;
          setAuth(user, accessToken);
        }
      } catch (error) {
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [setAuth, clearAuth]);

  return (
    <AuthContext.Provider value={{ isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
