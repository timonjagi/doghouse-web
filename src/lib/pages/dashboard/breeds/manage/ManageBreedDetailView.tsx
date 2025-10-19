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
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  ButtonGroup,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { ChevronRightIcon, EditIcon, ArrowBackIcon, DeleteIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useRef } from "react";
import { BreedForm } from "./BreedForm";
import { useDeleteUserBreed } from "lib/hooks/queries/useUserBreeds";
import { BreedListings } from "../browse/BreedListings";
import { useListingsForUserBreed } from "lib/hooks/queries/useListings";

interface Breed {
  id: string;
  name: string;
  description?: string;
  group?: string;
  featured_image_url?: string;
}

interface UserBreed {
  id: string;
  breed_id: string;
  is_owner: boolean;
  notes?: string;
  images?: any;
  created_at: any;
  updated_at: any;
  breeds?: Breed;
}

interface ManageBreedDetailViewProps {
  userBreed?: UserBreed | null;
  userRole?: string;
}

export const ManageBreedDetailView = ({
  userBreed,
}: ManageBreedDetailViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure()

  const deleteUserBreed = useDeleteUserBreed();
  const cancelRef = useRef()

  const { data: listingsForBreed, isLoading: isLoadingListings, error } = useListingsForUserBreed(userBreed?.id);

  const handleDelete = async () => {
    try {
      await deleteUserBreed.mutateAsync(userBreed.id);

      toast({
        title: "Success",
        description: "Breed removed successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      router.replace('/dashboard/breeds/manage');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove breed. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };


  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={6} align="stretch">
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between" align="center">
            <Heading size={{ base: 'sm', lg: 'md' }} color="brand.500">
              Manage {userBreed?.breeds.name}
            </Heading>

            <ButtonGroup>

              <Button
                leftIcon={<DeleteIcon />}
                colorScheme="red"
                onClick={onOpen}
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
                    <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
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
    </Container>
  );
};

