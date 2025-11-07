import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';

// Types
interface SeekerProfile {
  id: string;
  user_id: string;
  living_situation?: string;
  experience_level?: string;
  has_allergies: boolean;
  has_children: boolean;
  has_other_pets: boolean;
  preferred_breed_id?: string;
  preferred_breed_name?: string;
  preferred_age?: string;
  preferred_sex?: string;
  spay_neuter_preference?: string;
  activity_level?: string;
  created_at: string;
  updated_at: string;
}

interface CreateSeekerProfileData {
  living_situation?: string;
  experience_level?: string;
  has_allergies?: boolean;
  has_children?: boolean;
  has_other_pets?: boolean;
  preferred_breed_id?: string;
  preferred_breed_name?: string;
  preferred_age?: string;
  preferred_sex?: string;
  spay_neuter_preference?: string;
  activity_level?: string;
}

interface UpdateSeekerProfileData {
  living_situation?: string;
  experience_level?: string;
  has_allergies?: boolean;
  has_children?: boolean;
  has_other_pets?: boolean;
  preferred_breed?: string;
  preferred_age?: string;
  preferred_sex?: string;
  spay_neuter_preference?: string;
  activity_level?: string;
}

// Query to get seeker's profile
export const useSeekerProfile = (userId?: string) => {
  return useQuery({
    queryKey: ['users', 'seeker-profile', userId] as const,
    queryFn: async (): Promise<SeekerProfile | null> => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('seeker_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data;
    },
    enabled: !!userId,
  });
};

// Mutation to create seeker profile
export const useCreateSeekerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSeekerProfileData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data: result, error } = await supabase
        .from('seeker_profiles')
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
      queryClient.invalidateQueries({ queryKey: ['users', 'seeker-profile', data.user_id] as const });
    },
  });
};

// Mutation to update seeker profile
export const useUpdateSeekerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateSeekerProfileData }) => {
      const { data, error } = await supabase
        .from('seeker_profiles')
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
      queryClient.invalidateQueries({ queryKey: ['users', 'seeker-profile', data.user_id] as const });
    },
  });
};

// Mutation to upsert seeker profile (create or update)
export const useUpsertSeekerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSeekerProfileData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from('seeker_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingProfile) {
        // Update existing profile
        const { data: result, error } = await supabase
          .from('seeker_profiles')
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
          .from('seeker_profiles')
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
      queryClient.invalidateQueries({ queryKey: ['users', 'seeker-profile', data.user_id] as const });
    },
  });
};
