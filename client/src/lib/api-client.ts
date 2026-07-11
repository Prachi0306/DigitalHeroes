import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach access token if stored in memory (auth-store)
let accessTokenMemory = '';

export const setAccessTokenInMemory = (token: string) => {
  accessTokenMemory = token;
};

apiClient.interceptors.request.use(
  (config) => {
    if (accessTokenMemory && config.headers) {
      config.headers.Authorization = `Bearer ${accessTokenMemory}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle token refresh on 401 error
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh tokens
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        const { accessToken } = response.data.data;
        setAccessTokenInMemory(accessToken);
        
        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear token memory and let calling hook handle logout
        setAccessTokenInMemory('');
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
