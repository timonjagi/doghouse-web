import { useRouter } from 'next/router';
import { BreederProfile } from 'lib/pages/dashboard/breeders/BreederProfile';

export default function BreederProfilePage() {
  const router = useRouter();
  const { breederId } = router.query;

  if (!breederId || typeof breederId !== 'string') {
    return null; // or loading state
  }

  return <BreederProfile breederId={breederId} />;
}
