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
  Center,
  useToast,
  useDisclosure,
  Stack,
  Avatar,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Icon,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import {
  CheckCircleIcon,
  WarningIcon,
  PhoneIcon,
  ChatIcon,
} from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useUserProfile } from '../../../hooks/queries/useUserProfile';
import {
  useAdoption,
  useAdoptionActions,
  useAdoptionTimelineLogic,
  AdoptionWithListing,
  AdoptionStatusHistory,
} from '../../../hooks/queries/useAdoptions';
import { ADOPTION_ACTION_CONFIGS } from '../../../hooks/queries/useAdoptions';
import { useTransactionsByApplication } from '../../../hooks/queries/useTransactions';
import { NextSeo } from 'next-seo';
import { Loader } from '../../ui/Loader';
import { AdoptionTimeline } from './AdoptionTimeline';
import { Gallery } from 'lib/components/ui/GalleryWithCarousel/Gallery';
import { PaymentModal } from '../payments/PaymentModal';
import { PaymentStatusModal } from '../payments/PaymentStatusModal';
import AdoptionActionDialog from './AdoptionActionDialog';
import { formatPrice } from 'lib/components/ui/PriceTag';
import { PageHeaderWithTwoButtons } from 'lib/components/ui/PageHeaderWithTwoButtons';
import { FiInfo, FiUser } from 'react-icons/fi';
import { BsListCheck } from 'react-icons/bs';

interface AdoptionDetailPageProps {
  id: string;
}

