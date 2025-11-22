import { Box, Heading, Spinner, Text } from '@chakra-ui/react';
import { useUserProfile } from 'lib/hooks/queries';
import React from 'react';

const AdminDashboardPage = () => {
  const { data: userProfile, isLoading, error } = useUserProfile();

  if (isLoading) {
    return (
      <Box textAlign="center" mt="20">
        <Spinner size="xl" />
        <Text mt="4">Loading...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt="20">
        <Text color="red.500">Error loading user profile.</Text>
      </Box>
    );
  }

  if (userProfile?.role !== 'admin') {
    return (
      <Box textAlign="center" mt="20">
        <Heading as="h1" size="lg">
          Access Denied
        </Heading>
        <Text mt="4">You do not have permission to view this page.</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading as="h1" size="xl" mb="8">
        Admin Dashboard
      </Heading>
      <Text>Welcome to the admin dashboard. More features coming soon!</Text>
    </Box>
  );
};

export default AdminDashboardPage;
