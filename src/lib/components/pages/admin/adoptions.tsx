import { Container, Heading, Text, VStack } from "@chakra-ui/react";

const AdoptionsPage = () => {
  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">
          Adoptions
        </Heading>
        <Text color="gray.600">
          View and manage adoptions for your listings. Review seeker adoptions and communicate with potential adopters.
        </Text>
        <Text fontSize="sm" color="gray.500" fontStyle="italic">
          Adoption management interface coming soon...
        </Text>
      </VStack>
    </Container>
  );
};

export default AdoptionsPage;
