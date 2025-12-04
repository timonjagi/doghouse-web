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
  useColorModeValue,
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
import { CardContent, CardWithAvatar } from 'lib/components/ui/UserCardWithBackground';
import { UserInfo } from 'lib/components/ui/UserInfo';
import { FiEdit, FiEdit2, FiEdit3, FiLogOut } from 'react-icons/fi';
import { LuDog } from 'react-icons/lu';
import { useCurrentUser } from 'lib/hooks/queries/useAuth';

interface BreederProfileProps {
  breederId: string;
  showBackButton?: boolean;
}

export const BreederProfile: React.FC<BreederProfileProps> = ({ breederId, showBackButton = true }) => {
  const toast = useToast();
  const router = useRouter();
  const { data: user } = useCurrentUser();

  // Fetch breeder data
  const { data: breederProfile, isLoading: breederLoading, error: breederError } = useBreederProfile(breederId);
  const { data: breederUser, isLoading: breederUserLoading, error: breederUserError } = useUserProfileById(breederId);

  // Fetch breeder's breeds and listings
  const { data: breederBreeds, isLoading: breedsLoading } = useUserBreedsFromUser(breederId);
  const { data: breederListings, isLoading: listingsLoading } = useListingsByOwner(breederId);

  const incrementViewsMutation = useIncrementListingViews();

  const isLoading = breederLoading || breederUserLoading || breedsLoading || listingsLoading;
  // Show loading state
  if (isLoading) {
    return <Loader />;
  }

  const isError = breederError || breederUserError;
  const isManaging = user?.id === breederId;

  // Show error state
  if (isError) {
    return (
      <Container maxW="4xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Error loading breeder profile</Text>
            <Text fontSize="sm">
              {isError?.message || 'Unable to load breeder information'}
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

        {showBackButton && <Button
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          onClick={() => router.back()}
          mb={4}
          p={0}
        >
          Back to Breeders
        </Button>}

        <VStack spacing={2} align="stretch">
          <Box as="section" pt="20" pb="2" position="relative">
            <Box position="absolute" inset="0" height="32" bg="brand.600" />

            <CardWithAvatar
              maxW="2xl"

              avatarProps={{
                src: breederUser?.profile_photo_url,
                name: breederProfile?.kennel_name,
              }}
              action={
                isManaging ? <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<FiEdit />}
                  onClick={() => { }}
                >
                  Edit
                </Button> : null
              }
            >
              <CardContent>
                <Heading size="md" fontWeight="bold" letterSpacing="tight">
                  {breederProfile && breederProfile?.kennel_name}
                </Heading>
                <Text color={useColorModeValue("gray.600", "gray.400")}>
                  {breederUser && breederUser?.email}
                </Text>

                <UserInfo
                  location={breederProfile?.kennel_location}
                  website="doghouse.co.ke"
                  memberSince={new Date(
                    breederUser?.created_at
                  ).toDateString()}
                />
              </CardContent>
            </CardWithAvatar>

          </Box>


          <Tabs variant="soft-rounded" colorScheme="brand">
            <TabList>
              <Tab>

                <HStack spacing={2}>
                  {/* <Icon as={LuDog} /> */}

                  <Text>Breeds ({breederBreeds?.length || 0})</Text>
                </HStack>
              </Tab>
              <Tab>


                <HStack spacing={2}>
                  {/* <Icon as={LuDog} /> */}

                  <Text>Pets ({breederListings?.length || 0})</Text>
                </HStack>

              </Tab>
              <Tab>
                <HStack spacing={2}>
                  {/* <Icon as={LuDog} /> */}

                  <Text>
                    Adoptions
                  </Text>
                </HStack>
              </Tab>
              <Tab>

                <HStack spacing={2}>
                  {/* <Icon as={LuDog} /> */}

                  <Text>Reviews</Text>
                </HStack>
              </Tab>
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
