import { useRouter } from 'next/router';
import { useUserProfile } from 'lib/hooks/queries/useUserProfile';
import { Container, Center, Button, VStack, Text } from '@chakra-ui/react';
import { ManageBreedDetailView } from './ManageBreedDetailView';
import BrowseBreedDetailPage from './BrowseBreedDetailPage';
import { Loader } from 'lib/components/ui/Loader';

export default function BreedDetailPage() {
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();

  const router = useRouter();

  const renderRoleSpecificContent = () => {
    switch (userProfile.role) {
      case 'seeker':
        return <BrowseBreedDetailPage />;
      case 'breeder':
        return <ManageBreedDetailView />;
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
      {renderRoleSpecificContent()}
    </>
  );
}
