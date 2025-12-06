import { Card, CardHeader, Heading, CardBody, SimpleGrid, VStack, Button, Image, Text, Alert, AlertIcon, Center, useColorModeValue, useToast, useDisclosure, Box, AlertDescription, AlertTitle, Stack, Spacer } from "@chakra-ui/react";
import { Loader } from "lib/components/ui/Loader";
import { useIncrementListingViews, useUpdateListing } from "lib/hooks/queries/useListings";
import { formatPrice } from "lib/components/ui/PriceTag";
import ListingCard from "./ListingCard";
import ManageListingCard from "./ManageListingCard";
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

  const onAddToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: "Listing has been added to your wishlist",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

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
      <Alert
        status='info'
        variant='brand'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        maxW="xl"
        borderRadius="lg"
        bgColor="brand.50"
      >
        <VStack spacing="2">
          <AlertIcon boxSize='50px' mr={0} color="brand.500" />
          <AlertTitle mt={4} mb={1} fontSize='lg'>
            No listings found
          </AlertTitle>
          <AlertDescription maxWidth='sm'>
            {isManaging ? 'Click the button below to add a new listing.' : 'Add the breed to your wishlist to be notified when a new pet becomes available.'}
          </AlertDescription>

          <Spacer />

          {isManaging && <Button
            colorScheme='teal'
            size='lg' as={Link}
            href="/dashboard/listings/"
          >
            Add Listing
          </Button>}

          {!isManaging && <Button
            colorScheme='brand'
            size='lg'
            onClick={onAddToWishlist}

          >
            Add to Wishlist
          </Button>}
        </VStack>

      </Alert>
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
            />
            : <ListingCard
              key={listing.id}
              listing={listing}
              handleListingClick={handleListingClick}
            />
          }
        </>
      ))}
    </SimpleGrid>
  )
}