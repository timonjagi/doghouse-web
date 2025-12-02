import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from 'lib/supabase/client';

export interface WishlistItem {
  id: string;
  user_id: string;
  listing_id?: string;
  user_breed_id?: string;
  notify_when_available: boolean;
  created_at: string;
  updated_at: string;
}

// Get user's wishlist
export const useWishlist = () => {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          *,
          listings (
            id,
            title,
            description,
            photos,
            price,
            status,
            owner_id,
            breed_id
          ),
          user_breeds (
            id,
            breed_id,
            images,
            is_owner,
            user_id,
            breeds (
              name,
              featured_image_url
            )
          )
        `);

      if (error) throw error;
      return data as WishlistItem[];
    },
  });
};

// Add item to wishlist
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listing_id,
      user_breed_id,
      notify_when_available = false
    }: {
      listing_id?: string;
      user_breed_id?: string;
      notify_when_available?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('wishlists')
        .insert({
          listing_id,
          user_breed_id,
          notify_when_available,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};

// Remove item from wishlist
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};

// Toggle notification setting
export const useToggleWishlistNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, notify_when_available }: { id: string; notify_when_available: boolean }) => {
      const { data, error } = await supabase
        .from('wishlists')
        .update({ notify_when_available })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};

// Check if item is in wishlist
export const useIsInWishlist = (listing_id?: string, user_breed_id?: string) => {
  return useQuery({
    queryKey: ['wishlist', 'check', { listing_id, user_breed_id }],
    queryFn: async () => {
      let query = supabase.from('wishlists').select('id');

      if (listing_id) {
        query = query.eq('listing_id', listing_id);
      } else if (user_breed_id) {
        query = query.eq('user_breed_id', user_breed_id);
      }

      const { data, error } = await query.single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found" error
      return !!data;
    },
    enabled: !!listing_id || !!user_breed_id,
  });
};
