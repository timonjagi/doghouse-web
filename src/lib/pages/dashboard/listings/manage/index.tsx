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
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ViewIcon, AddIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useUserProfile } from '../../../../hooks/queries';
import { useListingsByOwner, useUpdateListing } from '../../../../hooks/queries/useListings';
import { NextSeo } from 'next-seo';

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

  if (profileLoading) {
    return (
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (profile?.role !== 'breeder') {
    return (
      <Container maxW="7xl" py={8}>
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

  const handleEditListing = (listingId: string) => {
    router.push(`/dashboard/listings/${listingId}/edit`);
  };

  const handleViewListing = (listingId: string) => {
    router.push(`/dashboard/listings/${listingId}`);
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      await updateListingMutation.mutateAsync({
        id: listingId,
        updates: { status: 'sold' } // Mark as sold instead of deleting
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

  const getStatusColor = (status: string) => {
    switch (status) {
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

  if (listingsLoading) {
    return (
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <>
      <NextSeo title="Manage Listings - DogHouse Kenya" />

      <Container maxW="7xl" py={8}>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <Box>
              <Heading size={{ base: 'sm', lg: 'md' }} mb={2} color="brand.500">Manage My Listings</Heading>
              <Text color="gray.600">Edit, view, or update the status of your listings</Text>
            </Box>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="brand"
              onClick={() => router.push('/dashboard/listings/create')}
            >
              Create Listing
            </Button>
          </HStack>

          {listings?.length === 0 ? (
            <Center h="300px" bg={bgColor} borderRadius="lg" border="2px dashed" borderColor="gray.300">
              <VStack spacing={4}>
                <Text fontSize="lg" color="gray.500">No listings yet</Text>
                <Text color="gray.400" textAlign="center" maxW="md">
                  Create your first listing to start connecting with potential pet adopters.
                </Text>
                <Button colorScheme="brand" onClick={() => router.push('/dashboard/listings/create')}>
                  Create Your First Listing
                </Button>
              </VStack>
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, }} spacing={6}>
              {listings?.map((listing) => (
                <Card
                  key={listing.id}
                  bg={bgColor}
                  overflow="hidden"
                  onClick={() => handleViewListing(listing.id)}
                  cursor="pointer"
                >

                  <HStack spacing={2} pt={2} position="absolute" top={4} right={4}>

                    <IconButton
                      aria-label="Edit listing"
                      icon={<EditIcon />}
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => handleEditListing(listing.id)}
                    />
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="More options"
                        icon={<DeleteIcon />}
                        size="sm"
                        variant="outline"
                        colorScheme="red"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<DeleteIcon />}
                          onClick={() => {
                            setSelectedListingId(listing.id);
                            onOpen();
                          }}
                        >
                          Mark as Sold
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                  <CardBody>
                    {/* Main Photo */}
                    {listing.photos && listing.photos.length > 0 && (
                      <Image
                        src={listing.photos[0]}
                        alt={listing.title}
                        objectFit="cover"
                        w="full"
                        h="200px"
                        borderRadius="md"
                        mb={4}
                      />
                    )}

                    <VStack spacing={3} align="stretch">
                      <Box>
                        <Heading size={{ base: 'xs', lg: 'sm' }} noOfLines={2} mb={2}>
                          {listing.title}
                        </Heading>
                        <HStack>
                          <Badge colorScheme={listing.type === 'litter' ? 'blue' : 'green'}>
                            {listing.type === 'litter' ? 'Litter' : 'Single Pet'}
                          </Badge>
                          <Badge colorScheme={getStatusColor(listing.status)}>
                            {listing.status}
                          </Badge>
                        </HStack>
                      </Box>

                      <Text fontSize="sm" color="gray.600" noOfLines={2}>
                        {listing.description}
                      </Text>

                      <Text fontSize="lg" fontWeight="semibold" color="green.600">
                        {formatPrice(listing.price)}
                      </Text>

                      <Text fontSize="xs" color="gray.500">
                        Created: {new Date(listing.created_at).toLocaleDateString()}
                      </Text>

                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>

      {/* Delete Confirmation Dialog */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={undefined} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Mark Listing as Sold
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to mark this listing as sold? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                colorScheme="red"
                onClick={() => handleDeleteListing(selectedListingId)}
                ml={3}
                isLoading={updateListingMutation.isPending}
              >
                Mark as Sold
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ManageListingsPage;
