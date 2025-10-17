import { Card, CardHeader, Heading, CardBody, Center, Alert, AlertIcon, SimpleGrid, HStack, Avatar, VStack, Icon, Button, Text } from "@chakra-ui/react";
import { Loader } from "lib/components/ui/Loader";
import { useBreedersForBreed } from "lib/hooks/queries/useUserBreeds";
import { FaStar } from "react-icons/fa";

export const BreedersList = ({ breed }) => {

  const { data: breedersForBreed, isLoading: isLoadingBreeders, error } = useBreedersForBreed(breed.id);

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
      {breedersForBreed?.map((breeder) => (
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
  )
}

