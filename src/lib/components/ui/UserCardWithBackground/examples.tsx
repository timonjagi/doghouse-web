import { UserCardWithBackground } from '@/lib/components/ui/UserCardWithBackground';
import { Button, VStack } from '@chakra-ui/react';
import { HiPencilAlt } from 'react-icons/hi';
import type { BreederCardData, SeekerCardData } from '@/lib/components/ui/UserCardWithBackground';

/**
 * Example usage of UserCardWithBackground component for a Breeder
 */
export const BreederCardExample = () => {
  const breederData: BreederCardData = {
    role: 'breeder',
    user: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'john.breeder@example.com',
      phone: '+1-555-0123',
      display_name: 'John Doe',
      role: 'breeder',
      is_verified: true,
      profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: 'Experienced breeder specializing in Golden Retrievers with over 15 years of expertise. Committed to ethical breeding practices and healthy, happy puppies.',
      location_text: 'Austin, TX',
      location_lat: '30.2672',
      location_lng: '-97.7431',
      onboarding_completed: true,
      created_at: new Date('2020-01-15'),
      updated_at: new Date('2024-12-01'),
    },
    breederProfile: {
      id: '456e4567-e89b-12d3-a456-426614174001',
      user_id: '123e4567-e89b-12d3-a456-426614174000',
      kennel_name: 'Golden Valley Kennels',
      kennel_location: 'Austin, TX',
      facility_type: 'Home-based',
      verification_docs: null,
      verified_at: new Date('2020-02-01'),
      rating: '4.8',
      created_at: new Date('2020-01-15'),
      updated_at: new Date('2024-12-01'),
    },
  };

  return (
    <UserCardWithBackground
      data={breederData}
      action={
        <Button size="sm" leftIcon={<HiPencilAlt />}>
          Edit
        </Button>
      }
    />
  );
};

/**
 * Example usage of UserCardWithBackground component for a Seeker
 */
export const SeekerCardExample = () => {
  const seekerData: SeekerCardData = {
    role: 'seeker',
    user: {
      id: '789e4567-e89b-12d3-a456-426614174002',
      email: 'jane.seeker@example.com',
      phone: '+1-555-0456',
      display_name: 'Jane Smith',
      role: 'seeker',
      is_verified: true,
      profile_photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: 'Looking for a family-friendly dog to join our loving home. We have a large backyard and two kids who are excited to have a furry friend!',
      location_text: 'Seattle, WA',
      location_lat: '47.6062',
      location_lng: '-122.3321',
      onboarding_completed: true,
      created_at: new Date('2023-06-10'),
      updated_at: new Date('2024-12-01'),
    },
    seekerProfile: {
      id: '101e4567-e89b-12d3-a456-426614174003',
      user_id: '789e4567-e89b-12d3-a456-426614174002',
      living_situation: 'House with large yard',
      experience_level: 'beginner',
      has_allergies: false,
      has_children: true,
      has_other_pets: false,
      preferred_breed_id: null,
      preferred_breed_name: 'Golden Retriever',
      preferred_age: 'puppy',
      preferred_sex: 'any',
      spay_neuter_preference: 'yes',
      activity_level: 'moderate',
      created_at: new Date('2023-06-10'),
      updated_at: new Date('2024-12-01'),
    },
  };

  return (
    <UserCardWithBackground
      data={seekerData}
      backgroundColorScheme="purple.600"
      action={
        <Button size="sm" leftIcon={<HiPencilAlt />}>
          Edit
        </Button>
      }
    />
  );
};

/**
 * Example showing both cards side by side
 */
export const UserCardExamples = () => {
  return (
    <VStack spacing={8} align="stretch" p={8}>
      <BreederCardExample />
      <SeekerCardExample />
    </VStack>
  );
};
