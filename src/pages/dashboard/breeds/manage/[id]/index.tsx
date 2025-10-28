import { useRouter } from 'next/router';
import { useUserProfile } from 'lib/hooks/queries/useUserProfile';
import { useUserBreed } from 'lib/hooks/queries/useUserBreeds';
import { Container, Center, Alert, AlertIcon } from '@chakra-ui/react';
import { ManageBreedDetailView } from 'lib/pages/dashboard/breeds/manage/ManageBreedDetailView';
import { Loader } from 'lib/components/ui/Loader';

export default function BreedDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: userBreed,
    isLoading: isLoadingUserBreed,
    error: userBreedError,
  } = useUserBreed(id as string);

  if (isLoadingUserBreed) {
    return (
      <Loader />
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
    <ManageBreedDetailView userBreed={userBreed} />
  );
}
