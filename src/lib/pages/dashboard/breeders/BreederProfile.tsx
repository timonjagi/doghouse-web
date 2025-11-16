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
  Stack,
} from '@chakra-ui/react';
import { MdLocationOn, MdStar, MdEmail, MdPhone } from 'react-icons/md';
import { Loader } from 'lib/components/ui/Loader';
import { useUserProfileById } from 'lib/hooks/queries/useUserProfile';
import { useBreederProfile } from 'lib/hooks/queries/useBreederProfile';
import { useUserBreedsFromUser } from 'lib/hooks/queries/useUserBreeds';
import { useIncrementListingViews, useListingsByOwner } from 'lib/hooks/queries/useListings';
import ListingCard from 'lib/components/ui/ListingCard';
import { BreedCard } from 'lib/components/ui/BreedCard';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { BsFillBuildingFill } from 'react-icons/bs';
import { Rating } from 'lib/components/ui/Rating';

interface BreederProfileProps {
  breederId: string;
}

export const BreederProfile: React.FC<BreederProfileProps> = ({ breederId }) => {
  const toast = useToast();
  const router = useRouter();

  // Fetch breeder data
  const { data: breederProfile, isLoading: breederLoading, error: breederError } = useBreederProfile(breederId);
  const { data: breederUser, isLoading: breederUserLoading, error: breederUserError } = useUserProfileById(breederId);

  // Fetch breeder's breeds and listings
  const { data: breederBreeds, isLoading: breedsLoading } = useUserBreedsFromUser(breederId);
  const { data: breederListings, isLoading: listingsLoading } = useListingsByOwner(breederId);

  const incrementViewsMutation = useIncrementListingViews();

  // Show loading state
  if (breederLoading || breederUserLoading || breedsLoading || listingsLoading) {
    return <Loader />;
  }

  // Show error state
  if (breederError || breederUserError || !breederProfile || !breederUser) {
    return (
      <Container maxW="4xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Error loading breeder profile</Text>
            <Text fontSize="sm">
              {breederError?.message || breederUserError?.message || 'Unable to load breeder information'}
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

  const handleListingClick = async (listingId: string) => {
    // Increment view count
    try {
      await incrementViewsMutation.mutateAsync(listingId);
    } catch (error) {
      console.error('Failed to increment views:', error);
    }

    // Navigate to detail page
    router.push(`/dashboard/listings/${listingId}`);
  };

  const formatFacilityType = (facilityType: string) => {
    return breederProfile.facility_type.charAt(0).toUpperCase() + breederProfile.facility_type.slice(1).replace('_', ' ').replace('facility', '')
  }
  return (
    <>

      <Container maxW="7xl" py={{ base: 4, md: 0 }}>

        <Button
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          onClick={() => router.back()}
          mb={4}
          p={0}
        >
          Back to Breeders
        </Button>
        <VStack spacing={8} align="stretch">
          {/* Breeder Header */}
          <Card>
            <CardBody>
              <HStack spacing={6} align="start">
                <Avatar
                  size="xl"
                  src={breederUser?.profile_photo_url}
                  name={breederProfile.kennel_name || breederUser?.display_name}

                  bg="brand.500"
                  color="white"
                />

                <VStack align="start" spacing={2} flex={1}>
                  <Heading size={{ base: 'xs', lg: 'sm' }}>
                    {breederProfile.kennel_name || breederUser?.display_name}
                  </Heading>



                  <HStack justify="space-between" align="center">
                    {breederProfile.verified_at && (
                      <Badge colorScheme="green">Verified Breeder</Badge>
                    )}


                    <Rating score={breederProfile.rating || 0} />

                  </HStack>


                  <HStack spacing={4}>
                    {breederProfile.kennel_location && (
                      <HStack>
                        <Icon as={MdLocationOn} color="gray.500" />
                        <Text fontSize="sm">{breederProfile.kennel_location}</Text>
                      </HStack>
                    )}

                  </HStack>

                  {breederProfile.facility_type && (
                    <HStack>
                      <Icon as={BsFillBuildingFill} color="brand.400" />
                      <Text fontSize="sm" color="gray.600">
                        {formatFacilityType(breederProfile.facility_type)} Facility
                      </Text>
                    </HStack>
                  )}
                  {/* 
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
                  </HStack> */}
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Tabs variant="soft-rounded" colorScheme="brand">
            <TabList>
              <Tab>Breeds ({breederBreeds?.length || 0})</Tab>
              <Tab>Listings ({breederListings?.length || 0})</Tab>
            </TabList>

            <TabPanels>
              {/* Breeds Tab */}
              <TabPanel px={0}>
                {breederBreeds?.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                    {breederBreeds.map((breed, index) => (
                      <BreedCard key={index} userBreed={breed} userRole="seeker" />
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
              <TabPanel px={0}>
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
        </VStack>
      </Container>
    </>
  );
};
