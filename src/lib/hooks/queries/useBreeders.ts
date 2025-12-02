import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';

export const useAllBreeders = (limit: number = 4) => {
  return useQuery({
    queryKey: queryKeys.users.featured(limit),
    queryFn: async (): Promise<any[]> => {
      // Get verified breeders with active listings, ordered by rating and activity
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          display_name,
          profile_photo_url,
          created_at,
          breeder_profiles (
            kennel_name,
            kennel_location,
            verified_at,
            rating
          ),
          user_breeds!inner (
            id,
            breed_id,
            created_at
          )
        `)
        .eq('role', 'breeder')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Group by breeder and count user_breeds
      const breederMap = new Map();

      data?.forEach((breeder: any) => {
        const breederId = breeder.id;
        if (!breederMap.has(breederId)) {
          breederMap.set(breederId, {
            ...breeder,
            userBreedsCount: 0,
          });
        }
        breederMap.get(breederId).userBreedsCount += 1;
      });

      return Array.from(breederMap.values()).slice(0, limit);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useFeaturedBreeders = (limit: number = 4) => {
  return useQuery({
    queryKey: queryKeys.users.featured(limit),
    queryFn: async (): Promise<any[]> => {
      // Get verified breeders with active listings, ordered by rating and activity
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          display_name,
          profile_photo_url,
          created_at,
          breeder_profiles (
            kennel_name,
            kennel_location,
            verified_at,
            rating
          ),
          listings!inner (
            id,
            status,
            created_at
          )
        `)
        .eq('role', 'breeder')
        // .not('breeder_profiles.verified_at', 'is', null)
        //.eq('listings.status', 'available')
        //.order('breeder_profiles.rating', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Group by breeder and count active listings
      const breederMap = new Map();

      data?.forEach((breeder: any) => {
        const breederId = breeder.id;
        if (!breederMap.has(breederId)) {
          breederMap.set(breederId, {
            ...breeder,
            activeListingsCount: 0,
          });
        }
        breederMap.get(breederId).activeListingsCount += 1;
      });

      return Array.from(breederMap.values()).slice(0, limit);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
