import React from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { Loader } from 'lib/components/ui/Loader';
import { ProfileForm } from './ProfileForm';
import { NextSeo } from 'next-seo';
import { useUserProfile } from 'lib/hooks/queries/useUserProfile';


export const ProfilePage: React.FC = () => {

  const { data: userProfile, isLoading, error } = useUserProfile();

  // Show loading state while fetching user profile
  if (isLoading) {
    return <Loader />;
  }

  // Show error state
  if (error || !userProfile) {
    return (
      <Container maxW="4xl" py={{ base: 4, md: 0 }}>
        <Alert status="error">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Error loading profile</Text>
            <Text fontSize="sm">
              {error?.message || 'Unable to load user profile'}
            </Text>
          </Box>
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <NextSeo title="Profile - DogHouse Kenya" />

      <Container maxW="7xl" py={{ base: 4, md: 0 }}>
        <VStack spacing={8} align="stretch">
          {/* Page Header */}
          <Box>
            <Heading size={{ base: 'sm', lg: 'md' }}>
              Your Profile
            </Heading>
            <Text color="gray.600" mt={2}>
              Manage your personal information and profile photo
            </Text>
          </Box>

          <ProfileForm userProfile={userProfile} />
        </VStack>
      </Container>
    </>
  );
};
