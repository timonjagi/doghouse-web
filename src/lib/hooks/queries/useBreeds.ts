import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';

// Types
interface Breed {
  id: string;
  name: string;
  description?: string;
  breed_group?: string;
  created_at: string;
}

// Query to get all breeds
export const useBreeds = () => {
  return useQuery({
    queryKey: queryKeys.breeds.lists(),
    queryFn: async (): Promise<Breed[]> => {
      const { data, error } = await supabase
        .from('breeds')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - breeds don't change often
  });
};

// Query to get breed by ID
export const useBreed = (id: string) => {
  return useQuery({
    queryKey: queryKeys.breeds.detail(id),
    queryFn: async (): Promise<Breed | null> => {
      const { data, error } = await supabase
        .from('breeds')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

// Query to get user's selected breeds
export const useUserBreeds = (userId?: string) => {
  return useQuery({
    queryKey: queryKeys.breeds.userBreeds(userId),
    queryFn: async (): Promise<Breed[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('user_breeds')
        .select(`
          breeds (*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data?.map((item: any) => item.breeds).filter(Boolean) || [];
    },
    enabled: !!userId,
  });
};

// Mutation to add breed to user's selection
export const useAddUserBreed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (breedId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('user_breeds')
        .insert({ user_id: user.id, breed_id: breedId });

      if (error) throw error;
    },
    onSuccess: (_, breedId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.breeds.userBreeds() });
      queryClient.invalidateQueries({ queryKey: queryKeys.breeds.detail(breedId) });
    },
  });
};

// Mutation to remove breed from user's selection
export const useRemoveUserBreed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (breedId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('user_breeds')
        .delete()
        .eq('user_id', user.id)
        .eq('breed_id', breedId);

      if (error) throw error;
    },
    onSuccess: (_, breedId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.breeds.userBreeds() });
      queryClient.invalidateQueries({ queryKey: queryKeys.breeds.detail(breedId) });
    },
  });
};
