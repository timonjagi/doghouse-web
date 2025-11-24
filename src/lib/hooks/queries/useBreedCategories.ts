import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';

export interface BreedCategory {
  id: string;
  name: string;
  group: string;
  listingCount: number;
  featuredImage?: string;
}

export const useBreedCategories = (limit: number = 8) => {
  return useQuery({
    queryKey: queryKeys.breeds.categories(limit),
    queryFn:

      // async (): Promise<BreedCategory[]> => {
      //   // Get breeds with their listing counts
      //   const { data, error } = await supabase
      //     .from('breeds')
      //     .select(`
      //       id,
      //       name,
      //       group,
      //       featured_image_url,
      //       listings!inner (
      //         id,
      //         status
      //       )
      //     `)
      //     .eq('listings.status', 'available')
      //     .order('name');

      //   if (error) throw error;

      //   // Group by breed and count listings
      //   const breedMap = new Map<string, BreedCategory>();

      //   data?.forEach((breed: any) => {
      //     const breedId = breed.id;
      //     if (!breedMap.has(breedId)) {
      //       breedMap.set(breedId, {
      //         id: breedId,
      //         name: breed.name,
      //         group: breed.group || 'Other',
      //         listingCount: 0,
      //         featuredImage: breed.featured_image_url,
      //       });
      //     }
      //     breedMap.get(breedId)!.listingCount += 1;
      //   });

      //   // Convert to array, sort by listing count, and limit
      //   return Array.from(breedMap.values())
      //     .sort((a, b) => b.listingCount - a.listingCount)
      //     .slice(0, limit);
      // },
      () => {
        const defaultCategories = [
          { label: 'Popular', url: '/dashboard/search?tab=listings' },
          { label: 'New Arrivals', url: '/dashboard/search?tab=listings&sort=newest' },
          { label: 'Featured', url: '/dashboard/search?tab=breeders&featured=true' },
          { label: 'Local Breeders', url: '/dashboard/search?tab=breeders&local=true' },
          { label: 'Verified Sellers', url: '/dashboard/search?tab=breeders&verified=true' },
          { label: 'Rescue Organizations', url: '/dashboard/search?tab=breeders&rescue=true' },
          { label: 'Training Services', url: '/dashboard/search?tab=services&training=true' },
          { label: 'Pet Care', url: '/dashboard/search?tab=services&care=true' },
        ]

        return Promise.resolve(defaultCategories);
      },
    //staleTime: 1000 * 60 * 10, // 10 minutes
  });
}