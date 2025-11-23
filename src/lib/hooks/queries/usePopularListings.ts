import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';

export const usePopularListings = (limit: number = 6) => {
  return useQuery({
    queryKey: queryKeys.listings.popular(limit),
    queryFn: async (): Promise<any[]> => {
      // Get listings ordered by view_count (popularity) and recent activity
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id,
          title,
          description,
          type,
          price,
          reservation_fee,
          photos,
          location_text,
          status,
          view_count,
          created_at,
          updated_at,
          breeds (
            name
          ),
          users (
            display_name,
            profile_photo_url
          )
        `)
        .eq('status', 'available')
        .order('view_count', { ascending: false })
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
