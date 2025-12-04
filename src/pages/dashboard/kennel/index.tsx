import { useRouter } from 'next/router';
import { BreederProfile } from 'lib/components/ui/BreederProfile';
import { useCurrentUser } from 'lib/hooks/queries';
import { Loader } from 'lib/components/ui/Loader';

export default function BreederProfilePage() {
  const router = useRouter();
  const { data: user } = useCurrentUser()

  const breederId = router.query.breederId || user?.id;

  if (!breederId || typeof breederId !== 'string') {
    return <Loader />;
  }

  return <BreederProfile breederId={breederId} showBackButton={false} />;
}
