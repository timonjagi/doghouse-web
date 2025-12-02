import { useQuery } from '@tanstack/react-query';
import { usePopularListings } from './usePopularListings';
import { useNewListings } from './useNewListings';
import { useFeaturedBreeders } from './useBreeders';
import { useBreedCategories } from './useBreedCategories';
import { useSeekerDashboardStats } from './useSeekerDashboardStats';
import { useAllAvailableUserBreeds } from './useUserBreeds';
import { UserBreed, Listing, BreederProfile } from '../../../../db/schema';

export interface SeekerDashboardData {
  popularBreeds: UserBreed[];
  popularListings: Listing[];
  newListings: Listing[];
  featuredBreeders: BreederProfile[];
  breedCategories: any[];
  stats: any;
}

export const useSeekerDashboard = () => {
  // Use individual hooks that manage their own caching and loading states

  const { data: popularBreeds = [], isLoading: breedsLoading, error: breedsError } = useAllAvailableUserBreeds(8);
  const { data: popularListings = [], isLoading: popularLoading, error: popularError } = usePopularListings(4);
  const { data: newListings = [], isLoading: newLoading, error: newError } = useNewListings(6);
  const { data: featuredBreeders = [], isLoading: breedersLoading, error: breedersError } = useFeaturedBreeders(4);
  const { data: breedCategories = [], isLoading: categoriesLoading, error: categoriesError } = useBreedCategories(8);
  const { data: stats, isLoading: statsLoading, error: statsError } = useSeekerDashboardStats();

  // Combine loading states
  const isLoading = breedsLoading || popularLoading || newLoading || breedersLoading || categoriesLoading || statsLoading;

  // Combine errors (return first error found)
  const error = breedsError || popularError || newError || breedersError || categoriesError || statsError;

  // Return combined data
  const data: SeekerDashboardData = {
    popularBreeds,
    popularListings,
    newListings,
    featuredBreeders,
    breedCategories,
    stats,
  };

  return {
    data,
    isLoading,
    error,
  };
};
