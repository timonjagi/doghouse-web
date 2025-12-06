import { Alert, AlertIcon, SimpleGrid, Text, Center, Button, Link } from "@chakra-ui/react";
import { Loader } from "lib/components/ui/Loader";
import { useBreedersForBreed } from "lib/hooks/queries/useUserBreeds";
import { BreederCard } from "./BreederCard";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { UserCardWithBackground } from "lib/components/ui/UserCardWithBackground";

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
  // Use internal data fetching if breed is provided, otherwise use external data
  const {
    data: internalBreeders,
    isLoading: internalIsLoading,
    error: internalError
  } = useBreedersForBreed(breed?.id && !externalBreeders ? breed.id : undefined);

  const breeders = externalBreeders ?? internalBreeders;
  const isLoading = externalIsLoading ?? internalIsLoading;
  const error = externalError ?? internalError;

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
        <UserCardWithBackground
          key={breeder?.id}
          data={{ user: breeder } as any}
          action={
            <Link
              href={`/dashboard/breeders/${breeder?.id}`}
            >
              <Button
                leftIcon={<ArrowRightIcon />}
                colorScheme="brand"
                variant="outline"
              >
                View Profile
              </Button>
            </Link>
          }
        />
      ))}
    </SimpleGrid>
  );
};
