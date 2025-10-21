import { Card, CardHeader, Heading, CardBody, Center, Alert, AlertIcon, SimpleGrid, HStack, Avatar, VStack, Icon, Button, Text, Stack } from "@chakra-ui/react";
import { Loader } from "lib/components/ui/Loader";
import { useBreedersForBreed } from "lib/hooks/queries/useUserBreeds";
import { FaStar } from "react-icons/fa";

export const BreedersList = ({ breed }) => {

  const { data: breedersForBreed, isLoading: isLoadingBreeders, error } = useBreedersForBreed(breed.id);

  if (isLoadingBreeders) {
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

  console.log('Breeders for breed:', breedersForBreed);
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
      {breedersForBreed?.map((breeder) => (
        <Card key={breeder.id} size="sm" variant="outline">
          <CardBody>
            <Stack>
              {/* <HStack spacing={4}>
                <Avatar src={breeder.images[0]} name={breeder.users.display_name} title={breeder.users.display_name} />
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontWeight="medium">{breeder.users.display_name}</Text>
                  <Text fontSize="sm" color="gray.600">{breeder.users.breeder_profiles.kennel_location}</Text>

                </VStack>

              </HStack>

              <HStack>
                <HStack spacing={1}>
                  <Icon as={FaStar} color="yellow.400" />
                  <Text fontSize="sm">{breeder.users.breeder_profiles.rating}</Text>
                </HStack>
                <Text fontSize="sm" color="gray.500">
                  ({breeder.users.breeder_profiles.reviewCount} reviews)
                </Text>
              </HStack> */}
              <Button size="sm" colorScheme="brand" w="full">
                View Profile
              </Button>
            </Stack>

          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  )
}

