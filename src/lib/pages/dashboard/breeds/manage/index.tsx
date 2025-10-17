import {
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  useDisclosure,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Box,
} from "@chakra-ui/react";
import { useUserProfile } from "../../../hooks/queries/useUserProfile";
import { useUserBreedsFromUser } from "../../../hooks/queries/useUserBreeds";
import { useAllAvailableUserBreeds } from "../../../hooks/queries/useAvailableBreeds";
import { BreedList } from "./BreedList";
import { BreedForm } from "./BreedForm";
import { AddIcon } from "@chakra-ui/icons";
import { Loader } from "lib/components/ui/Loader";

const DashboardBreedsPage = () => {

  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();

  const userRole = userProfile?.role;

  if (isLoadingProfile) {
    return (
      <Container maxW="7xl" py={8}>
        <Center height="200px">
          <Spinner size="xl" color="brand.500" />
        </Center>
      </Container>
    );
  }

  return (
    <Container maxW="7xl" py={8} px={0}>
      <Box>
        {userRole === 'breeder' ? (
          <BreederBreeds userProfile={userProfile} onFormOpen={onFormOpen} />
        ) : (
          <SeekerBreeds />
        )}
        <BreedForm
          isOpen={isFormOpen}
          onClose={onFormClose}
        />
      </Box>
    </Container>
  );
};

const BreederBreeds = ({ userProfile, onFormOpen }) => {

  const {
    data: userBreeds,
    isLoading: isLoadingUserBreeds,
    error: userBreedsError
  } = useUserBreedsFromUser(userProfile.id);

  console.log(userBreeds);
  if (isLoadingUserBreeds) {
    return (
      <Container maxW="7xl">
        <Center height="200px">
          <Loader />
        </Center>
      </Container>
    );
  }

  if (userBreedsError) {
    return (
      <Container maxW="7xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          Error loading breeds data. Please try again later.
          {userBreedsError.message}
        </Alert>
      </Container>
    );
  }
  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between" align="center">
        <Heading size={{ base: "sm", lg: "md" }} color="brand.500">
          Manage Breeds
        </Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="brand"
          onClick={onFormOpen}
          size="md"
        >
          Add Breed
        </Button>
      </HStack>
      <Text color="gray.600">
        Manage the dog breeds you offer. Add new breeds, update information, and track inquiries for each breed.
      </Text>
      <BreedList
        breeds={userBreeds as []}
        userRole="breeder"
        onEditBreed={onFormOpen}
      />
    </VStack>
  )
}

const SeekerBreeds = () => {

  const {
    data: allAvailableBreeds,
    isLoading: isLoadingAvailableBreeds,
    error: availableBreedsError
  } = useAllAvailableUserBreeds()

  if (isLoadingAvailableBreeds) {
    return (
      <Container maxW="7xl" py={8}>
        <Center height="200px">
          <Loader />
        </Center>
      </Container>
    );
  }

  if (availableBreedsError) {
    return (
      <Container maxW="7xl">
        <Alert status="error">
          <AlertIcon />
          Error loading breeds data. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Heading size={{ base: "sm", lg: "md" }} color="brand.500">
        Browse Available Breeds
      </Heading>
      <Text color="gray.600">
        Explore dog breeds available from verified breeders in your area.
      </Text>
      <BreedList
        breeds={allAvailableBreeds || []}
        userRole="seeker"
      />
    </VStack>
  )
}
export default DashboardBreedsPage;
