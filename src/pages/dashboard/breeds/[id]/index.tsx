import { useRouter } from 'next/router';
import { useUserProfile } from 'lib/hooks/queries/useUserProfile';
import { useUserBreed } from 'lib/hooks/queries/useUserBreed';
import { useBreed } from 'lib/hooks/queries/useBreeds';
import { Container, Spinner, Center, Alert, AlertIcon } from '@chakra-ui/react';
import { BreedDetailView } from 'lib/pages/dashboard/breeds/BreedDetailView';
import { Loader } from 'lib/components/ui/Loader';

export default function BreedDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();

  // For seekers, we need to get all breeders offering this breed
  // For breeders, we need to get their specific user_breed record
  const {
    data: userBreed,
    isLoading: isLoadingUserBreed,
    error: userBreedError,
  } = useUserBreed(id as string);

  const isLoading = isLoadingProfile || isLoadingUserBreed;

  if (isLoading) {
    return (
      <Container maxW="7xl">
        <Center height="100vh">
          <Loader />
        </Center>
      </Container>
    );
  }

  if (userBreedError) {
    return (
      <Container maxW="7xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          Breed not found or error loading breed details.
          {userBreedError.message}
        </Alert>
      </Container>
    );
  }

  return (
    <BreedDetailView
      userBreed={userBreed}
      userRole={userProfile?.role}
    />
  );
}
