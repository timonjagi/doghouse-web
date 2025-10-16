import { Container, Heading, Text, VStack } from "@chakra-ui/react";

const MyApplicationsPage = () => {
  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" color="brand.500">
          My Applications
        </Heading>
        <Text color="gray.600">
          Track the status of your applications. View updates from breeders and manage your adoption journey.
        </Text>
        <Text fontSize="sm" color="gray.500" fontStyle="italic">
          Applications tracking interface coming soon...
        </Text>
      </VStack>
    </Container>
  );
};

export default MyApplicationsPage;
