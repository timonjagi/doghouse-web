import {
  Container,
  Heading,
  Text,
  VStack,
  Center,
  Alert,
  AlertIcon,
  Box,
  Stack,
} from "@chakra-ui/react";
import { Loader } from "lib/components/ui/Loader";
import { BreedList } from "../manage/BreedList";
import { useAllAvailableUserBreeds } from "lib/hooks/queries/useUserBreeds";

const DashboardBrowsePage = () => {
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
    <Container maxW="7xl" py={8} px={0}>
      <Box>
        <VStack spacing={6} align="stretch">

          <Stack>
            <Heading size={{ base: "sm", lg: "md" }} color="brand.500">
              Browse Available Breeds
            </Heading>
            <Text color="gray.600">
              Explore dog breeds available from verified breeders in your area.
            </Text>
          </Stack>

          <BreedList
            breeds={allAvailableBreeds || []}
            userRole="seeker"
          />
        </VStack>
      </Box>
    </Container>
  );
};

export default DashboardBrowsePage;
