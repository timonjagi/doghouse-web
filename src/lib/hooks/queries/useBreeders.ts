import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';

export const useAllBreeders = (
  limit?: number,
  options?: {
    search?: string;
    location?: string;
    page?: number;
    pageSize?: number;
  }
) => {
  return useQuery({
    queryKey: queryKeys.users.list({ ...options, limit }),
    queryFn: async (): Promise<any[]> => {
      // Store search term for client-side filtering
      const searchTerm = options?.search?.toLowerCase();

      // Get verified breeders with active listings, ordered by rating and activity
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          display_name,
          email,
          profile_photo_url,
          role,
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
            created_at,
            breeds (
              id,
              name
            )
          )
        `)
        .eq('role', 'breeder')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('breeder data', data)
      // Group by breeder and collect breed names
      const breederMap = new Map();

      data?.forEach((breeder: any) => {
        const breederId = breeder.id;
        if (!breederMap.has(breederId)) {
          breederMap.set(breederId, {
            ...breeder,
            userBreedsCount: 0,
            breedNames: [] as string[],
          });
        }
        const breederData = breederMap.get(breederId);
        breederData.userBreedsCount += 1;
        // Collect breed names for search
        if (breeder.user_breeds?.breeds?.name) {
          breederData.breedNames.push(breeder.user_breeds.breeds.name.toLowerCase());
        }
      });

      let results = Array.from(breederMap.values());

      // Apply search filter (display_name, kennel_name, breed names)
      if (searchTerm) {
        results = results.filter((breeder: any) => {
          const nameMatch = breeder.display_name?.toLowerCase().includes(searchTerm);
          const kennelMatch = breeder.breeder_profiles?.[0]?.kennel_name?.toLowerCase().includes(searchTerm);
          const locationMatch = breeder.breeder_profiles?.[0]?.kennel_location?.toLowerCase().includes(searchTerm);
          const breedMatch = breeder.breedNames?.some((name: string) => name.includes(searchTerm));
          return nameMatch || kennelMatch || locationMatch || breedMatch;
        });
      }

      // Apply location filter
      if (options?.location) {
        const locationTerm = options.location.toLowerCase();
        results = results.filter((breeder: any) =>
          breeder.breeder_profiles?.[0]?.kennel_location?.toLowerCase().includes(locationTerm)
        );
      }

      // Apply pagination
      if (options?.page !== undefined && options?.pageSize !== undefined) {
        const startIdx = options.page * options.pageSize;
        const endIdx = startIdx + options.pageSize;
        return results.slice(startIdx, endIdx);
      }

      // Apply limit
      if (limit !== undefined) {
        return results.slice(0, limit);
      }

      return results;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
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
