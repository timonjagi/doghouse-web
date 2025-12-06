import { Container, Heading, Text, VStack } from "@chakra-ui/react";

const UsersPage = () => {
  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">
          Manage Users
        </Heading>
        <Text color="gray.600">
          View and manage all platform users. Monitor user activity, roles, and account status.
        </Text>
        <Text fontSize="sm" color="gray.500" fontStyle="italic">
          User management interface coming soon...
        </Text>
      </VStack>
    </Container>
  );
};

export default UsersPage;
