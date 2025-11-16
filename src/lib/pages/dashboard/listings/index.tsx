import React from 'react';
import {
  Container,
  Text,
  VStack,
  Button,
  Center,
  Alert,
  AlertIcon,
  Box,
} from '@chakra-ui/react';
import { useUserProfile } from '../../../hooks/queries';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { Loader } from 'lib/components/ui/Loader';
import BreederListingsView from './BreederListingsView';
import SeekerListingsView from './SeekerListingsView';

const ListingsPage: React.FC = () => {
  const { data: userProfile, isLoading: profileLoading, error } = useUserProfile();
  const router = useRouter();




  if (profileLoading) {
    return (
      <Loader />
    );
  }

  if (error || !userProfile) {
    return (
      <Container maxW="6xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Error loading listings</Text>
            <Text fontSize="sm">
              {error?.message || 'Unable to load user profile'}
            </Text>
          </Box>
        </Alert>
      </Container>
    );
  }


  const renderRoleSpecificContent = () => {
    switch (userProfile.role) {
      case 'seeker':
        return <SeekerListingsView userProfile={userProfile} />;
      case 'breeder':
        return <BreederListingsView userProfile={userProfile} />;

      default:
        return (
          <Container maxW="7xl" py={{ base: 4, md: 0 }}>
            <Center h="400px">
              <VStack spacing={4}>
                <Text fontSize="lg" color="gray.500">Please complete your profile setup first</Text>
                <Button onClick={() => router.push('/onboarding')}>
                  Complete Setup
                </Button>
              </VStack>
            </Center>
          </Container>
        );
    }
  };

  return (
    <>
      <NextSeo title="Listings - DogHouse Kenya" />

      <Container maxW="7xl" py={{ base: 4, md: 0 }}>

        {renderRoleSpecificContent()}
      </Container>
    </>
  );
};

export default ListingsPage;
