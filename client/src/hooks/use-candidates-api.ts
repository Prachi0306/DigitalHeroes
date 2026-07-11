import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface CandidateFilterParams {
  page?: number;
  limit?: number;
  jobId?: string;
  stage?: string;
  status?: string;
  search?: string;
}

export function useCandidatesApi() {
  const queryClient = useQueryClient();

  // Fetch candidates
  const useGetCandidates = (filters: CandidateFilterParams = {}) => {
    return useQuery({
      queryKey: ['candidates', filters],
      queryFn: async () => {
        const response = await apiClient.get('/candidates', { params: filters });
        return response.data;
      },
    });
  };

  // Fetch single candidate
  const useGetCandidate = (id: string) => {
    return useQuery({
      queryKey: ['candidate', id],
      queryFn: async () => {
        const response = await apiClient.get(`/candidates/${id}`);
        return response.data;
      },
      enabled: !!id,
    });
  };

  // Create candidate
  const createCandidateMutation = useMutation({
    mutationFn: async (candidateData: Record<string, any>) => {
      const response = await apiClient.post('/candidates', candidateData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });

  // Update candidate details
  const updateCandidateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, any> }) => {
      const response = await apiClient.patch(`/candidates/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      queryClient.invalidateQueries({ queryKey: ['candidate', variables.id] });
    },
  });

  // Update candidate stage (Kanban moves)
  const updateCandidateStageMutation = useMutation({
    mutationFn: async ({ id, stage, note }: { id: string; stage: string; note?: string }) => {
      const response = await apiClient.patch(`/candidates/${id}/stage`, { stage, note });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      queryClient.invalidateQueries({ queryKey: ['candidate', variables.id] });
    },
  });

  // Delete candidate
  const deleteCandidateMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/candidates/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });

  return {
    getCandidates: useGetCandidates,
    getCandidate: useGetCandidate,
    createCandidate: createCandidateMutation,
    updateCandidate: updateCandidateMutation,
    updateCandidateStage: updateCandidateStageMutation,
    deleteCandidate: deleteCandidateMutation,
  };
}
