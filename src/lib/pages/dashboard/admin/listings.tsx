import { Container, Heading, Text, VStack } from "@chakra-ui/react";

const ListingsPage = () => {
  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">
          Manage Listings
        </Heading>
        <Text color="gray.600">
          Oversee all listings on the platform. Monitor litter and pet listings, ensure quality, and manage platform content.
        </Text>
        <Text fontSize="sm" color="gray.500" fontStyle="italic">
          Listings management interface coming soon...
        </Text>
      </VStack>
    </Container>
  );
};

export default ListingsPage;
