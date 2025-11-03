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
  CardHeader,
  Badge,
  Box,
  SimpleGrid,
  useColorModeValue,
  Center,
  useToast,
  useDisclosure,
  ButtonGroup,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Stack,
  useBreakpointValue,
  Divider,
  AlertIcon,
  Alert,
  Avatar,
  Textarea,
  FormControl,
  FormLabel,
  Select,
  Grid,
  GridItem,
  Image,
} from '@chakra-ui/react';
import {
  ArrowBackIcon,
  CheckCircleIcon,
  WarningIcon,
  TimeIcon,
  PhoneIcon,
  EmailIcon,
  ChatIcon,
  CalendarIcon
} from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useUserProfile } from '../../../../hooks/queries';
import { useApplication, useUpdateApplicationStatus } from '../../../../hooks/queries/useApplications';
import { NextSeo } from 'next-seo';
import { Loader } from '../../../../components/ui/Loader';
import { ApplicationTimeline } from '../ApplicationTimeline';
import { Gallery } from 'lib/components/ui/GalleryWithCarousel/Gallery';

interface ApplicationDetailPageProps {
  id: string;
}

const ApplicationDetailPage: React.FC<ApplicationDetailPageProps> = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();

  const { data: application, isLoading: applicationLoading, error: applicationError } = useApplication(id as string);
  const updateStatusMutation = useUpdateApplicationStatus();

  const [updateForm, setUpdateForm] = useState({
    status: '',
    response_message: '',
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'blue';
      case 'pending': return 'yellow';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'completed': return 'purple';
      default: return 'gray';
    }
  };
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateStatusMutation.mutateAsync({
        id: application.id,
        //@ts-ignore
        status: updateForm.status,
        response_message: updateForm.response_message,
      });

      toast({
        title: 'Application updated',
        description: `Application status changed to ${formatStatus(updateForm.status)}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setUpdateForm({ status: '', response_message: '' });
      onUpdateClose();
    } catch (error) {
      toast({
        title: 'Error updating application',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };


  if (profileLoading || applicationLoading) {
    return <Loader />;
  }

  if (applicationError) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error loading application. Please try again later.
        {applicationError.message}
      </Alert>
    );
  }

  if (!application) {
    return (
      <Container maxW="7xl" py={8}>
        <Center h="400px">
          <VStack spacing={4}>
            <Text fontSize="lg" color="gray.500">Application not found</Text>
            <Button onClick={() => router.push('/dashboard/applications')}>
              Back to Applications
            </Button>
          </VStack>
        </Center>
      </Container>
    );
  }

  const isOwner = userProfile?.id === application.listings.owner_id;
  const isApplicant = userProfile?.id === application.seeker_id;
  const canUpdateStatus = isOwner && ['submitted', 'pending'].includes(application.status);

  const getTitle = () => {
    if (application.listings.title) return application.listings.title;
    if (application.listings.type === 'litter') {
      //@ts-ignore
      return `${application.listings.breeds?.name.charAt(0).toUpperCase() + application.listings.breeds?.name.slice(1)} Puppies`;
    } else {
      //@ts-ignore
      return `${application.listings.breeds?.name.charAt(0).toUpperCase() + listing.breeds?.name.slice(1)} ${listing.pet_age} old`;
    }
  }

  const getAge = () => {
    const today = new Date();
    const birthDate = new Date(application.listings.birth_date);

    const age = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
    return age;
  }


  return (
    <>
      <NextSeo title={`Application for ${application.listings.title} - DogHouse Kenya`} />

      <Container maxW="7xl" py={{ base: 4, md: 0 }}>
        {isMobile && (
          <Button
            leftIcon={<ArrowBackIcon />}
            variant="ghost"
            onClick={() => router.push('/dashboard/applications')}
            mb={4}
            p={0}
          >
            Back to Applications
          </Button>
        )}

        <Stack spacing={6}>
          <HStack justify="space-between" align="start" wrap="wrap" spacing={4}>
            <Box flex={1}>
              <Heading size={{ base: 'sm', lg: 'md' }} mb={2}>
                Application for {getTitle()}
              </Heading>
              <HStack spacing={3}>
                <Badge colorScheme={getStatusColor(application.status)} variant="solid">
                  {formatStatus(application.status)}
                </Badge>
                <Text fontSize="sm" color="gray.500">
                  Applied {formatDate(application.created_at.toString())}
                </Text>
              </HStack>
            </Box>

            {canUpdateStatus && (
              <ButtonGroup>
                <Button
                  leftIcon={<CheckCircleIcon />}
                  colorScheme="green"
                  onClick={() => {
                    setUpdateForm({ status: 'approved', response_message: '' });
                    onUpdateOpen();
                  }}
                >
                  Approve
                </Button>
                <Button
                  leftIcon={<WarningIcon />}
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    setUpdateForm({ status: 'rejected', response_message: '' });
                    onUpdateOpen();
                  }}
                >
                  Reject
                </Button>
              </ButtonGroup>
            )}
          </HStack>

          {/* <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} minChildWidth="300px"> */}
          <Box
            sx={{
              columnCount: [1, 2], // Responsive column count
              columnGap: 4,
            }}
          >
            <Card
              sx={{ display: 'inline-block', width: '100%' }}
              mb={4}
            >
              <CardHeader>
                <Heading size="xs">Application Timeline</Heading>
              </CardHeader>
              <CardBody>
                <ApplicationTimeline
                  application={application}
                  userProfile={userProfile}
                  onPayReservation={() => {
                    toast({
                      title: 'Payment feature coming soon',
                      description: 'M-Pesa integration will be available soon',
                      status: 'info',
                      duration: 3000,
                    });
                  }}
                  onSignContract={() => {
                    toast({
                      title: 'Contract signing coming soon',
                      description: 'Digital contract signing will be available soon',
                      status: 'info',
                      duration: 3000,
                    });
                  }}
                  onCompletePayment={() => {
                    toast({
                      title: 'Payment feature coming soon',
                      description: 'Final payment processing will be available soon',
                      status: 'info',
                      duration: 3000,
                    });
                  }}
                  onMarkCompleted={() => {
                    // Mark application as completed
                    handleStatusUpdate({
                      preventDefault: () => { },
                      target: { value: 'completed' }
                    } as any);
                  }}
                />
              </CardBody>
            </Card>


            <Card
              sx={{ display: 'inline-block', width: '100%' }}
              mb={4}
            >
              <CardHeader>
                <Heading size="xs">Application Details</Heading>
              </CardHeader>
              <CardBody>
                <ApplicationDetails application={application} />
              </CardBody>
            </Card>

            <Card
              sx={{ display: 'inline-block', width: '100%' }}
              mb={4}
            >
              <CardHeader>
                <Heading size="xs">Listing Information</Heading>
              </CardHeader>
              <CardBody>
                <ListingInfo application={application} />
              </CardBody>
            </Card>


          </Box>
          {/* </SimpleGrid> */}
          <Card
            sx={{ display: 'inline-block', width: '100%' }}
            mb={4}
          >
            <CardHeader>
              <Heading size="xs">
                {isOwner ? 'Applicant Information' : 'Breeder Information'}
              </Heading>
            </CardHeader>
            <CardBody>
              {isOwner ? (
                <ApplicantInfo application={application} />
              ) : (
                <BreederInfo application={application} formatDate={formatDate} />
              )}
            </CardBody>
          </Card>
        </Stack>
      </Container>

      {/* Status Update Modal */}
      <AlertDialog isOpen={isUpdateOpen} leastDestructiveRef={undefined} onClose={onUpdateClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Update Application Status
            </AlertDialogHeader>
            <AlertDialogBody>
              <form onSubmit={handleStatusUpdate}>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={updateForm.status}
                      onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                      required
                    >
                      <option value="pending">Pending Review</option>
                      <option value="approved">Approve Application</option>
                      <option value="rejected">Reject Application</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Response Message (Optional)</FormLabel>
                    <Textarea
                      value={updateForm.response_message}
                      onChange={(e) => setUpdateForm({ ...updateForm, response_message: e.target.value })}
                      placeholder="Add a message for the applicant..."
                      rows={3}
                    />
                  </FormControl>
                </VStack>
              </form>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onUpdateClose}>Cancel</Button>
              <Button
                colorScheme={updateForm.status === 'approved' ? 'green' : 'red'}
                onClick={handleStatusUpdate}
                ml={3}
                isLoading={updateStatusMutation.isPending}
              >
                Update Status
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

// Application Details Component
const ApplicationDetails = ({ application }) => {
  return (
    <VStack spacing={4} align="stretch">
      <SimpleGrid columns={2} spacing={4}>
        <Box>
          <Text fontSize="sm" color="gray.500" textTransform="uppercase" mb={1}>
            Application Message
          </Text>
          <Text>{application.application_data?.message || 'No message provided'}</Text>
        </Box>

        {application.application_data?.timeline && (
          <Box>
            <Text fontSize="sm" color="gray.500" textTransform="uppercase" mb={1}>
              Timeline
            </Text>
            <Text>{application.application_data.timeline}</Text>
          </Box>
        )}

        {application.application_data?.offer_price && (
          <Box>
            <Text fontSize="sm" color="gray.500" textTransform="uppercase" mb={1}>
              Offer Price
            </Text>
            <Text>Ksh. {application.application_data.offer_price}</Text>
          </Box>
        )}

        {application.application_data?.contact_preference && (
          <Box>
            <Text fontSize="sm" color="gray.500" textTransform="uppercase" mb={1}>
              Preferred Contact
            </Text>
            <Text>{application.application_data.contact_preference}</Text>
          </Box>
        )}

        {application.application_data?.allergies && (
          <Box>
            <Text fontSize="sm" color="gray.500" textTransform="uppercase" mb={1}>
              Allergies/Concerns
            </Text>
            <Text>{application.application_data.allergies}</Text>
          </Box>
        )}
      </SimpleGrid>

      {/* Profile Information */}

    </VStack>
  );
};

// Listing Information Component
const ListingInfo = ({ application }) => {
  const primaryPhoto = application.listings.photos?.[0] || '/images/doggo.png';

  return (
    <VStack spacing={4} align="stretch">
      <Gallery
        images={Array.from(application.listings.photos as string[]).map((photo) => ({ src: photo }))}
        flex={1}
        minW="50vw"
      >

      </Gallery>
      <Divider />

      <SimpleGrid columns={2} spacing={4}>
        <Box>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Type
          </Text>
          <Text>{application.listings.type}</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Breed
          </Text>
          <Text>{application.listings.breeds?.name || 'Unknown'}</Text>
        </Box>
        {application.listings.type === 'litter' && (
          <>
            <Box>
              <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                Birth Date
              </Text>
              <Text>{application.listings.birth_date ? new Date(application.listings.birth_date).toLocaleDateString() : 'Not specified'}</Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                Puppies
              </Text>
              <Text>{application.listings.number_of_puppies || 'Not specified'}</Text>
            </Box>
          </>
        )}
        {application.listings.type === 'single_pet' && (
          <>
            <Box>
              <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                Age
              </Text>
              <Text>{application.listings.pet_age || 'Not specified'}</Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                Gender
              </Text>
              <Text>{application.listings.pet_gender || 'Not specified'}</Text>
            </Box>
          </>
        )}
        <Box>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Price
          </Text>
          <Text>Ksh. {
            application?.application_data?.offer_price && application.status === 'approved' ? application.application_data.offer_price :
              application.listings.price || 'Not specified'
          }</Text>
        </Box>

        <Box>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Reservation Fee
          </Text>
          <Text>{application.listings.reservation_fee || 'Not specified'}</Text>
        </Box>


      </SimpleGrid>
    </VStack>
  );
};

// Applicant Information Component
const ApplicantInfo = ({ application }) => {
  return (
    <VStack spacing={4} align="stretch">

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <Stack>

          <HStack spacing={4}>
            <Avatar
              src={application.users.profile_photo_url || undefined}
              name={application.users.display_name}
              size="lg"
            />
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold" fontSize="lg">{application.users.display_name}</Text>
              <Text color="gray.600">{application.users.email}</Text>
              <Text color="gray.600">{application.users.phone || 'No phone number'}</Text>
            </VStack>
          </HStack>
          <HStack spacing={4} pt={2}>
            <Button leftIcon={<EmailIcon />} size="sm" variant="outline">
              Email Applicant
            </Button>
            <Button leftIcon={<PhoneIcon />} size="sm" variant="outline">
              Call Applicant
            </Button>
            <Button leftIcon={<ChatIcon />} size="sm" variant="outline">
              Message
            </Button>
          </HStack>

        </Stack>

        <SimpleGrid columns={2} spacing={4}>
          <Box>
            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
              Location
            </Text>
            <Text>{application.users.location_text || 'Not specified'}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
              Member Since
            </Text>
            <Text>{new Date(application.users.created_at).toLocaleDateString()}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
              Experience Level
            </Text>
            <Text>{application.users?.seeker_profiles?.experience_level || 'Not specified'}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
              Living Situation
            </Text>
            <Text>{application.users?.seeker_profiles?.living_situation || 'Not specified'}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
              Children
            </Text>
            <Text>{application.application_data?.has_children ? 'Yes' : 'No'}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
              Other Pets
            </Text>
            <Text>{application.users?.seeker_profiles?.has_other_pets ? 'Yes' : 'No'}</Text>
          </Box>
        </SimpleGrid>
      </SimpleGrid>


    </VStack>
  );
};

// Breeder Information Component
const BreederInfo = ({ application, formatDate }) => {
  return (
    <VStack spacing={4} align="stretch">
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <Stack>
          <HStack spacing={4}>
            <Avatar
              src={application.listings.users?.profile_photo_url || undefined}
              name={application.listings.users?.display_name || 'Breeder'}
              size="lg"
            />
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold" fontSize="lg">
                {application.listings.users?.display_name || 'Breeder'}
              </Text>
              <Text color="gray.600">{application.listings.users?.email || 'No email'}</Text>
              <Text color="gray.600">{application.listings.users?.phone || 'No phone'}</Text>
            </VStack>
          </HStack>
          <HStack spacing={4} pt={2}>
            {/* <Button leftIcon={<EmailIcon />} size="sm" variant="outline">
          Contact Breeder
        </Button> */}
            <Button leftIcon={<PhoneIcon />} size="sm" variant="outline">
              Call Breeder
            </Button>
            <Button leftIcon={<ChatIcon />} size="sm" variant="outline">
              Message
            </Button>
          </HStack>

        </Stack>

        <SimpleGrid columns={2} spacing={4}>
          <Box>
            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
              Location
            </Text>
            <Text>{application.listings?.users?.location_text || 'Not specified'}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
              Listing Created
            </Text>
            <Text>{formatDate(application.listings.created_at)}</Text>
          </Box>
        </SimpleGrid>
      </SimpleGrid>




    </VStack>
  );
};



function BentoGridExample() {
  return (
    <Grid
      templateColumns={{
        base: 'repeat(1, 1fr)',
        md: 'repeat(3, 1fr)', // 3 columns on medium screens and up
      }}
      gap={4}
      p={5}
    >
      {/* Large card, spanning 2 columns on desktop */}
      <GridItem
        colSpan={{ base: 1, md: 2 }}
        bg="teal.500"
        p={6}
        borderRadius="xl"
        color="white"
      >
        <Heading size="md" mb={2}>
          Large Bento Card
        </Heading>
        <Text>
          This item spans two columns on medium screens and larger, perfect for
          highlighting key information.
        </Text>
      </GridItem>

      {/* Small card */}
      <GridItem bg="purple.500" p={6} borderRadius="xl" color="white">
        <Heading size="md" mb={2}>
          Small Card
        </Heading>
        <Text>A simple, single-column card.</Text>
      </GridItem>

      {/* Another small card */}
      <GridItem bg="orange.500" p={6} borderRadius="xl" color="white">
        <Heading size="md" mb={2}>
          Another Small Card
        </Heading>
        <Text>Another one.</Text>
      </GridItem>

      {/* Large card, spanning 2 columns on desktop */}
      <GridItem
        colSpan={{ base: 1, md: 2 }}
        bg="cyan.500"
        p={6}
        borderRadius="xl"
        color="white"
      >
        <Heading size="md" mb={2}>
          Another Large Card
        </Heading>
        <Text>
          This one also spans two columns, showing a different content type.
        </Text>
      </GridItem>
    </Grid>
  );
}

const CustomGrid = () => {
  return (
    <Grid
      templateAreas={`"nav main main"
                      "nav aside aside"`}
      gridTemplateRows={'1fr 2fr'}
      gridTemplateColumns={'1fr 3fr 1fr'}
      gap="4"
    >
      <GridItem bg="pink.300" area={'nav'}>
        <Box height="100%">Nav</Box>
      </GridItem>
      <GridItem bg="cyan.300" area={'main'}>
        <Box height="100%">Main Content</Box>
      </GridItem>
      <GridItem bg="purple.300" area={'aside'}>
        <Box height="100%">Aside</Box>
      </GridItem>
    </Grid>
  );
};

const ColumnMasonry = () => {
  const items = [
    { height: '150px', content: 'Card 1' },
    { height: '200px', content: 'Card 2' },
    { height: '100px', content: 'Card 3' },
    { height: '250px', content: 'Card 4' },
    { height: '180px', content: 'Card 5' },
    { height: '120px', content: 'Card 6' },
    { height: '220px', content: 'Card 7' },
    { height: '170px', content: 'Card 8' },
    { height: '210px', content: 'Card 9' },
  ];

  return (
    <Box
      sx={{
        columnCount: [1, 2, 3], // Responsive column count
        columnGap: 4,
      }}
    >
      {items.map((item, index) => (
        <Box
          key={index}
          h={item.height}
          bg="teal.400"
          borderRadius="md"
          mb={4}
          p={4}
          sx={{ display: 'inline-block', width: '100%' }}
        >
          {item.content}
        </Box>
      ))}
    </Box>
  );
};


export default ApplicationDetailPage;
