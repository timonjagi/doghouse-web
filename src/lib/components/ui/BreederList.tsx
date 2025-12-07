import { Alert, AlertIcon, SimpleGrid, Text, Center, Button, Link } from "@chakra-ui/react";
import { Loader } from "lib/components/ui/Loader";
import { useBreedersForBreed } from "lib/hooks/queries/useUserBreeds";
import { BreederCard } from "./BreederCard";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { UserCardWithBackground } from "lib/components/ui/UserCardWithBackground";
import { UserCardWithRating } from "./UserCardWithRating/UserCardWithRating";
import { useRouter } from "next/router";

interface BreedersListProps {
  // Optional: fetch data internally for a specific breed
  breed?: any;

  // Optional: provide data directly
  breeders?: any[];
  isLoading?: boolean;
  error?: any;

  // Display options
  columns?: { base?: number; md?: number; lg?: number; xl?: number };
  spacing?: number | { base?: number; md?: number; lg?: number };
  emptyMessage?: string;
  showLoader?: boolean;
}

export const BreedersList: React.FC<BreedersListProps> = ({
  breed,
  breeders: externalBreeders,
  isLoading: externalIsLoading,
  error: externalError,
  columns = { base: 1, md: 2 },
  spacing = 4,
  emptyMessage = "No breeders found.",
  showLoader = true
}) => {
  const breeders = externalBreeders;
  const isLoading = externalIsLoading;
  const error = externalError;
  const router = useRouter();

  if (isLoading && showLoader) {
    return <Loader />;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error loading breeders data. Please try again later.
        {error.message}
      </Alert>
    );
  }

  if (!breeders || breeders.length === 0) {
    return (
      <Center py={8}>
        <Text color="gray.500">{emptyMessage}</Text>
      </Center>
    );
  }

  return (
    <SimpleGrid columns={columns} spacing={spacing}>
      {breeders.map((breeder) => (
        // <BreederCard key={breeder?.id} breeder={breeder} />
        <UserCardWithRating
          key={breeder?.id}
          data={{
            id: breeder.id,
            display_name: breeder.breeder_profiles?.kennel_name || breeder.display_name,
            username: breeder.username || breeder.breeder_profiles?.kennel_name,
            bio: breeder.bio,
            location_text: breeder?.breeder_profiles?.kennel_location,
            adoption_count: breeder.adoption_count,
            rating: breeder.rating,
            review_count: breeder.review_count,
            profile_photo_url: breeder.breeder_profiles?.kennel_avatar_url || breeder.profile_photo_url,
            tags: breeder.breedNames || [],
            role: `${breeder?.breeder_profiles?.pet_type || 'dog'} breeder`
          }}
          action={() => router.push(`/dashboard/breeders/${breeder.id}`)}
        />
      ))}
    </SimpleGrid>
  );
};
