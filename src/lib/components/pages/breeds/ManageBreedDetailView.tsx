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
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { BreedForm } from "../../ui/BreedForm";
import ListingForm from "../listings/ListingForm";
import { useDeleteUserBreed, useUserBreed } from "lib/hooks/queries/useUserBreeds";
import { useListingsForUserBreed } from "lib/hooks/queries/useListings";
import { Loader } from "lib/components/ui/Loader";
import { BreedersList } from "../../ui/BreederList";
import { FiEdit } from "react-icons/fi";
import { Gallery } from "lib/components/ui/GalleryWithCarousel/Gallery";
import ListingList from "lib/components/ui/ListingList";
import { PageHeaderWithTwoButtons } from "lib/components/ui/PageHeaderWithTwoButtons";
import { useBreedersForBreed } from "lib/hooks/queries";
import { useCurrentUser } from "lib/hooks/queries/useAuth";

interface Breed {
  id: string;
  name: string;
  description?: string;
  group?: string;
  featured_image_url?: string;
}

const ManageBreedDetailView = () => {
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const toast = useToast();
  const { data: user } = useCurrentUser();

  const { id } = router.query;
  const {
    data: userBreed,
    isLoading: isLoadingUserBreed,
    error: userBreedError,
  } = useUserBreed(id as string);
  const { data: listingsForBreed, isLoading: isLoadingListings, error } = useListingsForUserBreed(userBreed?.id);
  const { data: breeders, isLoading: isLoadingBreeders, error: breedersError } = useBreedersForBreed(userBreed?.breed_id as string);


  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isListingFormOpen, onOpen: onListingFormOpen, onClose: onListingFormClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

  const deleteUserBreed = useDeleteUserBreed();

  const activeListings = listingsForBreed?.filter((listing) => listing.status !== "sold");

  const handleListingClick = (listingId: string) => {
    router.push(`/dashboard/kennel/listings/${listingId}`);
  };

  const handleDeleteBreed = async () => {
    try {
      await deleteUserBreed.mutateAsync(userBreed?.id as string);
      toast({
        title: "Breed deleted",
        description: "Your breed has been deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push("/dashboard/kennel/");
    } catch (error) {
      console.error("Error deleting breed:", error);
    }
  };

  if (isLoadingListings || isLoadingUserBreed || isLoadingBreeders) {
    return (
      <Loader />
    );
  }

  if (error || userBreedError || breedersError) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error loading breed data. Please try again later.
        {error.message}
      </Alert>
    );
  }

  return (
    <Container maxW="7xl" py={{ base: 4, md: 0 }} >
      <VStack spacing={6} align="stretch">

        <VStack align="stretch" spacing={{ base: 4, md: 6 }}>

          <PageHeaderWithTwoButtons
            title={`Manage ${userBreed?.breeds.name}`}
            description={`Manage your ${userBreed?.breeds.name}'s breed information, photos, and availability.`}
            buttonPrimary={{
              label: "Edit",
              onClick: onFormOpen,
              icon: <FiEdit />,
              colorScheme: "brand",
            }}
            buttonSecondary={{
              label: "Delete",
              onClick: onDeleteOpen,
              icon: <DeleteIcon />,
              colorScheme: "red",
              isLoading: deleteUserBreed.isPending,
            }}
          />

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <Gallery images={userBreed.images?.map((image) => ({ src: image, alt: userBreed.breeds.name })) || []} />

            <Tabs variant='soft-rounded' colorScheme='brand'

            >
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
                <Tab>Overview</Tab>
                <Tab>Listings</Tab>
                <Tab>Adoptions</Tab>
                <Tab>Other Breeders</Tab>

              </TabList>

              <TabPanels>

                <TabPanel px={0}>
                  <ListingList
                    listings={listingsForBreed}
                    onListingClick={handleListingClick}
                    emptyMessage="No Listings Added"
                    emptyDescription="Add a listing to your breed."
                    showEmptyAction={true}
                    onEmptyAction={onListingFormOpen}
                    emptyActionLabel="Add Listing"
                    onAdd={onListingFormOpen}
                  />
                </TabPanel>

                <TabPanel px={0}>
                  <BreedersList
                    breeders={breeders}
                    emptyMessage="No Other Breeders Found"
                    emptyDescription="No other breeders are currently offering this breed."
                    emptyAction={undefined}
                    columns={{ base: 1, md: 2, lg: 1 }}
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

        <ListingForm
          isOpen={isListingFormOpen}
          onClose={onListingFormClose}
          userBreeds={[userBreed]} // Pass the current breed as the only option
          userProfile={user || null} // Optional, depending on form needs
          isEditing={false}
          preselectedBreedId={userBreed?.id}
        />
      </VStack>


      <AlertDialog isCentered isOpen={isDeleteOpen} leastDestructiveRef={undefined} onClose={onDeleteClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Breed
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this breed? This action cannot be undone.

              {activeListings.length > 0 && (
                <Alert status="warning" mt={4}>
                  <AlertIcon />
                  This breed has {activeListings.length} active listings. Deleting this breed will also delete these listings.
                </Alert>
              )}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onDeleteClose}>Cancel</Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteBreed}
                ml={3}
                isLoading={deleteUserBreed.isPending}
              >
                Delete Breed
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default ManageBreedDetailView;
