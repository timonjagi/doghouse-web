import React, { useEffect } from 'react';
import {
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Spinner,
  Center,
  Box,
} from '@chakra-ui/react';
import { useUserProfile } from '../../../hooks/queries';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { Loader } from 'lib/components/ui/Loader';
import profile from '../profile';
import BreederListingsView from './BreederListingsView';
import SeekerListingsView from './SeekerListingsView';

const ListingsPage: React.FC = () => {
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const router = useRouter();

  const renderRoleSpecificContent = () => {
    switch (userProfile.role) {
      case 'seeker':
        return <SeekerListingsView userProfile={userProfile} />;
      case 'breeder':
        return <BreederListingsView userProfile={userProfile} />;

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
