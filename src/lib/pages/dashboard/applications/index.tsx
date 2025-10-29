import React from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { DashboardLayout } from '@/lib/components/layout/DashboardLayout';
import { SeekerApplicationsView } from './SeekerApplicationsView';
import { BreederApplicationsView } from './BreederApplicationsView';

interface ApplicationsPageProps { }

export const ApplicationsPage: React.FC<ApplicationsPageProps> = () => {
  const { data: userProfile, isLoading, error } = useUserProfile();

  // Show loading state while fetching user profile
  if (isLoading) {
    return (
      <DashboardLayout>
        <Container maxW="6xl" py={8}>
          <VStack spacing={8} align="center">
            <Spinner size="xl" color="blue.500" />
            <Text>Loading applications...</Text>
          </VStack>
        </Container>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error || !userProfile) {
    return (
      <DashboardLayout>
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
      </DashboardLayout>
    );
  }

  // Render role-specific content
  const renderRoleSpecificContent = () => {
    switch (userProfile.role) {
      case 'seeker':
        return <SeekerApplicationsView userProfile={userProfile} />;
      case 'breeder':
        return <BreederApplicationsView userProfile={userProfile} />;
      case 'admin':
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
    <DashboardLayout>
      <Container maxW="6xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Page Header */}
          <Box>
            <Heading size="xl" color="gray.800">
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
    </DashboardLayout>
  );
};

export default ApplicationsPage;
