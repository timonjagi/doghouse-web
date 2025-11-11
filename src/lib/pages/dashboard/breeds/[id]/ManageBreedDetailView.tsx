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
} from "@chakra-ui/react";
import { ArrowBackIcon, DeleteIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { BreedForm } from "../BreedForm";
import { useDeleteUserBreed, useUserBreed } from "lib/hooks/queries/useUserBreeds";
import { BreedListings } from "../BreedListings";
import { useListingsForUserBreed } from "lib/hooks/queries/useListings";
import { Loader } from "lib/components/ui/Loader";

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
    <Container maxW="7xl" >
      {isMobile && <Button
        leftIcon={<ArrowBackIcon />}
        variant="ghost"
        onClick={() => router.back()}
        my={4}
        px={0}
      >
        Back to Manage Breeds
      </Button>}


      <VStack spacing={6} align="stretch">

        <VStack align="stretch" spacing={1}>
          <HStack justify="space-between" align="center">
            <Heading size={{ base: 'sm', lg: 'md' }}>
              Manage {userBreed?.breeds.name}
            </Heading>

            <ButtonGroup>

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

          <Text color="gray.600">
            Manage your {userBreed?.breeds.name} breed information, photos, and availability.
          </Text>
        </VStack>


        <Tabs variant='soft-rounded' colorScheme='brand'>
          <TabList>
            <Tab>Photos</Tab>

            <Tab>Listings</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              {/* Breed Images */}
              {userBreed?.images && userBreed.images.length > 0 && (
                <Card>

                  <CardBody>
                    <SimpleGrid columns={{ base: 2, lg: 3 }} spacing={4}>
                      {userBreed.images.map((image, index) => (
                        <Image
                          key={index}
                          src={image}
                          alt={`${userBreed.breeds.name} ${index + 1}`}
                          borderRadius="md"
                          objectFit="cover"
                          height="200px"
                        />
                      ))}
                    </SimpleGrid>
                  </CardBody>
                </Card>
              )}
            </TabPanel>

            <TabPanel px={0}>
              <BreedListings listings={listingsForBreed} loading={isLoadingListings} error={error} isManaging={true} />
            </TabPanel>
          </TabPanels>
        </Tabs>



        {/* Breed Notes */}
        {userBreed?.notes && (
          <Card>
            <CardHeader>
              <Heading size="md">Notes</Heading>
            </CardHeader>
            <CardBody>
              <Text color="gray.600">{userBreed.notes}</Text>
            </CardBody>
          </Card>
        )}

        <BreedForm
          isOpen={isFormOpen}
          onClose={onFormClose}
          editingBreed={userBreed}
        />
      </VStack>


      <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={undefined} onClose={onDeleteClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Breed
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this breed? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onDeleteClose}>Cancel</Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteBreed}
                ml={3}
                isLoading={deleteUserBreed.isPending}
              >
                Delete Listing
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

