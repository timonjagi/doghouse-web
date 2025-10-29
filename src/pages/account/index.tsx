import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AccountIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to profile by default
    router.replace('/account/profile');
  }, [router]);

  return null;
}
