import React, { useEffect } from 'react';
import {
  Container,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Box,
  SimpleGrid,
  useColorModeValue,
  Center,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Stack,
  useBreakpointValue,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  AlertIcon,
  Alert,
  Img,
  Icon
} from '@chakra-ui/react';
import { EditIcon, ChatIcon, DeleteIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useUserBreedsFromUser, useCurrentUser } from 'lib/hooks/queries';
import { useDeleteListing, useIncrementListingViews, useListing } from 'lib/hooks/queries/useListings';
import { NextSeo } from 'next-seo';
import { Gallery } from 'lib/components/ui/GalleryWithCarousel/Gallery';
import { Loader } from 'lib/components/ui/Loader';
import { supabase } from 'lib/supabase/client';
import ListingForm from './ListingForm';
import WhatsIncluded from 'lib/components/ui/WhatsIncluded';
import { PageHeaderWithTwoButtons } from 'lib/components/ui/PageHeaderWithTwoButtons';
import { FiHeart, FiInfo, FiList } from 'react-icons/fi';
import { MdOutlineMedicalInformation } from 'react-icons/md';
import { GiDogHouse } from 'react-icons/gi';
import { BreederCard } from 'lib/components/ui/BreederCard2';

interface ListingDetailPageProps {
  id: string;
}

