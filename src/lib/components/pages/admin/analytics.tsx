import { Container, Heading, Text, VStack } from "@chakra-ui/react";

const AnalyticsPage = () => {
  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">
          Platform Analytics
        </Heading>
        <Text color="gray.600">
          Monitor platform performance, user engagement, and key metrics. Track adoption success rates and platform growth.
        </Text>
        <Text fontSize="sm" color="gray.500" fontStyle="italic">
          Analytics dashboard coming soon...
        </Text>
      </VStack>
    </Container>
  );
};

export default AnalyticsPage;
