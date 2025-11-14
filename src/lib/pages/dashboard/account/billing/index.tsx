import React from 'react';
import {
  Container,
  Text,
  VStack,
  Button,
  Center,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { Loader } from 'lib/components/ui/Loader';
import PaymentsPage from './payments';
import EarningsPage from './earnings';
import { useUserProfile } from 'lib/hooks/queries/useUserProfile';

const BillingPage: React.FC = () => {
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const router = useRouter();

  const renderRoleSpecificContent = () => {
    switch (userProfile.role) {
      case 'seeker':
        return <PaymentsPage />;
      case 'breeder':
        return <EarningsPage />;

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
      <NextSeo title="Billing - DogHouse Kenya" />

      <Container maxW="7xl" py={{ base: 4, md: 0 }}>

        {renderRoleSpecificContent()}
      </Container>
    </>
  );
};

export default BillingPage;
