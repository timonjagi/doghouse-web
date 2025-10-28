import React from 'react';
import {
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Center,
  SimpleGrid,
  Box,
  useColorModeValue,
  Flex,
  AlertIcon,
  Alert,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useUserProfile } from '../../../../hooks/queries';
import { useListingsByOwner } from '../../../../hooks/queries/useListings';
import { NextSeo } from 'next-seo';
import { Loader } from 'lib/components/ui/Loader';
import ManageListingCard from './ManageListingCard';

const ManageListingsPage: React.FC = () => {
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');

  const { data: listings, isLoading: listingsLoading, error } = useListingsByOwner(
    profile?.id || ''
  );

  const handleViewListing = (listingId: string) => {
    router.push(`/dashboard/listings/${listingId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'available': return 'green';
      case 'reserved': return 'yellow';
      case 'sold': return 'red';
      default: return 'gray';
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Price not set';
    return `KSH ${price.toLocaleString()}`;
  };

  if (profileLoading) {
    return (
      <Loader />

    );
  }

  if (profile?.role !== 'breeder') {
    return (
      <Container maxW="7xl">
        <Center h="400px">
          <VStack spacing={4}>
            <Text fontSize="lg" color="gray.500">Access denied</Text>
            <Text color="gray.400">Only breeders can manage listings</Text>
            <Button onClick={() => router.push('/dashboard/listings')}>
              Back to Dashboard
            </Button>
          </VStack>
        </Center>
      </Container>
    );
  }


  if (listingsLoading) {
    return (
      <Loader />
    );
  }


  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error loading listing data. Please try again later.
        {error.message}
      </Alert>
    );
  }

  return (
    <>
      <NextSeo title="Manage Listings - DogHouse Kenya" />

      <Container maxW="7xl" py={4}>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <Box >
              <Heading size={{ base: 'sm', lg: 'md' }} mb={2} color="brand.500">Manage Listings</Heading>
              <Text color="gray.600">Edit, view, or update the status of your listings</Text>
            </Box>

            {listings?.length > 0 && <Button
              leftIcon={<AddIcon />}
              colorScheme="brand"
              onClick={() => router.push('/dashboard/listings/create')}
            >
              Create
            </Button>}
          </HStack>

          {listings?.length === 0 ? (
            <Center h="300px" bg={bgColor} borderRadius="lg" border="2px dashed" borderColor="gray.300">
              <VStack spacing={4}>
                <Text fontSize="xl" fontWeight="semibold" color="gray.500">No listings yet</Text>
                <Text color="gray.400" textAlign="center" maxW="md">
                  Create your first listing to start connecting with potential pet adopters.
                </Text>
                <Button colorScheme="brand" onClick={() => router.push('/dashboard/listings/create')}>
                  Create Your First Listing
                </Button>
              </VStack>
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {listings?.map((listing) => (
                <ManageListingCard
                  key={listing.id}
                  listing={listing}
                  handleViewListing={handleViewListing}
                  getStatusColor={getStatusColor}
                  bgColor={bgColor}
                  formatPrice={formatPrice}
                />
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </>
  );
};

export default ManageListingsPage;
