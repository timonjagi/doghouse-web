import { Card, CardHeader, Heading, CardBody, SimpleGrid, VStack, Button, Image, Text, Alert, AlertIcon, Center, useColorModeValue, useToast, useDisclosure, Box } from "@chakra-ui/react";
import { Loader } from "lib/components/ui/Loader";
import { useIncrementListingViews, useUpdateListing } from "lib/hooks/queries/useListings";
import { formatPrice } from "lib/pages/breeds/ExploreBreeds/PriceTag";
import ListingCard from "../../listings/browse/ListingCard";
import ManageListingCard from "../../listings/manage/ManageListingCard";
import { useRouter } from "next/router";

export const BreedListings = ({ listings, loading, error, isManaging }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const handleEditListing = (listingId: string) => {
    router.push(`/dashboard/listings/${listingId}/edit`);
  };

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
      <Box width="full" height="full">
        <Center height="full">
          <Loader />
        </Center>
      </Box>

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
    return (
      <Alert status="info">
        <AlertIcon />
        No listings found for this breed.
      </Alert>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
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