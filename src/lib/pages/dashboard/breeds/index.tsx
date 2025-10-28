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
} from '@chakra-ui/react';
import { useUserProfile } from '../../../hooks/queries';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { Loader } from 'lib/components/ui/Loader';

const BreedsPage: React.FC = () => {
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    if (profile && !profileLoading) {
      // Redirect to appropriate page based on role
      if (profile.role === 'breeder') {
        router.push('/dashboard/breeds/manage');
      } else if (profile.role === 'seeker') {
        router.push('/dashboard/breeds/browse');
      }
    }
  }, [profile, profileLoading, router]);
  ;

  if (profileLoading) {
    return (
      <Loader />
    );
  }

  if (!profile?.role) {
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

  // This component will redirect, so this UI won't be shown
  return (
    <>
      <NextSeo title="Listings - DogHouse Kenya" />

      <Loader />
    </>
  );
};

export default BreedsPage;
