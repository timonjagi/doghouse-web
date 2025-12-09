import React, { useEffect, useState } from 'react';
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
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
  ModalCloseButton,
  ModalOverlay,
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
import { FiBell, FiEdit, FiEdit2, FiEdit3, FiLogOut, FiPlus, FiShoppingBag, FiStar, FiUserPlus } from 'react-icons/fi';
import { LuDog } from 'react-icons/lu';
import { useCurrentUser } from 'lib/hooks/queries/useAuth';
import { KennelForm } from '../../ui/KennelForm';
import { BreedList, UserBreedWithBreed } from 'lib/components/ui/BreedList';
import ListingList from 'lib/components/ui/ListingList';
import { UserBreed } from 'lib/db/schema';

interface BreederDetailPageProps {
}

const BreederDetailPage: React.FC<BreederDetailPageProps> = () => {
  const toast = useToast();
  const router = useRouter();
  const [breederId, setBreederId] = useState<string | null>(null);


  const { data: user } = useCurrentUser();


  useEffect(() => {

    const id = router.query.id as string;
    if (id) {
      setBreederId(id);
    }

    if (!id && user?.id) {
      setBreederId(user.id);
    }
  }, [user, router.query]);


  const { isOpen, onOpen, onClose } = useDisclosure();
  // Fetch breeder data
  const { data: breederProfile, isLoading: breederLoading, error: breederError } = useBreederProfile(breederId as string);
  const { data: breederUser, isLoading: breederUserLoading, error: breederUserError } = useUserProfileById(breederId as string);

  // Fetch breeder's breeds and listings
  const { data: breederBreeds, isLoading: breedsLoading } = useUserBreedsFromUser(breederId as string);
  const { data: breederListings, isLoading: listingsLoading } = useListingsByOwner(breederId as string);

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

  const handleSubscribeClick = () => {
    // For now, just show a toast. In the future, this could open a contact form
    toast({
      title: 'Subscribe feature coming soon',
      description: 'Subscribing to breeders will be available soon.',
      status: 'info',
      duration: 3000,
    });
  };

  const handleBreedClick = (b: UserBreedWithBreed) => {
    router.push(`/dashboard/breeders/${breederId}/breeds/${b?.id}`);
  };

  const handleListingClick = async (listingId: string) => {
    // Increment view count
    try {
      if (!isManaging) {
        await incrementViewsMutation.mutateAsync(listingId);
      }
    } catch (error) {
      console.error('Failed to increment views:', error);
    }

    // Navigate to detail page
    return isManaging ? router.push(`/dashboard/kennel/listings/${listingId}`) : router.push(`/dashboard/listings/${listingId}`);
  };

  const formatFacilityType = (facilityType: string) => {
    return breederProfile.facility_type.charAt(0).toUpperCase() + breederProfile.facility_type.slice(1).replace('_', ' ').replace('facility', '')
  }
  return (
    <>

      <Container maxW="7xl" py={{ base: 4, md: 0 }}>

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
                  onClick={() => onOpen()}
                >
                  Edit
                </Button> : <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<FiBell />}
                  onClick={() => onOpen()}
                >
                  Subscribe
                </Button>
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
                  website="pethouse.co.ke"
                  memberSince={new Date(
                    breederUser?.created_at
                  ).toDateString()}
                />
              </CardContent>
            </CardWithAvatar>

          </Box>


          <Tabs variant="soft-rounded" colorScheme="brand">
            <TabList
              overflowY="hidden"
              whiteSpace="nowrap"
              css={{
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                scrollbarWidth: 'none',
              }}
            >
              <Tab>

                <HStack spacing={2}>
                  <Icon as={LuDog} />

                  <Text>Breeds ({breederBreeds?.length || 0})</Text>
                </HStack>
              </Tab>
              <Tab>


                <HStack spacing={2}>
                  <Icon as={FiShoppingBag} />

                  <Text>Listings ({breederListings?.length || 0})</Text>
                </HStack>

              </Tab>
              {isManaging && <Tab>
                <HStack spacing={2}>
                  <Icon as={FiUserPlus} />

                  <Text>
                    Adoptions
                  </Text>
                </HStack>
              </Tab>
              }
              <Tab>

                <HStack spacing={2}>
                  <Icon as={FiStar} />

                  <Text>Reviews</Text>
                </HStack>
              </Tab>
            </TabList>

            <TabPanels>
              {/* Breeds Tab */}
              <TabPanel px={0}>
                <BreedList
                  breeds={breederBreeds}
                  userRole={user?.role as 'seeker' | 'breeder' | 'admin'}
                  columns={{ base: 2, md: 3, lg: 4 }}
                  onBreedClick={(userBreed: UserBreed) => handleBreedClick(userBreed)}
                />
              </TabPanel>

              {/* Listings Tab */}
              <TabPanel px={0}>
                <ListingList
                  listings={breederListings}
                  onListingClick={handleListingClick}
                  emptyMessage={isManaging ? "No listings added" : "No listings found"}
                  emptyDescription={isManaging ? "Add listings to your kennel to display them here." : `Subscribe to ${breederProfile?.kennel_name} to get notified when they add new listings.`}
                  showEmptyAction={true}
                  onEmptyAction={isManaging ? () => router.push(`/dashboard/kennel`) : handleSubscribeClick}
                  emptyActionLabel={isManaging ? "Add Listing" : "Subscribe"}
                  emptyActionIcon={isManaging ? <FiPlus /> : <FiBell />}
                  columns={{ base: 2, md: 3, lg: 4 }}
                />
              </TabPanel>

              {/* Breeder's Adoptions Tab */}
              <TabPanel px={0}>

              </TabPanel>

              {/* Reviews Tab */}
              <TabPanel px={0}>

              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>

        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="md"

          isCentered
        >
          <ModalCloseButton />
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Update Kennel Details
            </ModalHeader>
            <ModalBody>
              <KennelForm
                breederProfile={breederProfile}
                userProfile={breederUser}
                onClose={onClose}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </>
  );
};

export default BreederDetailPage;
