import {
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Image,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Avatar,
  Box,
  Icon,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Alert,
  AlertIcon,
  Spinner,
  Center,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  IconButton,
  ButtonGroup,
} from "@chakra-ui/react";
import { ChevronRightIcon, EditIcon, ArrowBackIcon, DeleteIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
import { BreedForm } from "./BreedForm";
import { useBreedersForBreed, useListingsForBreed } from "lib/hooks/queries/useAvailableBreeds";
import { useDeleteUserBreed } from "lib/hooks/queries/useUserBreed";

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

interface BreedDetailViewProps {
  userBreed?: UserBreed | null;
  userRole?: string;
}

export const BreedDetailView = ({
  userBreed,
  userRole
}: BreedDetailViewProps) => {
  const router = useRouter();
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { data: breedersForBreed, isLoading: isLoadingBreeders } = useBreedersForBreed(userBreed.breed_id);
  const { data: listingsForBreed, isLoading: isLoadingListings } = useListingsForBreed(userBreed.breed_id);

  const deleteUserBreed = useDeleteUserBreed();
  const cancelRef = useRef()

  const handleBack = () => {
    router.push("/dashboard/breeds");
  };

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

  const renderBreederView = () => (
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
    </VStack>
  );

  const renderSeekerView = () => (
    <VStack spacing={6} align="stretch">
      <VStack align="stretch" spacing={4}>
        <Heading size="lg" color="brand.500">
          {userBreed?.breeds.name}
        </Heading>

        {userBreed.breeds?.description && (
          <Text color="gray.600">{userBreed.breeds?.description}</Text>
        )}

        <HStack spacing={2}>
          {userBreed.breeds?.group && (
            <Badge colorScheme="purple">{userBreed.breeds?.group}</Badge>
          )}
          <Badge colorScheme="green">Available</Badge>
        </HStack>
      </VStack>

      {/* Breeders Offering This Breed */}
      <Card>
        <CardHeader>
          <Heading size="md">Breeders Offering {userBreed?.breeds.name}</Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {breedersForBreed.map((breeder) => (
              <Card key={breeder.id} size="sm" variant="outline">
                <CardBody>
                  <HStack spacing={4}>
                    <Avatar src={breeder.users[0].profile_photo_url} name={breeder.breeder_profiles[0].kennel_name} />
                    <VStack align="start" spacing={1} flex={1}>
                      <Text fontWeight="medium">{breeder.breeder_profiles[0].kennel_name}</Text>
                      <Text fontSize="sm" color="gray.600">{breeder.breeder_profiles[0].kennel_location}</Text>
                      <HStack>
                        <HStack spacing={1}>
                          <Icon as={FaStar} color="yellow.400" />
                          <Text fontSize="sm">{breeder.breeder_profiles[0].rating}</Text>
                        </HStack>
                        {/* <Text fontSize="sm" color="gray.500">
                          ({breeder.breeder_profiles[0].reviewCount} reviews)
                        </Text> */}
                      </HStack>
                    </VStack>
                    <Button size="sm" colorScheme="brand">
                      Contact
                    </Button>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

    </VStack>
  );

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
        {userRole === 'breeder' ? renderBreederView() : renderSeekerView()}


        <Card>
          <CardHeader>
            <Heading size="md">{userRole === 'seeker' ? 'Available' : 'Current'} Listings</Heading>
          </CardHeader>
          <CardBody>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {listingsForBreed?.map((listing) => (
                <Card key={listing.id} size="sm" variant="outline">
                  <CardBody>
                    <VStack align="stretch" spacing={3}>
                      <Image
                        src={listing.photos[0].url}
                        alt={listing.title}
                        borderRadius="md"
                        objectFit="cover"
                        height="120px"
                      />
                      <VStack align="stretch" spacing={1}>
                        <Text fontWeight="medium" fontSize="sm">
                          {listing.title}
                        </Text>
                        <Text color="brand.500" fontWeight="bold">
                          {listing.price}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          {listing.location_text}
                        </Text>
                      </VStack>
                      <Button size="sm" colorScheme="brand" width="full">
                        View Details
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>

        <BreedForm
          isOpen={isFormOpen}
          onClose={onFormClose}
          userRole={userRole}
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
    </Container>
  );
};
