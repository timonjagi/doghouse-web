import { Container, Heading, Text, VStack } from "@chakra-ui/react";

const MyBreedsPage = () => {
  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" color="brand.500">
          My Breeds
        </Heading>
        <Text color="gray.600">
          Manage the dog breeds you offer. Add new breeds, update information, and track inquiries for each breed.
        </Text>
        {/* TODO: Implement breed management UI */}
        <Text fontSize="sm" color="gray.500" fontStyle="italic">
          Breed management interface coming soon...
        </Text>
      </VStack>
    </Container>
  );
};

export default MyBreedsPage;
