import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';

// Types
interface Application {
  id: string;
  litter_id: string;
  seeker_id: string;
  breeder_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  message?: string;
  created_at: string;
  updated_at: string;
}

// Query to get applications for a specific litter
export const useApplicationsByLitter = (litterId: string) => {
  return useQuery({
    queryKey: queryKeys.applications.byLitter(litterId),
    queryFn: async (): Promise<Application[]> => {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('litter_id', litterId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!litterId,
  });
};

// Query to get applications by user (seeker)
export const useApplicationsByUser = (userId?: string) => {
  return useQuery({
    queryKey: queryKeys.applications.byUser(userId),
    queryFn: async (): Promise<Application[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('seeker_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
};

// Mutation to create a new application
export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicationData: {
      litter_id: string;
      message?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Get litter to find breeder_id
      const { data: litter, error: litterError } = await supabase
        .from('litters')
        .select('breeder_id')
        .eq('id', applicationData.litter_id)
        .single();

      if (litterError) throw litterError;

      const { data, error } = await supabase
        .from('applications')
        .insert({
          litter_id: applicationData.litter_id,
          seeker_id: user.id,
          breeder_id: litter.breeder_id,
          message: applicationData.message,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.byLitter(data.litter_id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.byUser() });
    },
  });
};

// Mutation to update application status
export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status
    }: {
      id: string;
      status: 'approved' | 'rejected';
    }) => {
      const { data, error } = await supabase
        .from('applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.byLitter(data.litter_id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.byUser() });
    },
  });
};
