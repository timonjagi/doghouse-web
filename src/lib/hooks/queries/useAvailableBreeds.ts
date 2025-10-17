import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';

// Query to get all available breeds (from user_breeds table, deduplicated)
// This is for seekers to browse all breeds that breeders have made available
export const useAllAvailableUserBreeds = () => {
  return useQuery({
    queryKey: queryKeys.breeds.available(),
    queryFn: async () => {
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
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Deduplicate by breed_id and return unique breeds
      const uniqueBreeds = data?.reduce((acc, userBreed) => {
        if (userBreed.breeds && !acc.some(item => item.breed_id === userBreed.breed_id)) {
          acc.push({
            ...userBreed,
            // Include aggregated data from all breeders offering this breed
            breeder_count: data.filter(item => item.breed_id === userBreed.breed_id).length,
            // Use the most recent images from any breeder
            all_images: data
              .filter(item => item.breed_id === userBreed.breed_id && item.images)
              .flatMap(item => item.images || [])
          });
        }
        return acc;
      }, [] as any[]) || [];

      return uniqueBreeds;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes - available breeds don't change often
  });
};

// Query to get breeders offering a specific breed
export const useBreedersForBreed = (breedId: string) => {
  return useQuery({
    queryKey: queryKeys.breeds.breedBreeders(breedId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_breeds')
        .select(`
          id,
          user_id,
          notes,
          images,
          created_at,
          users (
            id,
            profile_photo_url
          ),
          breeder_profiles (
            id,
            kennel_name,
            kennel_location,
            rating
          )
        `)
        .eq('breed_id', breedId)
        .eq('is_owner', true);

      if (error) throw error;
      return data || [];
    },
    enabled: !!breedId,
  });
};

// Query to get listings for a specific breed
export const useListingsForBreed = (breedId: string) => {
  return useQuery({
    queryKey: queryKeys.listings.byBreed(breedId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id,
          title,
          description,
          price,
          location_text,
          photos,
          status,
          created_at,
          users (
            display_name,
            profile_photo_url
          )
        `)
        .eq('breed_id', breedId)
        .eq('status', 'available');

      if (error) throw error;
      return data || [];
    },
    enabled: !!breedId,
  });
};
