import React from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Avatar,
  HStack,
  Badge,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid,
  useToast,
  Icon,
} from '@chakra-ui/react';
import { MdLocationOn, MdStar, MdEmail, MdPhone } from 'react-icons/md';
import { Loader } from 'lib/components/ui/Loader';
import { useUserProfile, useUserProfileById } from 'lib/hooks/queries/useUserProfile';
import { useBreederProfile } from 'lib/hooks/queries/useBreederProfile';
import { useUserBreedsFromUser } from 'lib/hooks/queries/useUserBreeds';
import { useListingsByOwner } from 'lib/hooks/queries/useListings';
import { BreedCard } from 'lib/pages/breeds/BreedCard';
import ListingCard from 'lib/pages/dashboard/listings/ListingCard';
import { NextSeo } from 'next-seo';
import Link from 'next/link';

interface PublicBreederProfileProps {
  breederId: string;
}

export const PublicBreederProfile: React.FC<PublicBreederProfileProps> = ({ breederId }) => {
  const toast = useToast();

  // Fetch breeder data
  const { data: breederProfile, isLoading: breederLoading, error: breederError } = useBreederProfile(breederId);
  const { data: breederUser, isLoading: breederUserLoading, error: breederUserError } = useUserProfileById(breederId);
  const { data: userProfile, isLoading: userLoading, error: userError } = useUserProfile();

  // Fetch breeder's breeds and listings
  const { data: breederBreeds, isLoading: breedsLoading } = useUserBreedsFromUser(breederId);
  const { data: breederListings, isLoading: listingsLoading } = useListingsByOwner(breederId);

  // Show loading state
  if (breederLoading || breederUserLoading || userLoading || breedsLoading || listingsLoading) {
    return <Loader />;
  }

  // Show error state
  if (breederError || breederUserError || userError || !breederProfile || !breederUser) {
    return (
      <Container maxW="4xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Error loading breeder profile</Text>
            <Text fontSize="sm">
              {breederError?.message || breederUserError?.message || userError?.message || 'Unable to load breeder information'}
            </Text>
          </Box>
        </Alert>
      </Container>
    );
  }

  // If breeder profile doesn't exist, show not found
  if (!breederProfile || !breederUser) {
    return (
      <Container maxW="4xl" py={8}>
        <Alert status="warning">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Breeder not found</Text>
            <Text fontSize="sm">
              The breeder profile you're looking for doesn't exist or has been removed.
            </Text>
          </Box>
        </Alert>
      </Container>
    );
  }

  const handleContactClick = () => {
    // For now, just show a toast. In the future, this could open a contact form
    toast({
      title: 'Contact feature coming soon',
      description: 'Direct messaging with breeders will be available soon.',
      status: 'info',
      duration: 3000,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'green';
      case 'reserved':
        return 'yellow';
      case 'sold':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleListingClick = (listingId: string) => {
    // Navigate to listing detail page
    window.location.href = `/dashboard/listings/${listingId}`;
  };

  // Transform breeder breeds for BreedCard component
  const breedCards = breederBreeds?.map((userBreed) => ({
    name: userBreed.breeds?.name || '',
    image: userBreed.breeds?.featured_image_url || userBreed.images?.[0] || '',
    breedGroup: userBreed.breeds?.group || '',
  })) || [];

  return (
    <>
      <NextSeo
        title={`${breederProfile.kennel_name || breederUser?.display_name} - Dog Breeder | DogHouse Kenya`}
        description={`Learn more about ${breederProfile.kennel_name || breederUser?.display_name}, a verified dog breeder in Kenya. View their available breeds and current listings.`}
        openGraph={{
          title: `${breederProfile.kennel_name || breederUser?.display_name} - Dog Breeder`,
          description: `Professional dog breeder specializing in various breeds. Located in ${breederProfile.kennel_location || 'Kenya'}.`,
          images: breederUser?.profile_photo_url ? [{ url: breederUser.profile_photo_url }] : [],
        }}
      />

      <Container maxW="7xl" py={{ base: 4, md: 8 }}>
        <VStack spacing={8} align="stretch">
          {/* Breeder Header */}
          <Card>
            <CardBody>
              <HStack spacing={6} align="start">
                <Avatar
                  size="xl"
                  src={breederUser?.profile_photo_url}
                  name={breederUser?.display_name}
                  bg="brand.500"
                  color="white"
                />

                <VStack align="start" spacing={3} flex={1}>
                  <Box>
                    <Heading size="lg">
                      {breederProfile.kennel_name || breederUser?.display_name}
                    </Heading>
                    {breederProfile.kennel_name && breederUser?.display_name && (
                      <Text color="gray.600" fontSize="md">
                        {breederUser.display_name}
                      </Text>
                    )}
                  </Box>

                  <HStack spacing={4}>
                    {breederProfile.kennel_location && (
                      <HStack>
                        <Icon as={MdLocationOn} color="gray.500" />
                        <Text fontSize="sm">{breederProfile.kennel_location}</Text>
                      </HStack>
                    )}

                    {breederProfile.rating && (
                      <HStack>
                        <Icon as={MdStar} color="yellow.400" />
                        <Text fontSize="sm">{breederProfile.rating.toFixed(1)}</Text>
                      </HStack>
                    )}

                    {breederProfile.verified_at && (
                      <Badge colorScheme="green">Verified Breeder</Badge>
                    )}
                  </HStack>

                  {breederProfile.facility_type && (
                    <Text fontSize="sm" color="gray.600">
                      {breederProfile.facility_type.replace('_', ' ').toUpperCase()} Facility
                    </Text>
                  )}

                  <HStack spacing={3}>
                    <Button
                      colorScheme="brand"
                      size="sm"
                      onClick={handleContactClick}
                      leftIcon={<MdEmail />}
                    >
                      Contact Breeder
                    </Button>

                    {breederUser?.phone && (
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<MdPhone />}
                        as="a"
                        href={`tel:${breederUser.phone}`}
                      >
                        Call
                      </Button>
                    )}
                  </HStack>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          {/* Breeder Details Tabs */}
          <Card>
            <CardBody>
              <Tabs variant="soft-rounded" colorScheme="brand">
                <TabList>
                  <Tab>Breeds ({breederBreeds?.length || 0})</Tab>
                  <Tab>Listings ({breederListings?.length || 0})</Tab>
                </TabList>

                <TabPanels>
                  {/* Breeds Tab */}
                  <TabPanel>
                    {breedCards.length > 0 ? (
                      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
                        {breedCards.map((breed, index) => (
                          <BreedCard key={index} hit={breed} />
                        ))}
                      </SimpleGrid>
                    ) : (
                      <Box textAlign="center" py={8}>
                        <Text color="gray.500">
                          This breeder hasn't added any breeds yet.
                        </Text>
                      </Box>
                    )}
                  </TabPanel>

                  {/* Listings Tab */}
                  <TabPanel>
                    {breederListings && breederListings.length > 0 ? (
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {breederListings.map((listing) => (
                          <ListingCard
                            key={listing.id}
                            listing={listing}
                            handleListingClick={handleListingClick}
                            getStatusColor={getStatusColor}
                            formatPrice={formatPrice}
                          />
                        ))}
                      </SimpleGrid>
                    ) : (
                      <Box textAlign="center" py={8}>
                        <Text color="gray.500">
                          This breeder doesn't have any listings at the moment.
                        </Text>
                      </Box>
                    )}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </>
  );
};
