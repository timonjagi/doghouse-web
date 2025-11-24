import { Box, Flex, Stack } from '@chakra-ui/react'
import { NavCategoryMenu } from 'lib/components/layout/NavCategoryMenu'
import { NavCategorySubmenu } from 'lib/components/layout/NavCategorySubmenu'
import { SearchInput } from 'lib/components/layout/SearchInput';
import { Loader } from 'lib/components/ui/Loader';
import { useAllAvailableUserBreeds } from 'lib/hooks/queries';
import { useSeekerDashboard } from 'lib/hooks/queries/useSeekerDashboard'
import React from 'react';

const SeekerDashboardOverview: React.FC = () => {
  // Use the unified dashboard hook to fetch data for dynamic navigation
  const { data: dashboardData, isLoading, error } = useSeekerDashboard();

  // refactor to usePopularBreeds hook

  // So
  const popularListings = dashboardData?.popularListings || [];
  const featuredBreeders = dashboardData?.featuredBreeders || [];
  const breedCategories = dashboardData?.breedCategories || [];
  const popularBreeds = dashboardData?.popularBreeds || [];

  console.log('SeekerDashboardOverview render:', { popularListings, featuredBreeders, breedCategories, popularBreeds });
  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return <Box>Error loading dashboard data. {error.message}</Box>
  }

  return (
    <Stack>
      {/* Desktop Layout - Categories and Navigation */}
      <Box display={{ base: 'none', md: 'block' }}>
        <NavCategoryMenu.Desktop listings={popularListings} breeders={featuredBreeders} breeds={popularBreeds} />
        <NavCategorySubmenu.Desktop breedCategories={breedCategories} popularBreeds={popularBreeds} popularListings={popularListings} />
      </Box>

      {/* Mobile Layout - Categories and Navigation */}
      <Box display={{ base: 'block', md: 'none' }}>
        <Flex flex="1" fontSize="sm" overflow="auto">
          <NavCategoryMenu.Mobile listings={popularListings} breeders={featuredBreeders} breeds={popularBreeds} />
          <NavCategorySubmenu.Mobile breedCategories={breedCategories} popularBreeds={popularBreeds} popularListings={popularListings} />
        </Flex>
      </Box>
    </Stack>
  );
};

export default SeekerDashboardOverview;
