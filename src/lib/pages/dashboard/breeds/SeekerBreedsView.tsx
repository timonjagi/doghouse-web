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
import { BreedList } from "./BreedList";
import { useAllAvailableUserBreeds } from "lib/hooks/queries/useUserBreeds";
import { NextSeo } from "next-seo";

const DashboardBrowsePage = ({ userProfile }) => {
  const {
    data: allAvailableBreeds,
    isLoading: isLoadingAvailableBreeds,
    error: availableBreedsError
  } = useAllAvailableUserBreeds()

  if (isLoadingAvailableBreeds) {
    return (
      <Loader />
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
    <Box>
      <VStack spacing={6} align="stretch">

        <Stack>
          <Heading size={{ base: "sm", lg: "md" }} color="brand.500">
            Browse  Breeds
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
  );
};

export default DashboardBrowsePage;
