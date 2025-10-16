import { Container, Heading, Text, VStack } from "@chakra-ui/react";

const MyListingsPage = () => {
  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" color="brand.500">
          My Listings
        </Heading>
        <Text color="gray.600">
          Manage your litters and single pet listings. Create new listings, update existing ones, and track inquiries.
        </Text>
        <Text fontSize="sm" color="gray.500" fontStyle="italic">
          Listing management interface coming soon...
        </Text>
      </VStack>
    </Container>
  );
};

export default MyListingsPage;
