import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';

export function useAuthApi() {
  const router = useRouter();
  const { setAuth, clearAuth } = useAuthStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: Record<string, string>) => {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (response) => {
      if (response.success) {
        const { user, accessToken } = response.data;
        setAuth(user, accessToken);
        router.push('/dashboard');
      }
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: Record<string, string>) => {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    },
    onSuccess: (response) => {
      if (response.success) {
        const { user, accessToken } = response.data;
        setAuth(user, accessToken);
        router.push('/dashboard');
      }
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    },
    onSuccess: () => {
      clearAuth();
      router.push('/login');
    },
    onError: () => {
      // Still logout locally if server fails
      clearAuth();
      router.push('/login');
    },
  });

  // Forgot Password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await apiClient.post('/auth/forgot-password', data);
      return response.data;
    },
  });

  // Reset Password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ token, password }: Record<string, string>) => {
      const response = await apiClient.post(`/auth/reset-password/${token}`, { password });
      return response.data;
    },
    onSuccess: () => {
      router.push('/login');
    },
  });

  return {
    login: loginMutation,
    register: registerMutation,
    logout: logoutMutation,
    forgotPassword: forgotPasswordMutation,
    resetPassword: resetPasswordMutation,
  };
}
