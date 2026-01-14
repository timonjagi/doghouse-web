import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';

interface SyncBreedImageData {
  userBreedId: string;
  breedId: string;
  imageUrl: string;
}

/**
 * Hook to synchronize a verified user_breed image to the main breed catalog.
 * This is typically called by an admin or an automated process when a user_breed image is approved.
 */
export const useSyncBreedImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ breedId, imageUrl }: SyncBreedImageData) => {
      // Update the main breed catalog's featured image
      const { data, error } = await supabase
        .from('breeds')
        .update({
          featured_image_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', breedId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate both the specific breed and general lists
      queryClient.invalidateQueries({ queryKey: queryKeys.breeds.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.breeds.detail(variables.breedId) });
    },
  });
};

/**
 * Hook to verify a user_breed and optionally sync its first image to the breed catalog.
 */
export const useVerifyAndSyncUserBreed = () => {
  const queryClient = useQueryClient();
  const syncBreedImage = useSyncBreedImage();

  return useMutation({
    mutationFn: async ({ userBreedId, breedId, images, shouldSync = true }: { userBreedId: string; breedId: string; images: string[]; shouldSync?: boolean }) => {
      // 1. Mark user_breed as verified
      const { error: verifyError } = await supabase
        .from('user_breeds')
        .update({ is_verified: true, updated_at: new Date().toISOString() })
        .eq('id', userBreedId);

      if (verifyError) throw verifyError;

      // 2. If shouldSync is true and there are images, sync the first one
      if (shouldSync && images && images.length > 0) {
        await syncBreedImage.mutateAsync({
          userBreedId,
          breedId,
          imageUrl: images[0]
        });
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
    },
  });
};
