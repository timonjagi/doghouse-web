import { Container, Heading, Text, VStack } from "@chakra-ui/react";

const VerificationPage = () => {
  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" >
          Breeder Verification
        </Heading>
        <Text color="gray.600">
          Review and approve breeder verification requests. Ensure breeders meet platform standards before they can list pets.
        </Text>
        <Text fontSize="sm" color="gray.500" fontStyle="italic">
          Verification management interface coming soon...
        </Text>
      </VStack>
    </Container>
  );
};

export default VerificationPage;
