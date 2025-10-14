import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';

// Types
interface Litter {
  id: string;
  title: string;
  description?: string;
  breeder_id: string;
  expected_date?: string;
  status: 'available' | 'pending' | 'sold';
  price?: number;
  images?: string[];
  created_at: string;
  updated_at: string;
}

// Query to get all litters
export const useLitters = (filters?: { status?: string; breeder_id?: string }) => {
  return useQuery({
    queryKey: queryKeys.litters.list(filters),
    queryFn: async (): Promise<Litter[]> => {
      let query = supabase.from('litters').select('*');

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.breeder_id) {
        query = query.eq('breeder_id', filters.breeder_id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
};

// Query to get litter by ID
export const useLitter = (id: string) => {
  return useQuery({
    queryKey: queryKeys.litters.detail(id),
    queryFn: async (): Promise<Litter | null> => {
      const { data, error } = await supabase
        .from('litters')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

// Query to get litters by breeder
export const useLittersByBreeder = (breederId: string) => {
  return useQuery({
    queryKey: queryKeys.litters.byBreeder(breederId),
    queryFn: async (): Promise<Litter[]> => {
      const { data, error } = await supabase
        .from('litters')
        .select('*')
        .eq('breeder_id', breederId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!breederId,
  });
};

// Mutation to create a new litter
export const useCreateLitter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (litterData: Omit<Litter, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('litters')
        .insert(litterData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.litters.all() });
    },
  });
};

// Mutation to update a litter
export const useUpdateLitter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Litter> }) => {
      const { data, error } = await supabase
        .from('litters')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.litters.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.litters.all() });
    },
  });
};
