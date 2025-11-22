import { Box, Container, Heading, Text } from '@chakra-ui/react';
import { useUserProfile } from 'lib/hooks/queries';
import { Loader } from 'lib/components/ui/Loader';
import React from 'react';

const AdminDashboardPage = () => {
  const { data: userProfile, isLoading, error } = useUserProfile();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Container maxW="7xl" py={{ base: 4, md: 0 }}>
        <Box textAlign="center" mt="20">
          <Text color="red.500">Error loading user profile.</Text>
        </Box>
      </Container>
    );
  }

  if (userProfile?.role !== 'admin') {
    return (
      <Container maxW="7xl" py={{ base: 4, md: 0 }}>
        <Box textAlign="center" mt="20">
          <Heading as="h1" size="lg">
            Access Denied
          </Heading>
          <Text mt="4">You do not have permission to view this page.</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="7xl" py={{ base: 4, md: 0 }}>
      <Box>
        <Heading as="h1" size="xl" mb="8">
          Admin Dashboard
        </Heading>
        <Text>Welcome to the admin dashboard. More features coming soon!</Text>
      </Box>
    </Container>
  );
};

export default AdminDashboardPage;
