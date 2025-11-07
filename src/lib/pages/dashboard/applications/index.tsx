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
import { SeekerApplicationsView } from './SeekerApplicationsView';
import { BreederApplicationsView } from './BreederApplicationsView';
import { Loader } from 'lib/components/ui/Loader';
import { useUserProfile } from 'lib/hooks/queries';
import { NextSeo } from 'next-seo';

interface ApplicationsPageProps { }

export const ApplicationsPage: React.FC<ApplicationsPageProps> = () => {
  const { data: userProfile, isLoading, error } = useUserProfile();

  // Show loading state while fetching user profile
  if (isLoading) {
    return (
      <Loader />
    );
  }

  // Show error state
  if (error || !userProfile) {
    return (
      <Container maxW="6xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Error loading applications</Text>
            <Text fontSize="sm">
              {error?.message || 'Unable to load user profile'}
            </Text>
          </Box>
        </Alert>
      </Container>
    );
  }

  // Render role-specific content
  const renderRoleSpecificContent = () => {
    switch (userProfile.role) {
      case 'seeker':
        return <SeekerApplicationsView userProfile={userProfile} />;
      case 'breeder':
        return <BreederApplicationsView userProfile={userProfile} />;
      default:
        return (
          <Box textAlign="center" py={12}>
            <Heading size="md" color="gray.600">
              Invalid user role
            </Heading>
            <Text color="gray.500" mt={2}>
              Your role is not recognized. Please contact support.
            </Text>
          </Box>
        );
    }
  };

  return (
    <>

      <NextSeo title="Applications - DogHouse Kenya" />

      <Container maxW="6xl" py={{ base: 4, md: 0 }} >
        <VStack spacing={8} align="stretch">
          {/* Page Header */}
          <Box>
            <Heading size={{ base: 'sm', lg: 'md' }} color="brand.800">
              Applications
            </Heading>
            <Text color="gray.600" mt={2}>
              {userProfile.role === 'seeker'
                ? 'Manage your adoption applications and track their status'
                : 'Review and manage applications for your listings'
              }
            </Text>
          </Box>

          {/* Role-Specific Content */}
          {renderRoleSpecificContent()}
        </VStack>
      </Container>
    </>


  );
};

export default ApplicationsPage;
