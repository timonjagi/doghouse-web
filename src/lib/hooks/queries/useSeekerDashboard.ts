import { useFeaturedBreeders } from './useBreeders';
import { useCategories } from './useCategories';
import { useSeekerDashboardStats } from './useSeekerDashboardStats';
import { Listing, BreederProfile } from '../../db/schema';
import { useNewListings, usePopularListings } from './useListings';
import { usePopularBreeds } from './useBreeds';
import { useRouter } from 'next/router';

export interface SeekerDashboardData {
  popularBreeds: any[];
  popularListings: Listing[];
  newListings: Listing[];
  featuredBreeders: BreederProfile[];
  stats: any;
}

export const useSeekerDashboard = (petType?: string) => {
  // Use individual hooks that manage their own caching and loading states
  const { data: popularBreeds, isLoading: breedsLoading, error: breedsError } = usePopularBreeds(12, petType);
  const { data: popularListings, isLoading: popularLoading, error: popularError } = usePopularListings(4, petType);
  const { data: newListings, isLoading: newLoading, error: newError } = useNewListings(4, petType);
  const { data: featuredBreeders, isLoading: breedersLoading, error: breedersError } = useFeaturedBreeders(4, petType);
  const { data: stats, isLoading: statsLoading, error: statsError } = useSeekerDashboardStats();


  // Combine loading states
  const isLoading = breedsLoading || popularLoading || newLoading || breedersLoading || statsLoading;

  // Combine errors (return first error found)
  const error = breedsError || popularError || newError || breedersError || statsError;

  // Return combined data
  const data: SeekerDashboardData = {
    popularBreeds,
    popularListings,
    newListings,
    featuredBreeders,
    stats,
  };

  return {
    data,
    isLoading,
    error,
  };
};
