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
} from "@chakra-ui/react";
import { ChevronRightIcon, EditIcon, ArrowBackIcon, DeleteIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useRef } from "react";
import { BreedForm } from "./BreedForm";
import { useDeleteUserBreed } from "lib/hooks/queries/useUserBreeds";
import { BreedListings } from "../browse/BreedListings";

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

      handleBack();
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


  const handleBack = () => {
    router.push("/dashboard/breeds");
  };

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Breadcrumb */}
        <HStack spacing={2}>
          <Button
            leftIcon={<ArrowBackIcon />}
            variant="ghost"
            onClick={handleBack}
            p={0}
            m={0}
          >
            <Text color="gray.600">breeds</Text>
          </Button>

          <ChevronRightIcon color="gray.400" />
          <Text color="gray.600">{userBreed?.breeds.name}</Text>
        </HStack>

        {/* Role-based content */}
        <VStack spacing={6} align="stretch">
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between" align="center">
              <Heading size={{ base: 'sm', lg: 'md' }} color="brand.500">
                Manage {userBreed?.breeds.name}
              </Heading>

              <ButtonGroup>
                <Button
                  leftIcon={<EditIcon />}
                  colorScheme="brand"
                  onClick={onFormOpen}
                >
                  Edit
                </Button>
                <Button
                  leftIcon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={handleDelete}
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

          {/* Breed Images */}
          {userBreed?.images && userBreed.images.length > 0 && (
            <Card>
              <CardHeader>
                <Heading size="md">Breed Photos</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
                  {userBreed.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`${userBreed.breeds.name} ${index + 1}`}
                      borderRadius="md"
                      objectFit="cover"
                      height="150px"
                    />
                  ))}
                </SimpleGrid>
              </CardBody>
            </Card>
          )}

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

          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                  Delete Breed
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure? You can't undo this action afterwards.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme='red' onClick={handleDelete} ml={3}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </VStack>
      </VStack>
    </Container>
  );
};

