import {
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  useDisclosure,
  useToast,
  ButtonGroup,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Alert,
  AlertIcon,
  useBreakpointValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Icon,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { BreedForm } from "../../ui/BreedForm";
import { useDeleteUserBreed, useUserBreed } from "lib/hooks/queries/useUserBreeds";
import { useListingsForUserBreed } from "lib/hooks/queries/useListings";
import { Loader } from "lib/components/ui/Loader";
import { BreedersList } from "../../ui/BreederList";
import { FiEdit, FiHeart, FiInfo, FiShoppingBag } from "react-icons/fi";
import { Gallery } from "lib/components/ui/GalleryWithCarousel/Gallery";
import ListingList from "lib/components/ui/ListingList";
import EthicalQuestionairreCard from "lib/components/ui/EthicalQuestionairreCard";
import { useBreederProfile } from "lib/hooks/queries/useBreederProfile";
import { GiDogHouse } from "react-icons/gi";
import { BreederCard } from "lib/components/ui/BreederCard";
import { BreederCard as BreederCard2 } from "lib/components/ui/BreederCard2";
import { useBreedersForBreed } from "lib/hooks/queries/useBreeders";

interface Breed {
  id: string;
  name: string;
  description?: string;
  group?: string;
  featured_image_url?: string;
}

const ExploreUserBreedDetailView = () => {
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const toast = useToast();

  const { userBreedId } = router.query;
  const {
    data: userBreed,
    isLoading: isLoadingUserBreed,
    error: userBreedError,
  } = useUserBreed(userBreedId as string);

  const { data: listingsForBreed, isLoading: isLoadingListings, error } = useListingsForUserBreed(userBreed?.id);

  const { data: breederProfile, isLoading: breederLoading, error: breederError } = useBreederProfile(userBreed?.user_id as string);

  const { data: otherBreeders, isLoading: isLoadingOtherBreeders, error: otherBreedersError } = useBreedersForBreed(userBreed?.breeds.id);


  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();

  const activeListings = listingsForBreed?.filter((listing) => listing.status !== "sold");
  const pastListings = listingsForBreed?.filter((listing) => listing.status === "sold");

  const handleListingClick = (listingId: string) => {
    router.push(`/dashboard/listings/${listingId}`);
  };

  const onAddToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: "You will be notified when new listings are added.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  }


  if (isLoadingListings || isLoadingUserBreed) {
    return (
      <Loader />
    );
  }

  if (error || userBreedError) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error loading breed data. Please try again later.
        {error.message}
      </Alert>
    );
  }

  return (
    <>
      <Container maxW="7xl" py={{ base: 4, md: 0 }} >
        <VStack spacing={6} align="stretch">


          <Heading
            size={{ base: "xs", md: "sm" }}
            textTransform="capitalize"
          >
            {userBreed?.breeds.name}
          </Heading>


          <VStack align="stretch" spacing={{ base: 4, md: 6 }}>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <Gallery images={userBreed?.images?.map((image) => ({ src: image, alt: userBreed.breeds.name })) || []} />

              <Tabs variant='soft-rounded' colorScheme='brand'>
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
                  <Tab><HStack><Icon as={FiInfo} /><Text>Overview</Text></HStack></Tab>
                  <Tab><HStack><Icon as={FiShoppingBag} /><Text>Active Listings</Text></HStack></Tab>
                  <Tab><HStack><Icon as={FiShoppingBag} /><Text>Past Listings</Text></HStack></Tab>
                  <Tab><HStack><Icon as={GiDogHouse} /><Text>Other Breeders</Text></HStack></Tab>
                </TabList>

                <TabPanels>
                  <TabPanel px={0}>
                    <BreederCard2
                      breeder={breederProfile}


                    />
                    {/* 
                    <BreederCard
                      breeder={breederProfile}


                    /> */}
                  </TabPanel>

                  <TabPanel px={0}>
                    <ListingList
                      listings={activeListings}
                      onListingClick={handleListingClick}
                      emptyMessage={`No active ${userBreed?.breeds.name} listings found`}
                      emptyDescription={`To get notified when new ${userBreed?.breeds.name}s become available, add ${breederProfile?.kennel_name}'s ${userBreed?.breeds.name} to wishlist.`}
                      showEmptyAction={true}
                      onEmptyAction={onAddToWishlist}
                      emptyActionLabel="Add to Wishlist"
                      emptyActionIcon={<FiHeart />}
                    />
                  </TabPanel>

                  <TabPanel px={0}>
                    <ListingList
                      listings={pastListings}
                      onListingClick={handleListingClick}
                      emptyMessage={`No past listings found for this breed`}
                      emptyDescription={`To get notified when new ${userBreed?.breeds.name}s become available, add ${breederProfile?.kennel_name}'s ${userBreed?.breeds.name} to wishlist.`}
                      showEmptyAction={true}
                      onEmptyAction={onAddToWishlist}
                      emptyActionLabel="Add to Wishlist"
                      emptyActionIcon={<FiHeart />}
                    />
                  </TabPanel>
                  <TabPanel px={0}>
                    <BreedersList
                      breed={otherBreeders}
                      emptyMessage={`No other ${userBreed?.breeds.name} breeders found`}
                      emptyDescription={`To get notified when new ${userBreed?.breeds.name} breeders are added, add ${userBreed?.breeds.name} to wishlist.`}
                      emptyActionLabel={`Add to Wishlist`}
                      emptyActionIcon={<FiHeart />}
                      emptyAction={onAddToWishlist}
                      columns={{ base: 1, md: 2, xl: 3 }}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>

            </SimpleGrid>

          </VStack>


          <BreedForm
            isOpen={isFormOpen}
            onClose={onFormClose}
            editingBreed={userBreed}
          />

          {!isMobile && <EthicalQuestionairreCard />}

        </VStack>


      </Container>

      {isMobile && <EthicalQuestionairreCard />}
    </>
  );
};

export default ExploreUserBreedDetailView;
