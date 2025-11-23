import React from 'react';
import {
  Box,
  Grid,
  VStack,
  HStack,
  Text,
  Button,
  useColorModeValue,
  Heading,
  SimpleGrid,
  Container,
} from '@chakra-ui/react';
import { FiSearch, FiHeart, FiMapPin, FiFilter } from 'react-icons/fi';
import { useRouter } from 'next/router';

import { useSeekerDashboardStats } from '../../../hooks/queries/useSeekerDashboardStats';
import { usePopularListings } from '../../../hooks/queries/usePopularListings';
import { useNewListings } from '../../../hooks/queries/useNewListings';
import { useFeaturedBreeders } from '../../../hooks/queries/useFeaturedBreeders';
import { useBreedCategories } from '../../../hooks/queries/useBreedCategories';
import { useUserProfile } from 'lib/hooks/queries/useUserProfile';
import { Loader } from 'lib/components/ui/Loader';
import { SearchBar } from '../../../components/ui/SearchBar';
import ListingCard from '../../../components/ui/ListingCard';
import { BreederCard } from '../../../components/ui/BreederCard';
import { BreedCard } from '../../../components/ui/BreedCard';

const SeekerDashboardOverview: React.FC = () => {
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  // Discovery data hooks
  const { data: popularListings, isLoading: popularLoading } = usePopularListings(6);
  const { data: newListings, isLoading: newLoading } = useNewListings(6);
  const { data: featuredBreeders, isLoading: breedersLoading } = useFeaturedBreeders(4);
  const { data: breedCategories, isLoading: categoriesLoading } = useBreedCategories(8);

  // Legacy stats for application cards
  const { data: stats, isLoading: statsLoading } = useSeekerDashboardStats();

  const handleListingClick = (listingId: string) => {
    router.push(`/dashboard/listings/${listingId}`);
  };

  const handleBreederClick = (breederId: string) => {
    router.push(`/dashboard/breeders/${breederId}`);
  };

  const handleBreedClick = (breedId: string) => {
    router.push(`/dashboard/listings?breed=${breedId}`);
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Price not set';
    return `KSH ${price.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'green';
      case 'reserved': return 'yellow';
      case 'sold': return 'red';
      default: return 'gray';
    }
  };

  if (profileLoading || statsLoading) {
    return <Loader />;
  }

  return (
    <Container maxW="7xl" py={6}>
      <VStack spacing={8} align="stretch">
        {/* Welcome Header */}
        <Box textAlign="center">
          <Heading size="lg" mb={2}>
            Welcome back, {profile?.display_name}!
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Discover your perfect furry companion
          </Text>
        </Box>

        {/* Search Bar */}
        <SearchBar placeholder="Find your dream dog..." />

        {/* Popular Listings Section */}
        <Box>
          <HStack justify="space-between" align="center" mb={4}>
            <Heading size="md">Popular Listings</Heading>
            <Button
              variant="ghost"
              colorScheme="blue"
              onClick={() => router.push('/dashboard/listings')}
            >
              View All
            </Button>
          </HStack>
          {popularLoading ? (
            <Loader />
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {popularListings?.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  handleListingClick={handleListingClick}
                  formatPrice={formatPrice}
                  getStatusColor={getStatusColor}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>

        {/* New Arrivals Section */}
        <Box>
          <HStack justify="space-between" align="center" mb={4}>
            <Heading size="md">New Arrivals</Heading>
            <Button
              variant="ghost"
              colorScheme="blue"
              onClick={() => router.push('/dashboard/listings?sort=newest')}
            >
              View All
            </Button>
          </HStack>
          {newLoading ? (
            <Loader />
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {newListings?.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  handleListingClick={handleListingClick}
                  formatPrice={formatPrice}
                  getStatusColor={getStatusColor}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>

        {/* Featured Breeders Section */}
        <Box>
          <HStack justify="space-between" align="center" mb={4}>
            <Heading size="md">Featured Breeders</Heading>
            <Button
              variant="ghost"
              colorScheme="blue"
              onClick={() => router.push('/dashboard/breeders')}
            >
              View All
            </Button>
          </HStack>
          {breedersLoading ? (
            <Loader />
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
              {featuredBreeders?.map((breeder) => (
                <BreederCard
                  key={breeder.id}
                  breeder={breeder}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>

        {/* Breed Categories Section */}
        <Box>
          <HStack justify="space-between" align="center" mb={4}>
            <Heading size="md">Browse by Breed</Heading>
            <Button
              variant="ghost"
              colorScheme="blue"
              onClick={() => router.push('/dashboard/breeds')}
            >
              View All Breeds
            </Button>
          </HStack>
          {categoriesLoading ? (
            <Loader />
          ) : (
            <SimpleGrid columns={{ base: 2, md: 4, lg: 8 }} spacing={4}>
              {breedCategories?.map((category) => (
                <BreedCard
                  key={category.id}
                  userBreed={{
                    id: category.id,
                    breeds: {
                      name: category.name,
                      featured_image_url: category.featuredImage,
                    },
                    breeder_count: category.listingCount,
                  }}
                  userRole="seeker"
                  onClick={() => handleBreedClick(category.id)}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>

        {/* Application Status Cards */}
        {stats && (stats.activeApplications > 0 || stats.completedApplications > 0) && (
          <Box>
            <Heading size="md" mb={4}>Your Applications</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {stats.activeApplications > 0 && (
                <Box
                  p={6}
                  bg="white"
                  borderRadius="lg"
                  shadow="md"
                  border="1px"
                  borderColor="gray.200"
                  cursor="pointer"
                  onClick={() => router.push('/dashboard/applications')}
                  _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                  transition="all 0.2s"
                >
                  <VStack spacing={2} align="center">
                    <Text fontSize="3xl">📋</Text>
                    <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                      {stats.activeApplications}
                    </Text>
                    <Text fontWeight="medium">Active Applications</Text>
                    <Text fontSize="sm" color="gray.600">
                      Track your ongoing adoption processes
                    </Text>
                  </VStack>
                </Box>
              )}

              {stats.completedApplications > 0 && (
                <Box
                  p={6}
                  bg="white"
                  borderRadius="lg"
                  shadow="md"
                  border="1px"
                  borderColor="gray.200"
                  cursor="pointer"
                  onClick={() => router.push('/dashboard/applications')}
                  _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                  transition="all 0.2s"
                >
                  <VStack spacing={2} align="center">
                    <Text fontSize="3xl">🏆</Text>
                    <Text fontSize="2xl" fontWeight="bold" color="green.600">
                      {stats.completedApplications}
                    </Text>
                    <Text fontWeight="medium">Successful Adoptions</Text>
                    <Text fontSize="sm" color="gray.600">
                      Congratulations on finding your companions!
                    </Text>
                  </VStack>
                </Box>
              )}
            </SimpleGrid>
          </Box>
        )}

        {/* Quick Actions */}
        <Box>
          <Heading size="md" mb={4}>Quick Actions</Heading>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            <Button
              leftIcon={<FiSearch />}
              colorScheme="blue"
              variant="outline"
              size="lg"
              height="60px"
              onClick={() => router.push('/dashboard/listings')}
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
              transition="all 0.2s"
            >
              Browse All
            </Button>
            <Button
              leftIcon={<FiHeart />}
              colorScheme="pink"
              variant="outline"
              size="lg"
              height="60px"
              onClick={() => router.push('/dashboard/matches')}
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
              transition="all 0.2s"
            >
              My Matches
            </Button>
            <Button
              leftIcon={<FiMapPin />}
              colorScheme="green"
              variant="outline"
              size="lg"
              height="60px"
              onClick={() => router.push('/dashboard/listings?nearby=true')}
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
              transition="all 0.2s"
            >
              Nearby
            </Button>
            <Button
              leftIcon={<FiFilter />}
              colorScheme="purple"
              variant="outline"
              size="lg"
              height="60px"
              onClick={() => router.push('/dashboard/account/preferences')}
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
              transition="all 0.2s"
            >
              Preferences
            </Button>
          </SimpleGrid>
        </Box>
      </VStack>
    </Container>
  );
};

export default SeekerDashboardOverview;
