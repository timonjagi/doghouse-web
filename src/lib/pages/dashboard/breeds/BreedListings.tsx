import { Card, CardHeader, Heading, CardBody, SimpleGrid, VStack, Button, Image, Text, Alert, AlertIcon, Center, useColorModeValue, useToast, useDisclosure, Box, AlertDescription, AlertTitle } from "@chakra-ui/react";
import { Loader } from "lib/components/ui/Loader";
import { useIncrementListingViews, useUpdateListing } from "lib/hooks/queries/useListings";
import { formatPrice } from "lib/components/ui/PriceTag";
import ListingCard from "../../../components/ui/ListingCard";
import ManageListingCard from "../../../components/ui/ManageListingCard";
import { useRouter } from "next/router";
import Link from "next/link";

interface BreedListingsProps {
  listings: any[];
  loading: boolean;
  error: any;
  isManaging?: boolean;
}
export const BreedListings: React.FC<BreedListingsProps> = ({ listings, loading, error, isManaging }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');

  const handleViewListing = (listingId: string) => {
    router.push(`/dashboard/listings/${listingId}?from=breed`);
  };

  const incrementViewsMutation = useIncrementListingViews();
  const updateListingMutation = useUpdateListing();

  const handleListingClick = async (listingId: string) => {
    // Increment view count
    try {
      await incrementViewsMutation.mutateAsync(listingId);
    } catch (error) {
      console.error('Failed to increment views:', error);
    }

    // Navigate to detail page
    router.push(`/dashboard/listings/${listingId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'green';
      case 'reserved': return 'yellow';
      case 'sold': return 'red';
      default: return 'gray';
    }
  };

  const handleChangeStatus = async (listingId: string, status: 'available' | 'sold' | 'reserved' | 'completed') => {
    try {
      await updateListingMutation.mutateAsync({
        id: listingId,
        updates: { status }
      });

      toast({
        title: "Listing updated",
        description: "Listing has been marked as sold",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update listing status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    onClose();
  };


  if (loading) {
    return (
      <Loader />

    );
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

  if (listings?.length === 0) {
    return <>
      {isManaging ? (
        <Alert
          status='info'
          variant='subtle'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          textAlign='center'
          height='200px'
          maxW="xl"
        >
          <AlertIcon boxSize='40px' mr={0} />
          <AlertTitle mt={4} mb={1} fontSize='lg'>
            No listings found
          </AlertTitle>
          <AlertDescription maxWidth='sm'>
            No listings found for this breed.
          </AlertDescription>
          <Button colorScheme='teal' size='lg' as={Link} href="/dashboard/listings/" mt={4}>
            Add Listing
          </Button>
        </Alert>
      )
        : (
          <Alert status="info">
            <AlertIcon />
            No listings found for this breed.
          </Alert>
        )}
    </>
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
      {listings?.map((listing) => (
        <>
          {isManaging ?
            <ManageListingCard
              key={listing.id}
              listing={listing}
              handleViewListing={handleViewListing}
              getStatusColor={getStatusColor}
              bgColor={bgColor}
              formatPrice={formatPrice}
            />
            : <ListingCard
              key={listing.id}
              listing={listing}
              handleListingClick={handleListingClick}
              formatPrice={formatPrice}
              getStatusColor={getStatusColor}
            />
          }
        </>
      ))}
    </SimpleGrid>
  )
}