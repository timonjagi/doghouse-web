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

const ListingsPage: React.FC = () => {
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    if (profile && !profileLoading) {
      // Redirect to appropriate page based on role
      if (profile.role === 'breeder') {
        router.push('/dashboard/listings/manage');
      } else if (profile.role === 'seeker') {
        router.push('/dashboard/listings/browse');
      }
    }
  }, [profile, profileLoading, router]);
  ;

  if (profileLoading) {
    return (
      <Box w="full" h="100vh" >
        <Center h="full" flex="1">
          <Loader />
        </Center>
      </Box>
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

      <Container maxW="7xl">
        <Box w="full" h="100vh" >
          <Center h="full">
            <Loader />
          </Center>
        </Box>
      </Container>
    </>
  );
};

export default ListingsPage;
