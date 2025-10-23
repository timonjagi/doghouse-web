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
  Stack,
} from "@chakra-ui/react";
import { useUserProfile } from "../../../../hooks/queries/useUserProfile";
import { useUserBreedsFromUser } from "../../../../hooks/queries/useUserBreeds";
import { BreedList } from "./BreedList";
import { BreedForm } from "./BreedForm";
import { AddIcon } from "@chakra-ui/icons";
import { Loader } from "lib/components/ui/Loader";
import { NextSeo } from "next-seo";

const DashboardBreedsPage = () => {

  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();

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
      <NextSeo title="Manage Breeds " />

      <Box>
        <UserBreeds userProfile={userProfile} onFormOpen={onFormOpen} />

        <BreedForm
          isOpen={isFormOpen}
          onClose={onFormClose}
        />
      </Box>
    </Container>
  );
};

const UserBreeds = ({ userProfile, onFormOpen }) => {

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
      <Container maxW="7xl" >
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
      <Stack>
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
        <Box maxW="xl">
          <Text color="gray.600" >
            View and manage your breeds. Add, edit, and delete breeds as needed.
          </Text>
        </Box>

      </Stack>

      <BreedList
        breeds={userBreeds as []}
        userRole="breeder"
        onEditBreed={onFormOpen}
      />
    </VStack>
  )
}

export default DashboardBreedsPage;
