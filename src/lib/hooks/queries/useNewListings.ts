import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';

export const useNewListings = (limit: number = 6) => {
  return useQuery({
    queryKey: queryKeys.listings.new(limit),
    queryFn: async (): Promise<any[]> => {
      // Get recently added listings
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
          created_at,
          breeds (
            name
          ),
          users (
            display_name,
            profile_photo_url
          )
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
