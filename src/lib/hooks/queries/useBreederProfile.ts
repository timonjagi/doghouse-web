import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';

// Types
interface BreederProfile {
  id: string;
  user_id: string;
  kennel_name?: string;
  kennel_location?: string;
  facility_type?: string;
  verification_docs?: any;
  verified_at?: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

interface Kennel {
  id: string;
  breeder_profile_id: string;
  name: string;
  location?: string;
  location_lat?: number;
  location_lng?: number;
  photos?: string[];
  created_at: string;
  updated_at: string;
}

interface CreateBreederProfileData {
  kennel_name?: string;
  kennel_location?: string;
  facility_type?: string;
  verification_docs?: any;
}

interface UpdateBreederProfileData {
  kennel_name?: string;
  kennel_location?: string;
  facility_type?: string;
  verification_docs?: any;
  rating?: number;
}

interface CreateKennelData {
  name: string;
  location?: string;
  location_lat?: number;
  location_lng?: number;
  photos?: string[];
}

// Query to get breeder's profile with kennels
export const useBreederProfile = (userId?: string) => {
  return useQuery({
    queryKey: ['users', 'breeder-profile', userId] as const,
    queryFn: async (): Promise<BreederProfile | null> => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('breeder_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data;
    },
    enabled: !!userId,
  });
};

// Query to get breeder's kennels
export const useBreederKennels = (breederProfileId?: string) => {
  return useQuery({
    queryKey: ['kennels', 'breeder', breederProfileId] as const,
    queryFn: async (): Promise<Kennel[]> => {
      if (!breederProfileId) return [];

      const { data, error } = await supabase
        .from('kennels')
        .select('*')
        .eq('breeder_profile_id', breederProfileId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!breederProfileId,
  });
};

// Mutation to create breeder profile
export const useCreateBreederProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBreederProfileData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data: result, error } = await supabase
        .from('breeder_profiles')
        .insert({
          user_id: user.id,
          ...data,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users', 'breeder-profile', data.user_id] as const });
    },
  });
};

// Mutation to update breeder profile
export const useUpdateBreederProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateBreederProfileData }) => {
      const { data, error } = await supabase
        .from('breeder_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users', 'breeder-profile', data.user_id] as const });
    },
  });
};

// Mutation to upsert breeder profile (create or update)
export const useUpsertBreederProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBreederProfileData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from('breeder_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingProfile) {
        // Update existing profile
        const { data: result, error } = await supabase
          .from('breeder_profiles')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingProfile.id)
          .select()
          .single();

        if (error) throw error;
        return result;
      } else {
        // Create new profile
        const { data: result, error } = await supabase
          .from('breeder_profiles')
          .insert({
            user_id: user.id,
            ...data,
          })
          .select()
          .single();

        if (error) throw error;
        return result;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users', 'breeder-profile', data.user_id] as const });
    },
  });
};

// Mutation to create kennel
export const useCreateKennel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ breederProfileId, kennelData }: { breederProfileId: string; kennelData: CreateKennelData }) => {
      const { data, error } = await supabase
        .from('kennels')
        .insert({
          breeder_profile_id: breederProfileId,
          ...kennelData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kennels', 'breeder', data.breeder_profile_id] as const });
    },
  });
};

// Mutation to update kennel
export const useUpdateKennel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CreateKennelData> }) => {
      const { data, error } = await supabase
        .from('kennels')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kennels', 'breeder', data.breeder_profile_id] as const });
    },
  });
};
