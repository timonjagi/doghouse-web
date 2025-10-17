import { Card, CardHeader, Heading, CardBody, SimpleGrid, VStack, Button, Image, Text, Alert, AlertIcon, Center } from "@chakra-ui/react";
import { Loader } from "lib/components/ui/Loader";
import { useListingsForBreed } from "lib/hooks/queries/useListings";

export const BreedListings = ({ breedId }) => {

  const { data: listingsForBreed, isLoading: isLoadingListings, error } = useListingsForBreed(breedId);

  if (isLoadingListings) {
    return (
      <Center height="200px">
        <Loader />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error loading breeders data. Please try again later.
        {error.message}
      </Alert>
    );
  }

  if (listingsForBreed?.length === 0) {
    return (
      <Alert status="info">
        <AlertIcon />
        No listings found for this breed.
      </Alert>
    );
  }

  return (
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
  )
}