const AdoptionDetailPage: React.FC<AdoptionDetailPageProps> = () => {
  const router = useRouter();
  const { id, payment } = router.query;
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const toast = useToast();
  const timelineRef = React.useRef<{ getCurrentStepButtons: () => any[] }>(null);
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();

  const { data: adoption, isLoading: adoptionLoading, error: adoptionError } = useAdoption(id as string);
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useTransactionsByApplication(id as string);

  // Use shared actions hook


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

  const handleActionClick = (action: any) => {
    if (['withdraw', 'approve', 'reject', 'complete'].includes(action.type)) {
      // Enrich dialogBody with current step information
      const enrichedAction = { ...action };
      if (timelineLogic.currentStep?.info && timelineLogic.currentStep.info.length > 0) {
        enrichedAction.dialogBody = `${action.dialogBody}\n\n${timelineLogic.currentStep.info.map(info => `• ${info}`).join('\n')}`;
      }
      setPendingAction(enrichedAction);
      setUpdateForm({ status: action.status, response_message: '' });
      onUpdateOpen();
      return;
    }

    const startUrl = `/dashboard/adoptions/${adoption?.id}`;

    switch (action.type) {
      case 'pay_reservation':
        router.push(`${startUrl}?payment=reservation`);
        break;
      case 'sign_contract':
        router.push(`${startUrl}?action=contract`);
        break;
      case 'complete_payment':
        router.push(`${startUrl}?payment=final`);
        break;
      case 'leave_review':
        console.log('Leave review');
        break;
      case 'contact_support':
      case 'contact_breeder':
        // Handle contact logic
        break;
      default:
        console.warn('Unknown action:', action.type);
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingAction || !adoption) return;

    try {
      await updateAdoption({
        id: adoption.id,
        updates: {
          status: pendingAction.status,
          application_data: {
            ...adoption.application_data as any,
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
        title: `Error processing request`,
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };




  // Payment handlers
  const handlePayReservation = () => {
    setPaymentModal({
      isOpen: true,
      type: 'reservation',
      amount: Number(adoption.listings.reservation_fee) || 0,
      description: `Reservation fee for ${adoption.listings.title}`,
    });
  };

  const handleSignContract = async () => {
    try {
      await updateAdoption({
        id: adoption.id,
        updates: { contract_signed: true }
      });

      toast({
        title: 'Contract Signed',
        status: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error signing contract',
        status: 'error',
      });
    }
  };

  const handleCompletePayment = () => {
    const finalAmount = Number(adoption.listings.price) - Number(adoption.listings.reservation_fee);
    setPaymentModal({
      isOpen: true,
      type: 'final',
      amount: finalAmount,
      description: `Final payment for ${adoption.listings.title}`,
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
    if (payment === 'success' && adoption && !statusModal.isOpen && transactions) {
      let paymentType: 'reservation' | 'final' = 'reservation';
      let expectedAmount = Number(adoption.listings.reservation_fee) || 0;

      if (adoption.reservation_paid && !adoption.payment_completed) {
        paymentType = 'final';
        expectedAmount = Number(adoption.listings.price) - Number(adoption.listings.reservation_fee);
      }
      const transaction = transactions?.find(tx => tx.status === 'pending');

      if (transaction) {
        setStatusModal({
          isOpen: true,
          paymentReference: (transaction.meta as any).paystack_reference,
          paymentType,
          expectedAmount,
        });
      }

      // Clean up URL by removing the payment parameter
      const newUrl = router.pathname.replace('[id]', id as string);
      router.replace(newUrl, undefined, { shallow: true });
    }
  }, [payment, adoption, transactions, statusModal.isOpen, router, id]);

  // Initialize timeline logic for enriched dialog bodies
  const timelineLogic = useAdoptionTimelineLogic({
    adoption,
    userProfile,
    transactions
  });

  const { updateAdoption, isLoading: isUpdating, availableActions } = useAdoptionActions({
    adoption,
    userProfile,
    transactions,
    actions: {
      onPayReservation: handlePayReservation,
      onSignContract: handleSignContract,
      onCompletePayment: handleCompletePayment,
      onMarkCompleted: () => {
        const action = ADOPTION_ACTION_CONFIGS.complete;
        handleActionClick(action);
      },
      onWithdrawAdoption: () => {
        const action = ADOPTION_ACTION_CONFIGS.withdraw;
        handleActionClick(action);
      },
      onApproveAdoption: () => {
        const action = ADOPTION_ACTION_CONFIGS.approve;
        handleActionClick(action);
      },
      onRejectAdoption: () => {
        const action = ADOPTION_ACTION_CONFIGS.reject;
        handleActionClick(action);
      },
      onCheckPaymentStatus: (reference, type) => {
        setStatusModal({
          isOpen: true,
          paymentReference: reference,
          paymentType: type as 'reservation' | 'final',
          expectedAmount: type === 'reservation'
            ? Number(adoption?.listings.reservation_fee)
            : Number(adoption?.listings.price) - Number(adoption?.listings.reservation_fee),
        });
      },
      onLeaveReview: () => console.log('Leave review'),
      onContactBreeder: () => router.push(`/inbox?userId=${adoption?.listings.owner_id}`),
      onContactSupport: () => console.log('Contact support')
    }
  });

  if (profileLoading || adoptionLoading || transactionsLoading) {
    return <Loader />;
  }

  if (adoptionError || transactionsError) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error loading adoption. Please try again later.
        {adoptionError?.message || transactionsError?.message}
      </Alert>
    );
  }

  if (!adoption) {
    return (
      <Container maxW="7xl" py={8}>
        <Center h="400px">
          <VStack spacing={4}>
            <Text fontSize="lg" color="gray.500">Adoption not found</Text>
            <Button onClick={() => router.push('/dashboard/adoptions')}>
              Back to Adoptions
            </Button>
          </VStack>
        </Center>
      </Container>
    );
  }

  const isOwner = userProfile?.id === adoption.listings.owner_id;
  const canUpdateStatus = isOwner && ['submitted', 'pending'].includes(adoption.status);
  const canWithdraw = !isOwner && adoption.status === 'submitted';

  const getTitle = () => {
    if (adoption.listings.title) return adoption.listings.title;
    if (adoption.listings.type === 'litter') {
      //@ts-ignore
      return `${adoption.listings.breeds?.name.charAt(0).toUpperCase() + adoption.listings.breeds?.name.slice(1)} Puppies`;
    } else {
      //@ts-ignore
      return `${adoption.listings.breeds?.name.charAt(0).toUpperCase() + adoption.listings.breeds?.name.slice(1)} ${adoption.listings.pet_age} old`;
    }
  }

  return (
    <>
      <NextSeo title={`Adoption for ${adoption.listings.title} - DogHouse Kenya`} />

      <Container maxW="7xl" pb={{ base: 4, md: 24 }}>
        <Stack spacing={{ base: 8, md: 16 }}>

          <Stack spacing="6">
            <PageHeaderWithTwoButtons
              title={getTitle()}
              description={`Applied ${formatDate(adoption.created_at.toString())}`}
              badge={
                <Badge colorScheme={getStatusColor(adoption.status)}>
                  {formatStatus(adoption.status)}
                </Badge>
              }
              buttonPrimary={availableActions && availableActions.length > 0 ? {
                label: availableActions[0].label,
                onClick: availableActions[0].onClick,
                icon: availableActions[0].icon ? <Icon as={availableActions[0].icon} /> : undefined,
                colorScheme: availableActions[0].colorScheme,
                isDisabled: availableActions[0].disabled,
                variant: availableActions[0].variant
              } : undefined}
              buttonSecondary={availableActions && availableActions.length > 1 ? {
                label: availableActions[1].label,
                onClick: availableActions[1].onClick,
                icon: availableActions[1].icon ? <Icon as={availableActions[1].icon} /> : undefined,
                colorScheme: availableActions[1].colorScheme,
                isDisabled: availableActions[1].disabled,
                variant: availableActions[1].variant
              } : undefined}
            />

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <Stack spacing={4}>
                <Gallery
                  images={Array.from(adoption.listings.photos as string[]).map((photo) => ({ src: photo }))}
                  flex={1}
                  minW="50vw"
                >
                  <HStack spacing={3} mb={4} position="absolute" top="4" left="4" zIndex={1}>
                    <Badge colorScheme={adoption.listings.type === 'litter' ? 'blue' : 'green'}>
                      {adoption.listings.type === 'litter' ? 'Litter' : 'Single Pet'}
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
                      scrollbarWidth: 'none',
                    }
                  }
                  }
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
                    <AdoptionTimeline
                      ref={timelineRef}
                      adoption={adoption}
                      userProfile={userProfile}
                      transactions={transactions}
                      availableActions={availableActions}
                    />
                  </TabPanel>
                  <TabPanel px={0}>
                    <ListingInfo adoption={adoption} />
                  </TabPanel>
                  <TabPanel px={0}>
                    {isOwner ? (
                      <ApplicantInfo adoption={adoption} router={router} />
                    ) : (
                      <BreederInfo adoption={adoption} formatDate={formatDate} router={router} />
                    )}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </SimpleGrid>
          </Stack>
        </Stack>
      </Container>


      {/* Status Update Modal */}
      < AdoptionActionDialog
        form={updateForm}
        setForm={setUpdateForm}
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        pendingAction={pendingAction}
        setPendingAction={setPendingAction}
        onSubmit={handleStatusUpdate}
        isLoading={isUpdating}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={handlePaymentModalClose}
        adoption={adoption}
        paymentType={paymentModal.type}
      />

      {/* Payment Status Modal */}
      <PaymentStatusModal
        isOpen={statusModal.isOpen}
        onClose={handleStatusModalClose}
        paymentReference={statusModal.paymentReference}
        paymentType={statusModal.paymentType}
        expectedAmount={statusModal.expectedAmount}
        adoptionId={id as string}
      />
    </>
  );
};

// Listing Information Component
const ListingInfo = ({ adoption }) => {
  return (
    <VStack spacing={4} align="stretch">
      {/* Removed Gallery from here as it is now in main layout */}
      {/* Removed Divider */}

      <SimpleGrid columns={2} spacing={4}>
        <Box>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Type
          </Text>
          <Text>{adoption.listings.type}</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Breed
          </Text>
          <Text>{adoption.listings.breeds?.name || 'Unknown'}</Text>
        </Box>
        {adoption.listings.type === 'litter' && (
          <>
            <Box>
              <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                Birth Date
              </Text>
              <Text>{adoption.listings.birth_date ? new Date(adoption.listings.birth_date).toLocaleDateString() : 'Not specified'}</Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                Puppies
              </Text>
              <Text>{adoption.listings.number_of_puppies || 'Not specified'}</Text>
            </Box>
          </>
        )}
        {adoption.listings.type === 'single_pet' && (
          <>
            <Box>
              <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                Age
              </Text>
              <Text>{adoption.listings.pet_age || 'Not specified'}</Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                Gender
              </Text>
              <Text>{adoption.listings.pet_gender || 'Not specified'}</Text>
            </Box>
          </>
        )}
        <Box>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Price
          </Text>

          <Box>
            <Text>
              {formatPrice(adoption.listings.price * (adoption.application_data?.quantity || 1))}
            </Text>
            {adoption.listings.type === 'litter' && <Text fontSize="xs" color="muted">
              {formatPrice(adoption.listings.price)} each x {adoption.application_data?.quantity || 1}
            </Text>}
          </Box>

        </Box>

        <Box>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Reservation Fee
          </Text>
          <Box>
            <Text>{formatPrice(adoption.listings.reservation_fee * (adoption.application_data?.quantity || 1))}</Text>

            {adoption.listings.type === 'litter' && <Text fontSize="xs" color="muted">
              {formatPrice(adoption.listings.reservation_fee)} each x {adoption.application_data?.quantity || 1}
            </Text>}
          </Box>
        </Box>


      </SimpleGrid>
    </VStack>
  );
};

// Applicant Information Component
const ApplicantInfo = ({ adoption, router }) => {
  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
      <Stack>
        <HStack spacing={4}>
          <Avatar
            src={adoption.users.profile_photo_url || undefined}
            name={adoption.users.display_name}
            size="lg"
          />
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold" fontSize="lg">{adoption.users.display_name}</Text>
            <Text color="gray.600">{adoption.users.email.replace(
              adoption.users.email.split('@')[0],
              adoption.users.email.split('@')[0].slice(0, 3) + '***'
            )}</Text>
          </VStack>
        </HStack>


        <HStack spacing={4} pt={2}>
          <Button leftIcon={<PhoneIcon />} size="sm" variant="outline" isDisabled={!adoption?.reservation_paid}>
            Call Applicant
          </Button>
          <Button leftIcon={<ChatIcon />} size="sm" variant="outline" isDisabled={!adoption?.reservation_paid}>
            Message Applicant
          </Button>
          <Button leftIcon={<WarningIcon />} size="sm" variant="outline" onClick={() => router.push('/support')}>
            Contact Support
          </Button>
        </HStack>
      </Stack>


      <SimpleGrid columns={2} spacing={4}>
        <Box>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Location
          </Text>
          <Text>{adoption.users.location_text || 'Not specified'}</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Member Since
          </Text>
          <Text>{new Date(adoption.users.created_at).toLocaleDateString()}</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Experience Level
          </Text>
          <Text>{adoption.users?.seeker_profiles?.experience_level || 'Not specified'}</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Living Situation
          </Text>
          <Text>{adoption.users?.seeker_profiles?.living_situation || 'Not specified'}</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Children
          </Text>
          <Text>{adoption.application_data?.has_children ? 'Yes' : 'No'}</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Other Pets
          </Text>
          <Text>{adoption.users?.seeker_profiles?.has_other_pets ? 'Yes' : 'No'}</Text>
        </Box>
      </SimpleGrid>
    </SimpleGrid>
  );
};

