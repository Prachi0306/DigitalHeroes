import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface JobFilterParams {
  page?: number;
  limit?: number;
  status?: string;
  department?: string;
  search?: string;
}

export function useJobsApi() {
  const queryClient = useQueryClient();

  // Fetch jobs with filters
  const useGetJobs = (filters: JobFilterParams = {}) => {
    return useQuery({
      queryKey: ['jobs', filters],
      queryFn: async () => {
        const response = await apiClient.get('/jobs', { params: filters });
        return response.data;
      },
    });
  };

  // Fetch single job
  const useGetJob = (id: string) => {
    return useQuery({
      queryKey: ['job', id],
      queryFn: async () => {
        const response = await apiClient.get(`/jobs/${id}`);
        return response.data;
      },
      enabled: !!id,
    });
  };

  // Create job opening
  const createJobMutation = useMutation({
    mutationFn: async (jobData: Record<string, any>) => {
      const response = await apiClient.post('/jobs', jobData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  // Update job opening
  const updateJobMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, any> }) => {
      const response = await apiClient.patch(`/jobs/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', variables.id] });
    },
  });

  // Delete job opening
  const deleteJobMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/jobs/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  return {
    getJobs: useGetJobs,
    getJob: useGetJob,
    createJob: createJobMutation,
    updateJob: updateJobMutation,
    deleteJob: deleteJobMutation,
  };
}
