import React, { useState } from 'react';
import {
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  Image,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Spinner,
  Center,
  SimpleGrid,
  Box,
  useColorModeValue,
  useToast,
  Flex,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ViewIcon, AddIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useUserProfile } from '../../../../hooks/queries';
import { useListingsByOwner, useUpdateListing, useDeleteListing } from '../../../../hooks/queries/useListings';
import { NextSeo } from 'next-seo';
import { Loader } from 'lib/components/ui/Loader';
import ManageListingCard from './ManageListingCard';

const ManageListingsPage: React.FC = () => {
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const router = useRouter();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedListingId, setSelectedListingId] = useState<string>('');

  const { data: listings, isLoading: listingsLoading } = useListingsByOwner(
    profile?.id || ''
  );

  const updateListingMutation = useUpdateListing();
  const deleteListingMutation = useDeleteListing();


  const handleEditListing = (listingId: string) => {
    router.push(`/dashboard/listings/${listingId}/edit`);
  };

  const handleViewListing = (listingId: string) => {
    router.push(`/dashboard/listings/${listingId}`);
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

  const handleDeleteListing = async (listingId: string) => {
    try {
      await deleteListingMutation.mutateAsync(listingId);

      toast({
        title: "Listing deleted",
        description: "Your listing has been deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete listing",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

  }

  const onDeleteListing = (listingId: string) => {
    setSelectedListingId(listingId);
    onOpen();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'available': return 'green';
      case 'reserved': return 'yellow';
      case 'sold': return 'red';
      default: return 'gray';
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Price not set';
    return `KSH ${price.toLocaleString()}`;
  };

  if (profileLoading) {
    return (
      <Flex>
        <Center h="full">
          <Loader />
        </Center>
      </Flex>

    );
  }

  if (profile?.role !== 'breeder') {
    return (
      <Container maxW="7xl">
        <Center h="400px">
          <VStack spacing={4}>
            <Text fontSize="lg" color="gray.500">Access denied</Text>
            <Text color="gray.400">Only breeders can manage listings</Text>
            <Button onClick={() => router.push('/dashboard/listings')}>
              Back to Dashboard
            </Button>
          </VStack>
        </Center>
      </Container>
    );
  }


  if (listingsLoading) {
    return (
      <Box h="full">
        <Center h="full">
          <Loader />
        </Center>
      </Box>
    );
  }

  return (
    <>
      <NextSeo title="Manage Listings - DogHouse Kenya" />

      <Container maxW="7xl">
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <Box >
              <Heading size={{ base: 'sm', lg: 'md' }} mb={2} color="brand.500">Manage Listings</Heading>
              <Text color="gray.600">Edit, view, or update the status of your listings</Text>
            </Box>

            {listings.length > 0 && <Button
              leftIcon={<AddIcon />}
              colorScheme="brand"
              onClick={() => router.push('/dashboard/listings/create')}
            >
              Create
            </Button>}
          </HStack>

          {listings?.length === 0 ? (
            <Center h="300px" bg={bgColor} borderRadius="lg" border="2px dashed" borderColor="gray.300">
              <VStack spacing={4}>
                <Text fontSize="xl" fontWeight="semibold" color="gray.500">No listings yet</Text>
                <Text color="gray.400" textAlign="center" maxW="md">
                  Create your first listing to start connecting with potential pet adopters.
                </Text>
                <Button colorScheme="brand" onClick={() => router.push('/dashboard/listings/create')}>
                  Create Your First Listing
                </Button>
              </VStack>
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {listings?.map((listing) => (
                <ManageListingCard
                  key={listing.id}
                  listing={listing}
                  handleViewListing={handleViewListing}
                  getStatusColor={getStatusColor}
                  bgColor={bgColor}
                  formatPrice={formatPrice}
                />
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </>
  );
};

export default ManageListingsPage;
