import {
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  useDisclosure,
  Alert,
  AlertIcon,
  Box,
  Stack,
} from "@chakra-ui/react";
import { useUserBreedsFromUser } from "../../../hooks/queries/useUserBreeds";
import { BreedList } from "./BreedList";
import { BreedForm } from "./BreedForm";
import { AddIcon } from "@chakra-ui/icons";
import { Loader } from "lib/components/ui/Loader";
import { NextSeo } from "next-seo";

const DashboardBreedsPage = ({ userProfile }) => {
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();

  return (
    <Container maxW="7xl" >
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

  if (isLoadingUserBreeds) {
    return (
      <Loader />
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
        <HStack justify="space-between" align="center" wrap="wrap">
          <Box maxW="xl">
            <Heading size={{ base: "sm", lg: "md" }}>
              Manage Breeds
            </Heading>
            <Text color="gray.600" >
              View and manage your breeds. Add, edit, and delete breeds as needed.
            </Text>
          </Box>

          <Button
            leftIcon={<AddIcon />}
            colorScheme="brand"
            onClick={onFormOpen}
            size="md"
          >
            Add Breed
          </Button>
        </HStack>

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
