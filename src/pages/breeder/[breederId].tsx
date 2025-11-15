import { useRouter } from 'next/router';
import { PublicBreederProfile } from 'lib/pages/breeder/[breederId]';

export default function BreederProfilePage() {
  const router = useRouter();
  const { breederId } = router.query;

  if (!breederId || typeof breederId !== 'string') {
    return null; // or loading state
  }

  return <PublicBreederProfile breederId={breederId} />;
}
