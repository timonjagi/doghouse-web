import React, { useState, useEffect } from 'react';
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
  Stack,
  useBreakpointValue,
  Divider,
  AlertIcon,
  Alert,
  Avatar,
} from '@chakra-ui/react';
import {
  ArrowBackIcon,
  CheckCircleIcon,
  WarningIcon,
  PhoneIcon,
  EmailIcon,
  ChatIcon
} from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useUserProfile } from '../../../../hooks/queries';
import { useApplication, useUpdateApplication } from '../../../../hooks/queries/useApplications';
import { useTransactionsByApplication } from '../../../../hooks/queries/useTransactions';
import { NextSeo } from 'next-seo';
import { Loader } from '../../../../components/ui/Loader';
import { ApplicationTimeline } from '../ApplicationTimeline';
import { Gallery } from 'lib/components/ui/GalleryWithCarousel/Gallery';
import { PaymentModal } from '../../../../components/payments/PaymentModal';
import { PaymentStatusModal } from '../../../../components/payments/PaymentStatusModal';
import ApplicationStatusDialog from '../ApplicationStatusDialog';
import { formatPrice } from 'lib/components/ui/PriceTag';

interface ApplicationDetailPageProps {
  id: string;
}

const ApplicationDetailPage: React.FC<ApplicationDetailPageProps> = () => {
  const router = useRouter();
  const { id, payment } = router.query;
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();

  const { data: application, isLoading: applicationLoading, error: applicationError } = useApplication(id as string);
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useTransactionsByApplication(id as string);
  const updateApplicationMutation = useUpdateApplication();

  const [updateForm, setUpdateForm] = useState({
    status: '',
    response_message: '',
  });

  const [pendingAction, setPendingAction] = useState<{
    type: 'withdraw' | 'approve' | 'reject' | 'complete' | null;
    status: string;
    title: string;
    message: string;
    confirmText: string;
    colorScheme: string;
  } | null>(null);

  // Payment modal states
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    type: 'reservation' | 'final';
    amount: number;
    description: string;
  }>({
    isOpen: false,
    type: 'reservation',
    amount: 0,
    description: '',
  });

  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    paymentReference: string;
    paymentType: 'reservation' | 'final';
    expectedAmount: number;
  }>({
    isOpen: false,
    paymentReference: '',
    paymentType: 'reservation',
    expectedAmount: 0,
  });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString as string).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pendingAction) return;

    try {
      await updateApplicationMutation.mutateAsync({
        id: application.id,
        updates: {
          status: pendingAction.status,
          application_data: {
            ...application.application_data as any,
            response_message: updateForm.response_message || pendingAction.message,
          }
        }
      });

      toast({
        title: pendingAction.title,
        description: pendingAction.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setUpdateForm({ status: '', response_message: '' });
      setPendingAction(null);
      onUpdateClose();

      // Redirect for withdrawal
      if (pendingAction.type === 'withdraw') {
        router.push('/dashboard/applications');
      }
    } catch (error) {
      toast({
        title: `Error ${pendingAction.type === 'withdraw' ? 'withdrawing' : pendingAction.type === 'approve' ? 'approving' : 'rejecting'} application`,
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const initiateAction = (action: 'withdraw' | 'approve' | 'reject' | 'complete') => {
    let actionConfig;

    switch (action) {
      case 'withdraw':
        actionConfig = {
          type: 'withdraw' as const,
          status: 'rejected',
          title: 'Application Withdrawn',
          message: 'Your application has been successfully withdrawn',
          confirmText: 'Withdraw Application',
          colorScheme: 'red',
        };
        break;
      case 'approve':
        actionConfig = {
          type: 'approve' as const,
          status: 'approved',
          title: 'Approve Application',
          message: 'The application has been approved successfully',
          confirmText: 'Approve Application',
          colorScheme: 'green',
        };
        break;
      case 'reject':
        actionConfig = {
          type: 'reject' as const,
          status: 'rejected',
          title: 'Reject Application',
          message: 'The application has been rejected',
          confirmText: 'Reject Application',
          colorScheme: 'red',
        };
        break;
      case 'complete':
        actionConfig = {
          type: 'complete' as const,
          status: 'completed',
          title: 'Complete Application',
          message: 'The adoption process has been marked as completed',
          confirmText: 'Mark as Completed',
          colorScheme: 'purple',
        };
        break;
    }

    setPendingAction(actionConfig);
    setUpdateForm({ status: actionConfig.status, response_message: '' });
    onUpdateOpen();
  };

  const handleWithdrawApplication = () => initiateAction('withdraw');
  const handleApproveApplication = () => initiateAction('approve');
  const handleRejectApplication = () => initiateAction('reject');
  const handleMarkCompleted = () => initiateAction('complete');

  // Payment handlers
  const handlePayReservation = () => {
    setPaymentModal({
      isOpen: true,
      type: 'reservation',
      amount: Number(application.listings.reservation_fee) || 0,
      description: `Reservation fee for ${application.listings.title}`,
    });
  };

  const handleSignContract = async () => {
    // In the future, this could integrate with a digital signature service
    try {
      await updateApplicationMutation.mutateAsync({
        id: application.id,
        updates: { contract_signed: true }
      });

      toast({
        title: 'Contract Signed',
        description: 'You have successfully signed the adoption contract',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign contract',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCompletePayment = () => {
    const finalAmount = Number(application.listings.price) - Number(application.listings.reservation_fee);
    setPaymentModal({
      isOpen: true,
      type: 'final',
      amount: finalAmount,
      description: `Final payment for ${application.listings.title}`,
    });
  };

  // Modal handlers
  const handlePaymentModalClose = () => {
    setPaymentModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleStatusModalClose = () => {
    setStatusModal(prev => ({ ...prev, isOpen: false }));
  };

  // Handle payment success callback from Paystack
  useEffect(() => {
    if (payment === 'success' && application && !statusModal.isOpen && transactions) {
      // Determine payment type based on application state
      let paymentType: 'reservation' | 'final' = 'reservation';
      let expectedAmount = Number(application.listings.reservation_fee) || 0;

      if (application.reservation_paid && !application.payment_completed) {
        paymentType = 'final';
        expectedAmount = Number(application.listings.price) - Number(application.listings.reservation_fee);
      }
      const transaction = transactions?.find(tx => tx.status === 'pending');
      // Show payment status modal
      setStatusModal({
        isOpen: true,
        paymentReference: (transaction.meta as any).paystack_reference,
        paymentType,
        expectedAmount,
      });

      // Clean up URL by removing the payment parameter
      const newUrl = router.pathname.replace('[id]', id as string);
      router.replace(newUrl, undefined, { shallow: true });
    }
  }, [payment, application, transactions, statusModal.isOpen, router, id]);

  if (profileLoading || applicationLoading || transactionsLoading) {
    return <Loader />;
  }

  if (applicationError || transactionsError) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error loading application. Please try again later.
        {applicationError?.message || transactionsError?.message}
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

      <Container maxW="7xl" py={{ base: 4, md: 0 }} >
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          onClick={() => router.push('/dashboard/applications')}
          mb={4}
          p={0}
        >
          Back to Applications
        </Button>


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
                  onClick={handleApproveApplication}
                >
                  Approve
                </Button>
                <Button
                  leftIcon={<WarningIcon />}
                  colorScheme="red"
                  variant="outline"
                  onClick={handleRejectApplication}
                >
                  Reject
                </Button>
              </ButtonGroup>
            )}
          </HStack>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} minChildWidth="300px">
            {/* <Box
            sx={{
              columnCount: [1, 2], // Responsive column count
              columnGap: 4,
            }}
          > */}
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
                  transactions={transactions}
                  onPayReservation={handlePayReservation}
                  onSignContract={handleSignContract}
                  onCompletePayment={handleCompletePayment}
                  onMarkCompleted={handleMarkCompleted}
                  onWithdrawApplication={handleWithdrawApplication}
                  onApproveApplication={handleApproveApplication}
                  onRejectApplication={handleRejectApplication}
                  onCheckPaymentStatus={(reference, type) => {
                    setStatusModal({
                      isOpen: true,
                      paymentReference: reference,
                      paymentType: type,
                      expectedAmount: type === 'reservation'
                        ? Number(application.listings.reservation_fee)
                        : Number(application.listings.price) - Number(application.listings.reservation_fee),
                    });
                  }}
                />
              </CardBody>
            </Card>

            {/* <Card
              sx={{ display: 'inline-block', width: '100%' }}
              mb={4}
            >
              <CardHeader>
                <Heading size="xs">Application Details</Heading>
              </CardHeader>
              <CardBody>
                <ApplicationDetails application={application} formatDate={formatDate} />
              </CardBody>
            </Card> */}



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




            {/* </Box> */}
          </SimpleGrid>
          <Card
            // sx={{ display: 'inline-block', width: '100%' }}
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
      <ApplicationStatusDialog
        form={updateForm}
        setForm={setUpdateForm}
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        pendingAction={pendingAction}
        setPendingAction={setPendingAction}
        onSubmit={handleStatusUpdate}
        isLoading={updateApplicationMutation.isPending}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={handlePaymentModalClose}
        application={application}
        paymentType={paymentModal.type}
      />

      {/* Payment Status Modal */}
      <PaymentStatusModal
        isOpen={statusModal.isOpen}
        onClose={handleStatusModalClose}
        paymentReference={statusModal.paymentReference}
        paymentType={statusModal.paymentType}
        expectedAmount={statusModal.expectedAmount}
        applicationId={id as string}
      />
    </>
  );
};

// Application Details Component
const ApplicationDetails = ({ application, formatDate }) => {
  return (
    <VStack spacing={4} align="stretch">
      <SimpleGrid columns={2} spacing={4}>

        <Box>
          <Text fontSize="sm" color="gray.500" textTransform="uppercase" mb={1}>
            Application Date
          </Text>
          <Text>{formatDate(application.created_at.toString())}</Text>
        </Box>


        <Box>
          <Text fontSize="sm" color="gray.500" textTransform="uppercase" mb={1}>
            Application Message
          </Text>
          <Text>{application.application_data?.message || 'No message provided'}</Text>
        </Box>

        {application.application_data?.offer_price && (
          <Box>
            <Text fontSize="sm" color="gray.500" textTransform="uppercase" mb={1}>
              Offer Price
            </Text>
            <Text>Ksh. {application.application_data.offer_price}</Text>
          </Box>
        )}

        {application.listings.type === 'litter' && application.application_data?.quantity && (
          <Box>
            <Text fontSize="sm" color="gray.500" textTransform="uppercase" mb={1}>
              Quantity
            </Text>
            <Text>{application.application_data.quantity}</Text>
          </Box>
        )}

      </SimpleGrid>

    </VStack>
  );
};

// Listing Information Component
const ListingInfo = ({ application }) => {
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

          <Box>
            <Text>
              {formatPrice(application.listings.price * (application.application_data?.quantity || 1))}
            </Text>
            {application.listings.type === 'litter' && <Text fontSize="xs" color="muted">
              {formatPrice(application.listings.price)} each x {application.application_data?.quantity || 1}
            </Text>}
          </Box>

        </Box>

        <Box>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Reservation Fee
          </Text>
          <Box>
            <Text>{formatPrice(application.listings.reservation_fee * (application.application_data?.quantity || 1))}</Text>

            {application.listings.type === 'litter' && <Text fontSize="xs" color="muted">
              {formatPrice(application.listings.reservation_fee)} each x {application.application_data?.quantity || 1}
            </Text>}
          </Box>
        </Box>


      </SimpleGrid>
    </VStack>
  );
};

// Applicant Information Component
const ApplicantInfo = ({ application }) => {
  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>

      <Stack>
        <HStack spacing={4}>
          <Avatar
            src={application.users.profile_photo_url || undefined}
            name={application.users.display_name}
            size="lg"
          />
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold" fontSize="lg">{application.users.display_name}</Text>
            <Text color="gray.600">{application.users.email.replace(
              application.users.email.split('@')[0],
              application.users.email.split('@')[0].slice(0, 3) + '***'
            )}</Text>
          </VStack>
        </HStack>


        <HStack spacing={4} pt={2}>
          <Button leftIcon={<PhoneIcon />} size="sm" variant="outline" isDisabled={!application?.reservation_paid}>
            Call Applicant
          </Button>
          <Button leftIcon={<ChatIcon />} size="sm" variant="outline" isDisabled={!application?.reservation_paid}>
            Message Applicant
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
  );
};

// Breeder Information Component
const BreederInfo = ({ application, formatDate }) => {
  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>

      <Stack spacing={4} >
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
            <Text color="gray.600">{application.listings.users?.email.replace(
              application.listings.users?.email.split('@')[0],
              application.listings.users?.email.split('@')[0].slice(0, 3) + '***'
            )}</Text>
          </VStack>
        </HStack>

        <HStack spacing={4} pt={2}>

          <Button leftIcon={<PhoneIcon />} size="sm" variant="outline" isDisabled={application?.reservation_paid}>
            Call Breeder
          </Button>
          <Button leftIcon={<ChatIcon />} size="sm" variant="outline" isDisabled={application?.reservation_paid}>
            Message Breeder
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
  );
};


export default ApplicationDetailPage;
