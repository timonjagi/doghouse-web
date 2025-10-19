import React from 'react';
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
  Box,
  SimpleGrid,
  Divider,
  useColorModeValue,
  Spinner,
  Center,
  Avatar,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  ButtonGroup,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Stack,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ArrowBackIcon, EditIcon, ChatIcon, DeleteIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useUserProfile } from '../../../../hooks/queries';
import { useDeleteListing, useListing } from '../../../../hooks/queries/useListings';
import { NextSeo } from 'next-seo';
import { BreedListings } from '../../breeds/browse/BreedListings';
import { Gallery } from 'lib/components/ui/GalleryWithCarousel/Gallery';

interface ListingDetailPageProps {
  id: string;
}

const ListingDetailPage: React.FC<ListingDetailPageProps> = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: listing, isLoading: listingLoading } = useListing(id as string);

  const handleContact = () => {
    toast({
      title: "Reserve Listing",
      description: "Application system coming soon!",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };
  const deleteListingMutation = useDeleteListing();

  const formatPrice = (price?: number) => {
    if (!price) return 'Price not set';
    return `KSH ${price.toLocaleString()}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'green';
      case 'reserved': return 'yellow';
      case 'sold': return 'red';
      default: return 'gray';
    }
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

  if (profileLoading || listingLoading) {
    return (
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!listing) {
    return (
      <Container maxW="7xl" py={8}>
        <Center h="400px">
          <VStack spacing={4}>
            <Text fontSize="lg" color="gray.500">Listing not found</Text>
            <Button onClick={() => router.push('/dashboard/listings')}>
              Back to Dashboard
            </Button>
          </VStack>
        </Center>
      </Container>
    );
  }


  const isOwner = profile?.id === listing.owner_id;
  const canApply = profile?.role === 'seeker' && listing.status === 'available' && !isOwner;
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <NextSeo title={`${listing.title} - DogHouse Kenya`} />

      <Container maxW="7xl" >
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          onClick={() => router.back()}
          mb={4}
          p={0}
        >
          Back to {router.query.from === 'breed' ? 'Breed Details' : 'Listings'}
        </Button>

        <VStack spacing={6} >
          {/* Header */}

          <Stack spacing={4} as="section" >


            <HStack justify="space-between" align="start">
              <Box flex={1} minW="50vw">
                <Heading size={{ base: 'sm', lg: 'md' }} mb={2}>{listing.title}</Heading>
                <HStack spacing={3} mb={4}>
                  <Badge colorScheme={listing.type === 'litter' ? 'blue' : 'green'}>
                    {listing.type === 'litter' ? 'Litter' : 'Single Pet'}
                  </Badge>
                  <Badge colorScheme={getStatusColor(listing.status)}>
                    {listing.status}
                  </Badge>
                  {listing.is_featured && (
                    <Badge colorScheme="purple">Featured</Badge>
                  )}
                </HStack>
              </Box>


              {!isMobile && <>
                {canApply && (
                  <Button
                    leftIcon={<ChatIcon />}
                    colorScheme="brand"
                    size="lg"
                    w="full"
                    onClick={handleContact}
                  >
                    Reserve This Pet
                  </Button>
                )}
              </>}

              {isOwner && (
                <Stack spacing={3} direction={{ base: 'column', md: 'row' }} justify="flex-end">
                  <ButtonGroup>
                    <Button
                      as={IconButton}
                      icon={<EditIcon />}
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => router.push(`/dashboard/listings/${listing.id}/edit`)}
                    >
                      Edit Details
                    </Button>

                    <Button
                      as={IconButton}
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={onOpen}
                      isLoading={deleteListingMutation.isPending}
                    >
                      Delete
                    </Button>

                  </ButtonGroup>
                  {/* <Button
                    colorScheme="green"
                    variant="outline"
                  >
                    View Applications
                  </Button> */}
                </Stack>
              )}
            </HStack>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
              <Stack spacing={4} flex={1} >
                <Gallery images={listing.photos.map((photo) => ({ src: photo }))} flex={1} />

                <Card bg={bgColor}>
                  <CardBody>
                    <HStack>
                      <VStack spacing={4} align="stretch">
                        <Box>
                          <Text fontSize="sm" color="gray.500" textTransform="uppercase" mb={1}>
                            Price
                          </Text>
                          <Text fontSize="3xl" fontWeight="bold" color="green.600">
                            {formatPrice(listing.price)}
                          </Text>
                          {listing.reservation_fee && (
                            <Text fontSize="sm" color="blue.600">
                              Reservation Fee: {formatPrice(listing.reservation_fee)}
                            </Text>
                          )}
                        </Box>

                      </VStack>


                    </HStack>


                  </CardBody>
                </Card>
              </Stack>

              <Stack spacing={4}>
                {/* Pet Information */}
                <Card bg={bgColor}>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Text fontSize="lg" fontWeight="semibold" color="brand.600">
                        {listing.type === 'litter' ? 'Litter Information' : 'Pet Information'}
                      </Text>

                      <SimpleGrid columns={2} spacing={4}>
                        {listing.type === 'litter' ? (
                          <>
                            <Box>
                              <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                Birth Date
                              </Text>
                              <Text>{formatDate(listing.birth_date)}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                Available Date
                              </Text>
                              <Text>{formatDate(listing.available_date)}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                Number of Puppies
                              </Text>
                              <Text>{listing.number_of_puppies || 'Not specified'}</Text>
                            </Box>
                          </>
                        ) : (
                          <>
                            <Box>
                              <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                Pet Name
                              </Text>
                              <Text>{listing.pet_name || 'Not specified'}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                Age
                              </Text>
                              <Text>{listing.pet_age || 'Not specified'}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                Gender
                              </Text>
                              <Text>{listing.pet_gender || 'Not specified'}</Text>
                            </Box>
                          </>
                        )}
                      </SimpleGrid>
                    </VStack>
                  </CardBody>
                </Card>


                {/* Description */}
                <Card bg={bgColor}>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <Text fontSize="lg" fontWeight="semibold" color="brand.600">
                        Description
                      </Text>
                      <Text fontSize="sm" color="gray.600" whiteSpace="pre-wrap">
                        {listing.description || 'No description provided.'}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>

                {listing.location_text && (
                  <Card bg={bgColor}>
                    <CardBody>
                      <VStack spacing={3} align="stretch">
                        <Text fontSize="lg" fontWeight="semibold" color="brand.600">
                          Location
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          📍 {listing.location_text}
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                )}
                <Card bg={bgColor}>
                  <CardBody>
                    <SimpleGrid columns={2} spacing={4}>
                      <Box>
                        <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                          Views
                        </Text>
                        <Text>{listing.view_count || 0}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                          Listed
                        </Text>
                        <Text>{formatDate(listing.created_at)}</Text>
                      </Box>
                    </SimpleGrid>
                  </CardBody>
                </Card>
              </Stack>
            </SimpleGrid>


          </Stack>

          {isMobile && <Box position="sticky" bottom="0" py={4} boxShadow="md" zIndex={10}>
            {canApply && (
              <Button
                leftIcon={<ChatIcon />}
                colorScheme="brand"
                size="lg"
                w="full"
                onClick={handleContact}
              >
                Reserve This Pet
              </Button>
            )}
          </Box>}
        </VStack>

        <AlertDialog isOpen={isOpen} leastDestructiveRef={undefined} onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Mark Listing as Sold
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to delete this listing? This action cannot be undone.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  colorScheme="red"
                  onClick={() => handleDeleteListing(listing.id)}
                  ml={3}
                  isLoading={deleteListingMutation.isPending}
                >
                  Delete Listing
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

      </Container >


    </>
  );
};

export default ListingDetailPage;
