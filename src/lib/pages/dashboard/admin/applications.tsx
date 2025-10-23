import { Container, Heading, Text, VStack } from "@chakra-ui/react";

const ApplicationsPage = () => {
  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" color="brand.500">
          Applications
        </Heading>
        <Text color="gray.600">
          View and manage applications for your listings. Review seeker applications and communicate with potential adopters.
        </Text>
        <Text fontSize="sm" color="gray.500" fontStyle="italic">
          Application management interface coming soon...
        </Text>
      </VStack>
    </Container>
  );
};

export default ApplicationsPage;
