import React, { useState, useEffect } from 'react';
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
  Stack,
  useBreakpointValue,
  Divider,
  AlertIcon,
  Alert,
  Avatar,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Icon,
} from '@chakra-ui/react';
import {
  ArrowBackIcon,
  CheckCircleIcon,
  WarningIcon,
  PhoneIcon,
  ChatIcon,
  TimeIcon
} from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useUserProfile } from '../../../hooks/queries/useUserProfile';
import { useApplication, useUpdateApplication } from '../../../hooks/queries/useApplications';
import { useTransactionsByApplication } from '../../../hooks/queries/useTransactions';
import { NextSeo } from 'next-seo';
import { Loader } from '../../ui/Loader';
import { ApplicationTimeline } from './ApplicationTimeline';
import { Gallery } from 'lib/components/ui/GalleryWithCarousel/Gallery';
import { PaymentModal } from '../payments/PaymentModal';
import { PaymentStatusModal } from '../payments/PaymentStatusModal';
import ApplicationStatusDialog from './ApplicationStatusDialog';
import { formatPrice } from 'lib/components/ui/PriceTag';
import { PageHeaderWithTwoButtons } from 'lib/components/ui/PageHeaderWithTwoButtons';
import { FiInfo, FiUser } from 'react-icons/fi';
import { BsListCheck } from 'react-icons/bs';

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
        router.push('/dashboard/adoptions');
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
            <Button onClick={() => router.push('/dashboard/adoptions')}>
              Back to Applications
            </Button>
          </VStack>
        </Center>
      </Container>
    );
  }

  const isOwner = userProfile?.id === application.listings.owner_id;
  // const isApplicant = userProfile?.id === application.seeker_id;
  const canUpdateStatus = isOwner && ['submitted', 'pending'].includes(application.status);
  const canWithdraw = !isOwner && application.status === 'submitted';

  const getTitle = () => {
    if (application.listings.title) return application.listings.title;
    if (application.listings.type === 'litter') {
      //@ts-ignore
      return `${application.listings.breeds?.name.charAt(0).toUpperCase() + application.listings.breeds?.name.slice(1)} Puppies`;
    } else {
      //@ts-ignore
      return `${application.listings.breeds?.name.charAt(0).toUpperCase() + application.listings.breeds?.name.slice(1)} ${application.listings.pet_age} old`;
    }
  }

  return (
    <>
      <NextSeo title={`Application for ${application.listings.title} - DogHouse Kenya`} />

      <Container maxW="7xl" pb={{ base: 4, md: 24 }}>
        <Stack spacing={{ base: 8, md: 16 }}>

          <Stack spacing="6">
            <PageHeaderWithTwoButtons
              title={getTitle()}
              description={
                <HStack spacing={2}>
                  <Badge colorScheme={getStatusColor(application.status)}>
                    {formatStatus(application.status)}
                  </Badge>
                  <Text fontSize="sm" color="gray.500">
                    Applied {formatDate(application.created_at.toString())}
                  </Text>
                </HStack>
              }
              buttonPrimary={canUpdateStatus ? {
                label: "Approve",
                onClick: handleApproveApplication,
                icon: <CheckCircleIcon />,
                colorScheme: "green",
              } : undefined}
              buttonSecondary={canUpdateStatus ? {
                label: "Reject",
                onClick: handleRejectApplication,
                icon: <WarningIcon />,
                colorScheme: "red",
                variant: "outline"
              } : canWithdraw ? {
                label: "Withdraw Application",
                onClick: handleWithdrawApplication,
                icon: <WarningIcon />,
                colorScheme: "red",
                variant: "outline"
              } : undefined}
            />

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <Stack spacing={4}>
                <Gallery
                  images={Array.from(application.listings.photos as string[]).map((photo) => ({ src: photo }))}
                  flex={1}
                  minW="50vw"
                >
                  <HStack spacing={3} mb={4} position="absolute" top="4" left="4" zIndex={1}>
                    <Badge colorScheme={application.listings.type === 'litter' ? 'blue' : 'green'}>
                      {application.listings.type === 'litter' ? 'Litter' : 'Single Pet'}
                    </Badge>
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
                      <Icon as={BsListCheck} />
                      <Text>Timeline</Text>
                    </HStack>
                  </Tab>
                  <Tab>
                    <HStack>
                      <Icon as={FiInfo} />
                      <Text>Info</Text>
                    </HStack>
                  </Tab>
                  <Tab>
                    <HStack>
                      <Icon as={FiUser} />
                      <Text>{isOwner ? 'Applicant' : 'Breeder'}</Text>
                    </HStack>
                  </Tab>
                </TabList>

                <TabPanels>
                  <TabPanel px={0}>
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
                  </TabPanel>
                  <TabPanel px={0}>
                    <ListingInfo application={application} />
                  </TabPanel>
                  <TabPanel px={0}>
                    {isOwner ? (
                      <ApplicantInfo application={application} />
                    ) : (
                      <BreederInfo application={application} formatDate={formatDate} />
                    )}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </SimpleGrid>
          </Stack>
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

// Listing Information Component
const ListingInfo = ({ application }) => {
  return (
    <VStack spacing={4} align="stretch">
      {/* Removed Gallery from here as it is now in main layout */}
      {/* Removed Divider */}

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
