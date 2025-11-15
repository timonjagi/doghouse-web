import { Container, Heading, Text, VStack } from "@chakra-ui/react";

const MatchesPage = () => {
  return (
    <Container maxW="7xl" py={{ base: 4, md: 0 }}>
      <VStack spacing={6} align="stretch">
        <Heading size={{ base: "xs", lg: "md" }}>
          My Matches
        </Heading>
        <Text color="gray.600">
          View breeders and listings that match your preferences. These are personalized recommendations based on your profile and wanted listings.
        </Text>
        <Text fontSize="sm" color="gray.500" fontStyle="italic">
          Matches interface coming soon...
        </Text>
      </VStack>
    </Container>
  );
};

export default MatchesPage;