const ListingDetailPage: React.FC<ListingDetailPageProps> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: user, isLoading: profileLoading } = useCurrentUser();
  const {
    data: userBreeds,
    isLoading: userBreedsLoading,
    error: userBreedsError
  } = useUserBreedsFromUser(user?.id);

  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isApplicationOpen, onOpen: onApplicationOpen, onClose: onApplicationClose } = useDisclosure();
  const { isOpen: isListingFormOpen, onOpen: onListingFormOpen, onClose: onListingFormClose } = useDisclosure();

  const { data: listing, isLoading: listingLoading, error: listingError } = useListing(id as string);

  const deleteListingMutation = useDeleteListing();
  const incrementViewsMutation = useIncrementListingViews();

  useEffect(() => {
    if (listing) {
      incrementViewsMutation.mutateAsync(listing.id);
    }
  }, []);

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

      const deletedPhotos = Array.from(listing.photos as string[] || [])

      //@ts-ignore
      const deletedSirePhotos = Array.from(listing.parents?.sire?.photos as string[] || [])

      //@ts-ignore
      const deletedDamPhotos = Array.from(listing.parents?.dam?.photos as string[] || [])

      //@ts-ignore
      const deletedCerts = Array.from(listing.health?.certificates as string[] || [])

      if (deletedPhotos.length > 0 || deletedSirePhotos.length > 0 || deletedDamPhotos.length > 0 || deletedCerts.length > 0) {
        const { error: deleteError } = await supabase.storage
          .from('listing-images')
          .remove([...deletedPhotos as string[], ...deletedSirePhotos as string[], ...deletedDamPhotos as string[], ...deletedCerts as string[]]);

        if (deleteError) throw deleteError;
      }

      await deleteListingMutation.mutateAsync(listingId);

      toast({
        title: "Listing deleted",
        description: "Your listing has been deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
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

  if (profileLoading || listingLoading || userBreedsLoading) {
    return (
      <Loader />
    );
  }

  if (listingError || userBreedsError) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error loading breed listing. Please try again later.
        {listingError.message}
      </Alert>
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


  const isOwner = user?.id === listing.owner_id;
  const canApply = !isOwner && listing.status === 'available';

  const getTitle = () => {
    if (listing.title) return listing.title;
    if (listing.type === 'litter') {
      //@ts-ignore
      return `${listing.breeds?.name} Puppies for Sale`;
    } else {
      //@ts-ignore
      return `${listing.breeds?.name.charAt(0).toUpperCase() + listing.breeds?.name.slice(1)} ${listing.pet_age} old for Sale`;
    }
  }

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  return (
    <>
      <NextSeo title={
        //@ts-ignore
        `${getTitle()} - DogHouse Kenya`
      } />

      <Container maxW="7xl" pb={{ base: 4, md: 24 }}>
        <Stack spacing={{ base: 8, md: 16 }} >

          <Stack spacing="6">
            <PageHeaderWithTwoButtons
              title={getTitle()}
              description={formatPrice(parseInt(listing.price))}
              buttonPrimary={isOwner ? {
                label: "Edit",
                onClick: onListingFormOpen,
                icon: <EditIcon />,
                colorScheme: "brand",
                isDisabled: listing.status !== 'available',
              } : {
                label: "Add to Wishlist",
                onClick: () => { /* Handle add to wishlist logic */ },
                icon: <FiHeart />,
                colorScheme: "gray",
              }}
              buttonSecondary={isOwner ? {
                label: "Delete",
                onClick: onDeleteOpen,
                icon: <DeleteIcon />,
                colorScheme: "red",
                isLoading: deleteListingMutation.isPending,
                isDisabled: listing.status !== 'available',
              } : !isOwner && canApply ? {
                label: "Apply Now",
                onClick: onApplicationOpen,
                icon: <ArrowForwardIcon />, // Or a more suitable icon for application
                colorScheme: "brand",
              } : !isOwner && !canApply ? {
                label: "Message Seller",
                onClick: () => router.push(`/chat/${listing.owner_id}`), // Assuming a chat route
                icon: <ChatIcon />,
                colorScheme: "brand",
              } : undefined}

            />

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <Stack spacing={4}>
                <Gallery
                  images={[
                    ...Array.from(listing.photos as string[]).map((photo) => ({ src: photo })),
                    ...((listing.parents as { sire?: { photos?: (string | File)[] }; dam?: { photos?: (string | File)[] } })?.sire?.photos || []).map((photo) => ({ src: typeof photo === 'string' ? photo : URL.createObjectURL(photo), alt: 'Sire Photo' })),
                    ...((listing.parents as { sire?: { photos?: (string | File)[] }; dam?: { photos?: (string | File)[] } })?.dam?.photos || []).map((photo) => ({ src: typeof photo === 'string' ? photo : URL.createObjectURL(photo), alt: 'Dam Photo' }))
                  ]}
                  flex={1}
                  minW="50vw"
                >
                  <HStack spacing={3} mb={4} position="absolute" top="4" left="4" zIndex={1}>
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
                </Gallery>

              </Stack>

              <Tabs variant='soft-rounded' colorScheme='brand' >
                <TabList
                  overflowY="hidden"
                  whiteSpace="nowrap"
                  css={{
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                    scrollbarWidth: 'none',
                  }}
                >
                  <Tab>
                    <HStack>
                      <Icon as={FiInfo} />
                      <Text>Info</Text>
                    </HStack>
                  </Tab>
                  <Tab>
                    <HStack>
                      <Icon as={MdOutlineMedicalInformation} />
                      <Text>Health</Text>
                    </HStack>
                  </Tab>
                  <Tab>
                    <HStack>
                      <Icon as={FiList} />
                      <Text>Requirements</Text>
                    </HStack>
                  </Tab>
                  <Tab>
                    <HStack>
                      <Icon as={GiDogHouse} />
                      <Text>Breeder</Text>
                    </HStack>
                  </Tab>

                </TabList>

                <TabPanels>
                  <TabPanel>
                    <PetInformation
                      listing={listing}
                      bgColor={bgColor}
                      formatDate={formatDate}
                      formatPrice={formatPrice}
                    />

                  </TabPanel>

                  <TabPanel>
                    <HealthInfo listing={listing} />
                  </TabPanel>
                  <TabPanel>
                    <Requirements listing={listing} />
                  </TabPanel>

                  <TabPanel>
                    <BreederInfo listing={listing} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </SimpleGrid>

          </Stack>

          {!isOwner && (
            <WhatsIncluded
              buttonText={listing.status === 'available' ? 'Apply Now' : 'Not Available'}
              buttonSubtext={listing.status === 'available' ? 'Apply now to express your interest in this listing' : `This listing has been ${listing.status} and is no longer available. Please contact the seller for more information or subscribe to be notified when the listing is available again.`}
              onButtonClick={() => onApplicationOpen()}
            />
          )}
        </Stack>

        <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={undefined} onClose={onDeleteClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Listing
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to delete this listing? This action cannot be undone.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button onClick={onDeleteClose}>Cancel</Button>
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



        {/* Listing Form Modal */}

        {isOwner && listing && (
          <ListingForm
            isOpen={isListingFormOpen}
            onClose={onListingFormClose}
            userBreeds={userBreeds}
            userProfile={user}
            listing={listing}
            isEditing={true}
          />
        )}

      </Container >

      {isMobile && canApply && (
        <Box
          position="sticky"
          bottom="0"
          p={4}
          boxShadow="md"
          bg="white"
          zIndex={10}
          w="full"
        >
          <Button
            leftIcon={<ChatIcon />}
            colorScheme="brand"
            size="lg"
            w="full"
            onClick={onApplicationOpen}
          >
            Reserve This Pet
          </Button>
        </Box>)}

    </>
  );
};

const PetInformation = ({ listing, bgColor, formatDate, formatPrice }) => {
  return (

    <Stack spacing={6}>

      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="semibold" color="brand.600">
          {listing.type === 'litter' ? 'Litter Information' : 'Pet Information'}
        </Text>

        <SimpleGrid columns={2} spacing={4}>
          {listing.type === 'litter' ? (
            <>

              <Box>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                  Breed
                </Text>
                <Text>{listing.breeds?.name?.charAt(0).toUpperCase() + listing.breeds?.name?.slice(1) || 'Not specified'}</Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                  Birth Date
                </Text>
                <Text>{formatDate(listing.birth_date.toString())}</Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                  Available Date
                </Text>
                <Text>{formatDate(listing.available_date.toString())}</Text>
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
                  Breed
                </Text>
                <Text>{listing.breeds?.name?.charAt(0).toUpperCase() + listing.breeds?.name?.slice(1) || 'Not specified'}</Text>
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
                <Text>{listing.pet_gender?.charAt(0).toUpperCase() + listing.pet_gender?.slice(1) || 'Not specified'}</Text>
              </Box>


            </>
          )}
        </SimpleGrid>
      </VStack>

      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="semibold" color="brand.600">
          Parent Information
        </Text>

        <SimpleGrid columns={2} spacing={4}>
          {listing.parents?.sire ? (
            <>
              <Box>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                  Sire Name
                </Text>
                <Text>{listing.parents?.sire?.name || 'Not specified'}</Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                  Sire Breed
                </Text>
                <Text>{listing.parents?.sire?.breed || 'Not specified'}</Text>
              </Box>
            </>
          ) : (
            <Text>No sire information available.</Text>
          )}

          {listing.parents?.dam ? (
            <>
              <Box>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                  Dam Name
                </Text>
                <Text>{listing.parents?.dam?.name || 'Not specified'}</Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                  Dam Breed
                </Text>
                <Text>{listing.parents?.dam?.breed || 'Not specified'}</Text>
              </Box>
            </>
          ) : (
            <Text>No dam information available.</Text>
          )}
        </SimpleGrid>
      </VStack>

    </Stack>
  )
}

const ParentInfo = ({ listing }) => {
  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Box>
          <Text fontSize="lg" fontWeight="semibold" color="brand.600" mb={4}>
            Sire Information
          </Text>
          {listing.parents?.sire ? (
            <Stack>
              <SimpleGrid columns={2} spacing={4}>
                <Box>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                    Name
                  </Text>
                  <Text>{listing.parents?.sire?.name || 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                    Breed
                  </Text>
                  <Text>{listing.parents?.sire?.breed || 'Not specified'}</Text>
                </Box>
              </SimpleGrid>
            </Stack>

          ) : (
            <Text>No sire information available.</Text>
          )}
        </Box>

        <Box>
          <Text fontSize="lg" fontWeight="semibold" color="brand.600" mb={4}>
            Dam Information
          </Text>
          {listing.parents?.dam ? (
            <Stack >
              <SimpleGrid columns={2} spacing={4}>
                <Box>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                    Name
                  </Text>
                  <Text>{listing.parents?.dam?.name || 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                    Breed
                  </Text>
                  <Text>{listing.parents?.dam?.breed || 'Not specified'}</Text>
                </Box>
              </SimpleGrid>

            </Stack>
          ) : (
            <Text>No dam information available.</Text>
          )}
        </Box>
      </VStack>
    </Box>
  )
}

const HealthInfo = ({ listing }) => {
  return (
    <Stack>
      <Text fontSize="md" fontWeight="semibold" mb={3} color="brand.600">
        Health Information
      </Text>

      <Stack>
        <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
          Vaccinations ({listing.health?.vaccinations?.length || 0})
        </Text>
        <HStack>

          {listing.health?.vaccinations && listing.health?.vaccinations.length > 0 ? (
            listing.health?.vaccinations.map((vaccination, index) => (
              <Badge key={index} colorScheme="brand" variant="outline" px={2} py={1} borderRadius="md">
                <Text>{vaccination.type}</Text>
                <Text fontSize="xs" color="muted">{new Date(vaccination.date).toDateString()}</Text>
              </Badge>
            )
            )) : (
            <Text >No vaccinations added</Text>
          )}
        </HStack>
      </Stack>

      <Stack>
        <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
          Certificates ({listing.health?.certificates?.length || 0})
        </Text>
        {listing.health?.certificates && listing?.health?.certificates.length > 0 ? (
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
            {listing.health?.certificates.map((file, index) => (
              <Box key={index} borderRadius="md" overflow="hidden" borderWidth={1}>
                <Img
                  src={file && typeof file === 'string' ? file : URL.createObjectURL(file)}
                  alt={`Photo ${index + 1}`}
                  objectFit="cover"
                  w="full"
                  h="100px"
                />
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <Text >No certificates added</Text>
        )}
      </Stack>
      <Box>
        <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
          Medical Notes
        </Text>

        <Text>{listing.health?.medicalNotes || 'Not specified'}</Text>
      </Box>
    </Stack>


  )
}

const Requirements = ({ listing }) => {
  return (
    <Box gridColumn={{ base: 'span 1', md: 'span 2' }}>
      <Text fontSize="md" fontWeight="semibold" mb={3} color="brand.600">
        Adoption Requirements
      </Text>
      <SimpleGrid columns={2} spacing={4}>

        {listing.requirements && Object.keys(listing.requirements).length > 0 ? Object.keys(listing.requirements).map((key) => listing.requirements[key] && (
          <Box>
            <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
              {key}
            </Text>

            {typeof listing.requirements[key] === 'boolean' ? <Text>{listing.requirements[key] ? 'Yes' : 'No'}</Text> : <Text>{listing.requirements[key] || 'Not specified'}</Text>}
          </Box>
        )) : <Text>No requirements specified.</Text>}
      </SimpleGrid>
    </Box>
  )
}

const BreederInfo = ({ listing }) => {
  return (
    <BreederCard
      breeder={listing.users}
    />
  )
}


export default ListingDetailPage;
