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
} from '@chakra-ui/react';
import { ArrowBackIcon, EditIcon, ChatIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useUserProfile } from '../../../../hooks/queries';
import { useListing } from '../../../../hooks/queries/useListings';
import { NextSeo } from 'next-seo';

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
      title: "Contact Breeder",
      description: "Application system coming soon! Contact the breeder directly for now.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

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

  const isOwner = profile?.id === listing.owner_id;
  const canApply = profile?.role === 'seeker' && listing.status === 'available' && !isOwner;

  return (
    <>
      <NextSeo title={`${listing.title} - DogHouse Kenya`} />

      <Container maxW="7xl" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Box>
            <Button
              leftIcon={<ArrowBackIcon />}
              variant="ghost"
              onClick={() => router.push('/dashboard/listings')}
              mb={4}
              p={0}
            >
              Back to Listings
            </Button>

            <HStack justify="space-between" align="start">
              <Box flex={1}>
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
              {/* 
              {isOwner && (
                <Button
                  leftIcon={<EditIcon />}
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => router.push(`/dashboard/listings/${listing.id}/edit`)}
                >
                  Edit Listing
                </Button>
              )} */}
            </HStack>
          </Box>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {/* Images Gallery */}
            <Card bg={bgColor}>
              <CardBody>
                {listing.photos && listing.photos.length > 0 ? (
                  <VStack spacing={4} align="stretch">
                    <Box borderRadius="lg" overflow="hidden">
                      <Image
                        src={listing.photos[0]}
                        alt={listing.title}
                        objectFit="cover"
                        w="full"
                        h="400px"
                      />
                    </Box>

                    {listing.photos.length > 1 && (
                      <SimpleGrid columns={4} spacing={2}>
                        {listing.photos.slice(1).map((photo, index) => (
                          <Box key={index} borderRadius="md" overflow="hidden">
                            <Image
                              src={photo}
                              alt={`${listing.title} ${index + 2}`}
                              objectFit="cover"
                              w="full"
                              h="80px"
                            />
                          </Box>
                        ))}
                      </SimpleGrid>
                    )}
                  </VStack>
                ) : (
                  <Center h="400px" bg="gray.100" borderRadius="lg">
                    <Text color="gray.500">No photos available</Text>
                  </Center>
                )}
              </CardBody>
            </Card>

            {/* Listing Details */}
            <VStack spacing={6} align="stretch">
              {/* Price and Actions */}
              <Card bg={bgColor}>
                <CardBody>
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

                    {canApply && (
                      <Button
                        leftIcon={<ChatIcon />}
                        colorScheme="brand"
                        size="lg"
                        onClick={handleContact}
                      >
                        Contact Breeder
                      </Button>
                    )}

                    {isOwner && (
                      <HStack>
                        <Button
                          colorScheme="blue"
                          variant="outline"
                          onClick={() => router.push(`/dashboard/listings/${listing.id}/edit`)}
                        >
                          Edit Details
                        </Button>
                        <Button
                          colorScheme="green"
                          variant="outline"
                        >
                          View Applications
                        </Button>
                      </HStack>
                    )}
                  </VStack>
                </CardBody>
              </Card>

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

              {/* Location */}
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

              {/* Metadata */}
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
            </VStack>
          </SimpleGrid>
        </VStack>
      </Container>


    </>
  );
};

export default ListingDetailPage;
