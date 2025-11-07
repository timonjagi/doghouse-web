import React from 'react';
import {
  Container,
  Text,
  VStack,
  Button,
  Center,
} from '@chakra-ui/react';
import { useUserProfile } from '../../../hooks/queries';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { Loader } from 'lib/components/ui/Loader';
import BreederBreedsView from './BreederBreedsView';
import SeekerBreedsView from './SeekerBreedsView';

const BreedsPage: React.FC = () => {
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const router = useRouter();

  const renderRoleSpecificContent = () => {
    switch (userProfile.role) {
      case 'seeker':
        return <SeekerBreedsView userProfile={userProfile} />;
      case 'breeder':
        return <BreederBreedsView userProfile={userProfile} />;
      default:
        return (
          <Container maxW="7xl" py={8}>
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


  if (profileLoading) {
    return (
      <Loader />
    );
  }

  // This component will redirect, so this UI won't be shown
  return (
    <>
      <NextSeo title="Breeds - DogHouse Kenya" />

      <Container maxW="7xl" py={{ base: 4, md: 0 }}>

        {renderRoleSpecificContent()}

      </Container>
    </>
  );
};

export default BreedsPage;
