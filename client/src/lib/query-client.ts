import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Do not retry on 401, 403, 404, or 400 errors
        if ([400, 401, 403, 404].includes(error.response?.status)) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 1000 * 30, // 30 seconds
    },
  },
});
