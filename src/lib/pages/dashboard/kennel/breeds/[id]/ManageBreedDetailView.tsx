import {
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Image,
  Button,
  Card,
  CardBody,
  CardHeader,
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
  Skeleton,
} from "@chakra-ui/react";
import { ArrowBackIcon, DeleteIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { BreedForm } from "../BreedForm";
import { useDeleteUserBreed, useUserBreed } from "lib/hooks/queries/useUserBreeds";
import { BreedListings } from "../BreedListings";
import { useListingsForUserBreed } from "lib/hooks/queries/useListings";
import { Loader } from "lib/components/ui/Loader";
import { BreedersList } from "../BreederList";
import { FiEdit } from "react-icons/fi";
import { Gallery } from "lib/components/ui/GalleryWithCarousel/Gallery";

interface Breed {
  id: string;
  name: string;
  description?: string;
  group?: string;
  featured_image_url?: string;
}

export const ManageBreedDetailView = () => {
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const toast = useToast();

  const { id } = router.query;
  const {
    data: userBreed,
    isLoading: isLoadingUserBreed,
    error: userBreedError,
  } = useUserBreed(id as string);
  const { data: listingsForBreed, isLoading: isLoadingListings, error } = useListingsForUserBreed(userBreed?.id);


  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

  const deleteUserBreed = useDeleteUserBreed();

  const activeListings = listingsForBreed?.filter((listing) => listing.status !== "sold");

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
      router.push("/dashboard/breeds");
    } catch (error) {
      console.error("Error deleting breed:", error);
    }
  };

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
    <Container maxW="7xl" py={{ base: 4, md: 0 }} >
      {isMobile && <Button
        leftIcon={<ArrowBackIcon />}
        variant="ghost"
        onClick={() => router.back()}
        px={0}
      >
        Back to Manage Breeds
      </Button>}


      <VStack spacing={6} align="stretch">

        <VStack align="stretch" spacing={{ base: 4, md: 6 }}>
          <HStack justify="space-between" align="center" wrap="wrap">
            <Box>
              <Heading size={{ base: 'sm', lg: 'md' }}>
                Manage {userBreed?.breeds.name}
              </Heading>
              <Text color="gray.600">
                Manage your {userBreed?.breeds.name}'s breed information, photos, and availability.
              </Text>
            </Box>

            <ButtonGroup>
              <Button
                onClick={onFormOpen}
                colorScheme="brand"
                leftIcon={<FiEdit />}
              >
                Edit
              </Button>

              <Button
                leftIcon={<DeleteIcon />}
                colorScheme="red"
                onClick={onDeleteOpen}
                isLoading={deleteUserBreed.isPending}
              >
                Delete
              </Button>
            </ButtonGroup>


          </HStack>


          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <Gallery images={userBreed.images?.map((image) => ({ src: image, alt: userBreed.breeds.name })) || []} />



            <Tabs variant='soft-rounded' colorScheme='brand'>
              <TabList>

                <Tab>Listings</Tab>
                <Tab>Other Breeders</Tab>

              </TabList>

              <TabPanels>

                <TabPanel px={0}>
                  <BreedListings listings={listingsForBreed} loading={isLoadingListings} error={error} isManaging={true} />
                </TabPanel>

                <TabPanel px={0}>
                  <BreedersList breed={userBreed?.breeds} userRole="breeder" />
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

