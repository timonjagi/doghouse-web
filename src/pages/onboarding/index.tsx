import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCurrentUser, useUserProfile } from '../../lib/hooks/queries';
import { OnboardingModal } from '../../lib/pages/onboarding';

export default function OnboardingPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading, error: userError } = useCurrentUser();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  // Handle loading state
  if (userLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle authentication errors
  if (userError || !user) {
    useEffect(() => {
      router.push('/login');
    }, []);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Handle completed onboarding
  if (profile?.onboarding_completed) {
    useEffect(() => {
      router.push('/dashboard');
    }, []);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Show onboarding modal
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <OnboardingModal onClose={() => router.push('/dashboard')} />
    </div>
  );
}
