import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';
import { UserBreed } from '../../../../db/schema';

interface CreateUserBreedData {
  breed_id: string;
  is_owner?: boolean;
  notes?: string;
  images?: string[];
}

interface UpdateUserBreedData {
  is_owner?: boolean;
  notes?: string;
  images?: string[];
}

// Query to get user's breeds with full breed details
export const useUserBreedsFromUser = (userId?: string) => {
  return useQuery({
    queryKey: queryKeys.breeds.userBreeds(userId),
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('user_breeds')
        .select(`
          id,
          user_id,
          breed_id,
          is_owner,
          notes,
          images,
          created_at,
          updated_at,
          breeds (
            id,
            name,
            description,
            group,
            featured_image_url,
            height,
            weight,
            life_span,
            traits
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      console.log(error)
      return data || [];
    },
    enabled: !!userId,
  });
};

// Query to get specific user breed by ID
export const useUserBreed = (breedId: string) => {
  return useQuery({
    queryKey: ['breeds', 'user-breed', breedId] as const,
    queryFn: async (): Promise<UserBreed | null> => {
      const { data, error } = await supabase
        .from('user_breeds')
        .select(`
          id,
          user_id,
          breed_id,
          is_owner,
          notes,
          images,
          created_at,
          updated_at,
          breeds (
            id,
            name,
            description,
            group,
            featured_image_url,
            height,
            weight,
            life_span,
            traits
          )
        `)
        .eq('id', breedId)
      //.single();

      if (error) throw error;
      return data[0]
    },
    enabled: !!breedId,
  });
};

// Mutation to create a new user breed association
export const useCreateUserBreed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserBreedData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data: result, error } = await supabase
        .from('user_breeds')
        .insert({
          user_id: user.id,
          ...data,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.breeds.userBreeds() });
    },
  });
};

// Mutation to update user breed
export const useUpdateUserBreed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateUserBreedData }) => {
      const { data, error } = await supabase
        .from('user_breeds')
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
      queryClient.invalidateQueries({ queryKey: queryKeys.breeds.userBreeds() });
      queryClient.invalidateQueries({ queryKey: ['breeds', 'user-breed', data.id] as const });
    },
  });
};

// Mutation to delete user breed association
export const useDeleteUserBreed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (breedId: string) => {
      const { error } = await supabase
        .from('user_breeds')
        .delete()
        .eq('id', breedId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.breeds.userBreeds() });
    },
  });
};
