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
  IconButton,
  useBreakpointValue,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Divider,
  AlertIcon,
  Alert,
  Spacer,
  Avatar,
  Progress,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Textarea,
  FormControl,
  FormLabel,
  Select,
  Flex,
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
  EditIcon,
  DeleteIcon,
  CalendarIcon
} from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useUserProfile } from '../../../../hooks/queries';
import { useApplication, useUpdateApplicationStatus } from '../../../../hooks/queries/useApplications';
import { NextSeo } from 'next-seo';
import { Loader } from '../../../../components/ui/Loader';

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon color="green.500" />;
      case 'rejected': return <WarningIcon color="red.500" />;
      case 'submitted':
      case 'pending': return <TimeIcon color="yellow.500" />;
      case 'completed': return <CheckCircleIcon color="purple.500" />;
      default: return <CalendarIcon />;
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

  const getApplicationSteps = () => {
    const steps = [
      { title: 'Submitted', description: 'Application submitted', status: 'submitted' },
      { title: 'Under Review', description: 'Being reviewed by breeder', status: 'pending' },
      { title: 'Decision Made', description: application?.status === 'approved' ? 'Application approved' : 'Application rejected', status: application?.status },
    ];

    if (application?.status === 'approved') {
      steps.push({ title: 'Completed', description: 'Adoption completed', status: 'completed' });
    }

    return steps;
  };

  const getCurrentStep = () => {
    switch (application?.status) {
      case 'submitted': return 0;
      case 'pending': return 1;
      case 'approved':
      case 'rejected': return 2;
      case 'completed': return 3;
      default: return 0;
    }
  };

  const { activeStep } = useSteps({
    index: getCurrentStep(),
    count: getApplicationSteps().length,
  });

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
                Application for {application.listings.title}
              </Heading>
              <HStack spacing={3}>
                <Badge colorScheme={getStatusColor(application.status)} variant="solid">
                  {formatStatus(application.status)}
                </Badge>
                <Text fontSize="sm" color="gray.500">
                  Applied {formatDate(application.created_at)}
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

          {/* Application Timeline */}
          <Card>
            <CardHeader>
              <Heading size="md">Application Timeline</Heading>
            </CardHeader>
            <CardBody>
              <Stepper index={activeStep} orientation="horizontal" size="lg">
                {getApplicationSteps().map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>
                    <Box flexShrink="0">
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                    </Box>
                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>
            </CardBody>
          </Card>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            {/* Application Details */}
            <Card>
              <CardHeader>
                <Heading size="md">Application Details</Heading>
              </CardHeader>
              <CardBody>
                <ApplicationDetails application={application} />
              </CardBody>
            </Card>

            {/* Listing Information */}
            <Card>
              <CardHeader>
                <Heading size="md">Listing Information</Heading>
              </CardHeader>
              <CardBody>
                <ListingInfo application={application} />
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Applicant/Owner Information */}
          <Card>
            <CardHeader>
              <Heading size="md">
                {isOwner ? 'Applicant Information' : 'Breeder Information'}
              </Heading>
            </CardHeader>
            <CardBody>
              {isOwner ? (
                <ApplicantInfo application={application} />
              ) : (
                <BreederInfo application={application} />
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

      {application.application_data?.budget_range && (
        <Box>
          <Text fontSize="sm" color="gray.500" textTransform="uppercase" mb={1}>
            Budget Range
          </Text>
          <Text>{application.application_data.budget_range}</Text>
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

      {/* Profile Information */}
      <Divider />
      <Text fontSize="sm" color="gray.500" textTransform="uppercase" mb={2}>
        Profile Information
      </Text>

      <SimpleGrid columns={2} spacing={4}>
        <Box>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Experience Level
          </Text>
          <Text>{application.application_data?.experience_level || 'Not specified'}</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Living Situation
          </Text>
          <Text>{application.application_data?.living_situation || 'Not specified'}</Text>
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
          <Text>{application.application_data?.has_other_pets ? 'Yes' : 'No'}</Text>
        </Box>
      </SimpleGrid>
    </VStack>
  );
};

// Listing Information Component
const ListingInfo = ({ application }) => {
  const primaryPhoto = application.listings.photos?.[0] || '/images/doggo.png';

  return (
    <VStack spacing={4} align="stretch">
      <Grid templateColumns="100px 1fr" gap={4}>
        <GridItem>
          <Image
            src={primaryPhoto}
            alt={application.listings.title}
            width="100px"
            height="100px"
            objectFit="cover"
            borderRadius="md"
          />
        </GridItem>
        <GridItem>
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold">{application.listings.title}</Text>
            <Text fontSize="sm" color="gray.600">
              {application.listings.breeds?.name || 'Unknown Breed'}
            </Text>
            <Badge colorScheme="blue">
              {application.listings.type === 'litter' ? 'Litter' : 'Single Pet'}
            </Badge>
            <Text fontSize="lg" fontWeight="bold" color="green.600">
              {application.listings.price ? `KSH ${application.listings.price.toLocaleString()}` : 'Price not set'}
            </Text>
          </VStack>
        </GridItem>
      </Grid>

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
      </SimpleGrid>
    </VStack>
  );
};

// Applicant Information Component
const ApplicantInfo = ({ application }) => {
  return (
    <VStack spacing={4} align="stretch">
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

      <Divider />

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
      </SimpleGrid>

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
    </VStack>
  );
};

// Breeder Information Component
const BreederInfo = ({ application }) => {
  return (
    <VStack spacing={4} align="stretch">
      <HStack spacing={4}>
        <Avatar
          src={application.listings.owner_profile?.profile_photo_url || undefined}
          name={application.listings.owner_profile?.display_name || 'Breeder'}
          size="lg"
        />
        <VStack align="start" spacing={1}>
          <Text fontWeight="bold" fontSize="lg">
            {application.listings.owner_profile?.display_name || 'Breeder'}
          </Text>
          <Text color="gray.600">{application.listings.owner_profile?.email || 'No email'}</Text>
          <Text color="gray.600">{application.listings.owner_profile?.phone || 'No phone'}</Text>
        </VStack>
      </HStack>

      <Divider />

      <SimpleGrid columns={2} spacing={4}>
        <Box>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Location
          </Text>
          <Text>{application.listings.location_text || 'Not specified'}</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Listing Created
          </Text>
          <Text>{new Date(application.listings.created_at).toLocaleDateString()}</Text>
        </Box>
      </SimpleGrid>

      <HStack spacing={4} pt={2}>
        <Button leftIcon={<EmailIcon />} size="sm" variant="outline">
          Contact Breeder
        </Button>
        <Button leftIcon={<PhoneIcon />} size="sm" variant="outline">
          Call Breeder
        </Button>
        <Button leftIcon={<ChatIcon />} size="sm" variant="outline">
          Message
        </Button>
      </HStack>
    </VStack>
  );
};

export default ApplicationDetailPage;
