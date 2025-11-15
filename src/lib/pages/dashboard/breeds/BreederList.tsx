import { Card, CardHeader, Heading, CardBody, Center, Alert, AlertIcon, SimpleGrid, HStack, Avatar, VStack, Icon, Button, Text, Stack } from "@chakra-ui/react";
import { Loader } from "lib/components/ui/Loader";
import { useBreedersForBreed } from "lib/hooks/queries/useUserBreeds";
import { FaStar } from "react-icons/fa";
import Link from "next/link";

export const BreedersList = ({ breed }) => {

  const { data: breedersForBreed, isLoading: isLoadingBreeders, error } = useBreedersForBreed(breed.id);

  if (isLoadingBreeders) {
    return (
      <Loader />
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

  console.log('Breeders for breed:', breedersForBreed);
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
      {breedersForBreed?.map((breeder) => (
        <Card key={breeder.id} size="sm" variant="outline">
          <CardBody>
            <Stack spacing={3}>
              <HStack spacing={4}>
                <Avatar
                  src={breeder.users?.[0]?.profile_photo_url}
                  name={breeder.users?.[0]?.display_name}
                  title={breeder.users?.[0]?.display_name}
                  size="md"
                />
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontWeight="medium">
                    {breeder.users?.[0]?.breeder_profiles?.[0]?.kennel_name || breeder.users?.[0]?.display_name}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {breeder.users?.[0]?.breeder_profiles?.[0]?.kennel_location}
                  </Text>
                </VStack>
              </HStack>

              {breeder.users?.[0]?.breeder_profiles?.[0]?.rating && (
                <HStack>
                  <HStack spacing={1}>
                    <Icon as={FaStar} color="yellow.400" />
                    <Text fontSize="sm">{breeder.users[0].breeder_profiles[0].rating.toFixed(1)}</Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.500">
                    Rating
                  </Text>
                </HStack>
              )}

              <Link href={`/breeder/${breeder.user_id}`} passHref>
                <Button size="sm" colorScheme="brand" w="full" as="a">
                  View Profile
                </Button>
              </Link>
            </Stack>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  )
}