// Breeder Information Component
const BreederInfo = ({ adoption, formatDate, router }) => {
  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>

      <Stack spacing={4} >
        <HStack spacing={4}>
          <Avatar
            src={adoption.listings.users?.profile_photo_url || undefined}
            name={adoption.listings.users?.display_name || 'Breeder'}
            size="lg"
          />
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold" fontSize="lg">
              {adoption.listings.users?.display_name || 'Breeder'}
            </Text>
            <Text color="gray.600">{adoption.listings.users?.email.replace(
              adoption.listings.users?.email.split('@')[0],
              adoption.listings.users?.email.split('@')[0].slice(0, 3) + '***'
            )}</Text>
          </VStack>
        </HStack>

        <HStack spacing={4} pt={2}>

          <Button leftIcon={<PhoneIcon />} size="sm" variant="outline" isDisabled={adoption?.reservation_paid}>
            Call Breeder
          </Button>
          <Button leftIcon={<ChatIcon />} size="sm" variant="outline" isDisabled={adoption?.reservation_paid}>
            Message Breeder
          </Button>
          <Button leftIcon={<WarningIcon />} size="sm" variant="outline" onClick={() => router.push('/support')}>
            Contact Support
          </Button>
        </HStack>
      </Stack>

      <SimpleGrid columns={2} spacing={4}>
        <Box>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Location
          </Text>
          <Text>{adoption.listings?.users?.location_text || 'Not specified'}</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Listing Created
          </Text>
          <Text>{formatDate(adoption.listings.created_at)}</Text>
        </Box>
      </SimpleGrid>
    </SimpleGrid>
  );
};

export default AdoptionDetailPage;
