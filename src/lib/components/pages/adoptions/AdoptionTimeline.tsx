import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Badge,
  useColorModeValue,
  Icon,
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
  useToast,
} from '@chakra-ui/react';
import {
  CheckCircleIcon,
  WarningIcon,
  StarIcon,
  InfoIcon,
  PhoneIcon,
  CheckIcon,
  EditIcon,
} from '@chakra-ui/icons';
import { AdoptionWithListing } from 'lib/hooks/queries/useAdoptions';
import { useAdoptionConversation } from '../../../hooks/queries/useContextConversations';
import { useCurrentUser } from '../../../hooks/queries/useAuth';
import { useRouter } from 'next/router';

// Type definition matching schema
export interface AdoptionStatusHistory {
  id: string;
  adoption_id: string;
  status: string;
  notes?: string;
  created_at: string | Date;
}

interface AdoptionTimelineProps {
  adoption: AdoptionWithListing;
  userProfile: any;
  transactions?: any[];
  statusHistory?: AdoptionStatusHistory[];
  onPayReservation?: () => void;
  onSignContract?: () => void;
  onCompletePayment?: () => void;
  onMarkCompleted?: () => void;
  onWithdrawAdoption?: () => void;
  onApproveAdoption?: () => void;
  onRejectAdoption?: () => void;
  onCheckPaymentStatus?: (reference: string, type: 'reservation' | 'final') => void;
  onLeaveReview?: () => void;
  onContactBreeder?: () => void;
  onContactNewOwner?: () => void;
}

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending' | 'locked';
  date?: string;
  actionButtons?: {
    label: string;
    onClick: () => void;
    colorScheme: string;
    icon: any;
    disabled?: boolean;
  }[];
  info?: string[];
}

export const AdoptionTimeline = React.forwardRef<{
  getCurrentStepButtons: () => any[];
}, AdoptionTimelineProps>(({
  adoption,
  userProfile,
  transactions = [],
  statusHistory = [],
  onPayReservation,
  onSignContract,
  onCompletePayment,
  onMarkCompleted,
  onWithdrawAdoption,
  onApproveAdoption,
  onRejectAdoption,
  onCheckPaymentStatus,
  onLeaveReview,
  onContactBreeder,
  onContactNewOwner,
}, ref) => {
  const { data: currentUser } = useCurrentUser();
  const { conversation: existingAdoptionConversation, createConversation: createAdoptionConversation, isLoading: isCreatingConversation } = useAdoptionConversation(adoption.id);
  const toast = useToast();
  const router = useRouter();

  const isOwner = userProfile?.id === adoption.listings.owner_id;
  const isApplicant = userProfile?.id === adoption.seeker_id;

  // Handle contact breeder (for seekers)
  const handleContactBreeder = async () => {
    if (!currentUser?.id) return;

    try {
      if (existingAdoptionConversation) {
        // Navigate to existing conversation
        router.push(`/dashboard/inbox/${existingAdoptionConversation.id}`);
        return;
      }

      // Create new conversation
      const conversation = await createAdoptionConversation(
        {
          id: adoption.listings.id,
          title: adoption.listings.title,
          owner_id: adoption.listings.owner_id
        },
        [currentUser.id, adoption.listings.owner_id]
      );

      toast({
        title: "Conversation started",
        description: "You can now message the breeder directly.",
        status: "success",
        duration: 3000,
      });

      // Navigate to the new conversation
      router.push(`/dashboard/inbox/${conversation.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Handle contact new owner (for breeders)
  const handleContactNewOwner = async () => {
    if (!currentUser?.id) return;

    try {
      if (existingAdoptionConversation) {
        // Navigate to existing conversation
        router.push(`/dashboard/inbox/${existingAdoptionConversation.id}`);
        return;
      }

      // Create new conversation
      const conversation = await createAdoptionConversation(
        {
          id: adoption.listings.id,
          title: adoption.listings.title,
          owner_id: adoption.listings.owner_id
        },
        [currentUser.id, adoption.seeker_id]
      );

      toast({
        title: "Conversation started",
        description: "You can now coordinate pickup/delivery with the new owner.",
        status: "success",
        duration: 3000,
      });

      // Navigate to the new conversation
      router.push(`/dashboard/inbox/${conversation.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Helper to get date from history
  const getStatusDate = (statusKey: string) => {
    const entry = statusHistory.find(h => h.status === statusKey);
    return entry ? new Date(entry.created_at).toLocaleDateString() : undefined;
  };

  // Check for pending transactions from props
  const pendingTransactions = transactions?.filter(tx => tx.status === 'pending') || [];
  const hasPendingReservationPayment = pendingTransactions.some(tx => (tx.meta as any)?.payment_type === 'reservation');
  const hasPendingFinalPayment = pendingTransactions.some(tx => (tx.meta as any)?.payment_type === 'final');

  const contractRequired = adoption.listings.requirements?.contract_required;
  const getTimelineSteps = (): TimelineStep[] => {
    if (isApplicant) {
      // Steps for seekers (applicants)
      const steps: TimelineStep[] = [
        {
          id: 'submitted',
          title: 'Adoption Submitted',
          description: 'Your adoption application has been received and is awaiting review',
          status: 'completed',
          date: getStatusDate('submitted') || new Date(adoption.created_at).toLocaleDateString(),
          info: [
            'Application includes your personal details and preferences',
            'Breeder will review your suitability for adoption',
          ],
          actionButtons: adoption.status === 'submitted' && onWithdrawAdoption ? [{
            label: 'Withdraw Adoption',
            onClick: onWithdrawAdoption,
            colorScheme: 'red',
            icon: WarningIcon,
          }] : undefined,
        },
        {
          id: 'under_review',
          title: 'Under Review',
          description: 'Your application is being reviewed by the breeder',
          status: adoption.status === 'submitted' ? 'current' :
            ['pending', 'approved', 'rejected', 'reserved', 'completed'].includes(adoption.status) ? 'completed' : 'pending',
          date: getStatusDate('pending'),
          info: [
            'Breeder evaluates your application against their requirements',
            'May include phone/video calls or home visits',
          ],
        },

      ];

      if (['approved', 'rejected', 'reserved'].includes(adoption.status)) {
        steps.push(
          {
            id: 'decision',
            title: adoption.status === 'approved' ? 'Adoption Approved' : 'Decision Made',
            description: adoption.status === 'approved' || adoption.status === 'reserved'
              ? 'Congratulations! Your adoption application has been approved'
              : adoption.status === 'rejected'
                ? 'Your adoption application was not approved at this time'
                : 'Awaiting breeder decision',
            status: ['approved', 'rejected', 'reserved'].includes(adoption.status) ? 'completed' :
              adoption.status === 'pending' ? 'current' : 'pending',
            date: getStatusDate(adoption.status),
            info: adoption.status === 'approved' ? [
              'Listing is now temporarily reserved for you',
              'Next step: Pay reservation fee within 24 hours',
            ] : adoption.status === 'rejected' ? [
              'You can apply for other available listings',
              'Consider reaching out to the breeder for feedback',
            ] : [
              'Breeder will notify you of their decision',
              'This may take 1-3 business days',
            ],

          }
        )
      }
      // Add post-approval steps only if approved
      if (['approved', 'reserved'].includes(adoption.status)) {
        steps.push(
          {
            id: 'reserved',
            title: 'Reserve Listing',
            description: adoption.reservation_paid ? 'The listing has been reserved for you' : 'Pay reservation fee to secure your adoption',
            status: adoption.reservation_paid ? 'completed' : 'current',
            date: getStatusDate('reserved'), // Assumes 'reserved' status update happens on payment success
            info: [
              'Reservation fee is deducted from final payment',
              'If payment is not received within 24 hours, listing will be released',
            ],
            actionButtons: (() => {
              const buttons = [];
              if (adoption.status === 'approved' && !adoption.reservation_paid) {
                buttons.push({
                  label: 'Pay Reservation Fee',
                  onClick: onPayReservation || (() => { }),
                  colorScheme: 'green',
                  icon: StarIcon,
                });
              }
              if (hasPendingReservationPayment && onCheckPaymentStatus) {
                buttons.push({
                  label: 'Check Payment Status',
                  onClick: () => {
                    const transaction = pendingTransactions.find(tx => (tx.meta as any)?.payment_type === 'reservation');
                    if (transaction) {
                      onCheckPaymentStatus((transaction.meta as any).paystack_reference, 'reservation');
                    }
                  },
                  colorScheme: 'blue',
                  icon: InfoIcon,
                });
              }
              return buttons.length > 0 ? buttons : undefined;
            })(),
          }
        );
      }

      if (adoption.reservation_paid && contractRequired) {
        steps.push(
          {
            id: 'contract',
            title: 'Sign Adoption Contract',
            description: 'Review and sign the adoption contract',
            status: adoption.contract_signed ? 'completed' :
              adoption.reservation_paid ? 'current' : 'locked',
            info: [
              'Legal agreement outlining adoption terms',
              'Includes responsibilities of both parties',
              'Required by breeder before final payment',
            ],
            actionButtons: adoption.reservation_paid && !adoption.contract_signed ? [{
              label: 'Sign Contract',
              onClick: onSignContract || (() => { }),
              colorScheme: 'blue',
              icon: EditIcon,
            }] : undefined,
          }
        )
      }

      if (adoption.contract_signed || (adoption.reservation_paid && !contractRequired)) {
        steps.push(
          {
            id: 'payment',
            title: 'Complete Payment',
            description: 'Make final payment to complete adoption',
            status: adoption.payment_completed ? 'completed' :
              adoption.contract_signed || (adoption.reservation_paid && !contractRequired) ? 'current' : 'locked',
            info: [
              'Reservation fee will be deducted from final amount',
              'Payment secures ownership transfer',
            ],
            actionButtons: (() => {
              const buttons = [];
              if ((adoption.contract_signed || adoption.reservation_paid && !contractRequired) && !adoption.payment_completed) {
                buttons.push({
                  label: 'Complete Payment',
                  onClick: onCompletePayment || (() => { }),
                  colorScheme: 'green',
                  icon: StarIcon,
                });
              }
              if (hasPendingFinalPayment && onCheckPaymentStatus) {
                buttons.push({
                  label: 'Check Payment Status',
                  onClick: () => {
                    const transaction = pendingTransactions.find(tx => (tx.meta as any)?.payment_type === 'final');
                    if (transaction) {
                      onCheckPaymentStatus((transaction.meta as any).paystack_reference, 'final');
                    }
                  },
                  colorScheme: 'blue',
                  icon: InfoIcon,
                });
              }
              return buttons.length > 0 ? buttons : undefined;
            })(),
          }
        )
      }

      if (adoption.payment_completed) {
        steps.push(
          {
            id: 'completed',
            title: adoption.status === 'completed' ? 'Adoption Completed' : 'Pickup/ Delivery Arrangements',
            description: adoption.status === 'completed' ? 'Congratulations! Adoption process is complete. If you enjoyed your experiece, please leave us a review.' : 'Contact the breeder for pickup/delivery arrangements',
            status: adoption.status === 'completed' ? 'completed' : 'current',
            date: getStatusDate('completed'),
            // info: adoption.status === 'completed' ? [
            //   'Ownership transfer is complete',
            // ] : ['You will receive pickup/delivery arrangements'],
            actionButtons: adoption.status === 'completed' ? [
              {
                label: 'Leave Review',
                onClick: onLeaveReview || (() => { }),
                colorScheme: 'blue',
                icon: StarIcon,
              }
            ] : [
              {
                // contact breeder
                label: 'Contact Breeder',
                onClick: handleContactBreeder,
                colorScheme: 'blue',
                icon: PhoneIcon,
                disabled: isCreatingConversation,
              }
            ],
          }
        )
      }
      return steps;
    } else {
      // Steps for breeders (owners)
      const steps: TimelineStep[] = [
        {
          id: 'received',
          title: 'Application Received',
          description: 'New adoption application received for your listing',
          status: 'completed',
          date: getStatusDate('submitted') || new Date(adoption.created_at).toLocaleDateString(),
          info: [
            'Applicant has submitted their details and preferences',
            'Review their suitability for adoption',
          ],
        },
        {
          id: 'review',
          title: 'Review Application',
          description: 'Review the applicant\'s suitability',
          status: adoption.status === 'submitted' ? 'current' :
            ['pending', 'approved', 'rejected', 'reserved', 'completed'].includes(adoption.status) ? 'completed' : 'pending',
          date: getStatusDate('pending'),
          info: [
            'Evaluate applicant against your requirements',
            'Consider phone/video calls or home visits if needed',
          ],
          actionButtons: adoption.status === 'submitted' && onApproveAdoption && onRejectAdoption ? [
            {
              label: 'Approve',
              onClick: onApproveAdoption,
              colorScheme: 'green',
              icon: CheckCircleIcon,
            },
            {
              label: 'Reject',
              onClick: onRejectAdoption,
              colorScheme: 'red',
              icon: WarningIcon,
            },
          ] : undefined,
        },
        {
          id: 'decision',
          title: adoption.status === 'approved' ? 'Adoption Approved' :
            adoption.status === 'rejected' ? 'Adoption Rejected' : 'Adoption Approved',
          description: ['approved', 'reserved', 'completed'].includes(adoption.status)
            ? 'You approved this adoption'
            : adoption.status === 'rejected'
              ? 'You rejected this adoption'
              : 'Approve or reject the application',
          status: ['approved', 'rejected', 'reserved', 'completed'].includes(adoption.status) ? 'completed' :
            adoption.status === 'pending' ? 'current' : 'pending',
          date: getStatusDate(adoption.status),
          info: adoption.status === 'approved' ? [
            'Applicant will be notified of approval',
            'They have 24 hours to pay reservation fee',
          ] : adoption.status === 'rejected' ? [
            'Applicant will be notified of rejection',
            'They can apply for other listings',
          ] : [
            'Take time to make the right decision',
            'Consider the applicant\'s profile and requirements',
          ]
        },
      ];

      // Add post-approval steps only if approved
      if (['approved', 'reserved', 'completed'].includes(adoption.status)) {
        steps.push(
          {
            id: 'awaiting_payment',
            title: 'Awaiting Reservation Payment',
            description: adoption.reservation_paid ? 'Reservation fee has been paid' : 'Waiting for applicant to pay reservation fee',
            status: adoption.reservation_paid ? 'completed' : 'current',
            date: getStatusDate('reserved'),
            info: [
              'Applicant has 24 hours to pay reservation fee',
              'If payment is not received within 24 hours, listing will be released',

            ],
          }
        );
      }

      if (adoption.reservation_paid && contractRequired) {
        steps.push(
          {
            id: 'awaiting_contract',
            title: 'Awaiting Contract Signature',
            description: adoption.contract_signed ? 'Contract has been signed' : 'Waiting for applicant to sign adoption contract',
            status: adoption.contract_signed ? 'completed' :
              adoption.reservation_paid ? 'current' : 'locked',
            info: [
              'Contract outlines adoption terms and responsibilities',
              'Both parties must agree to the terms',
            ],
          }
        )
      }

      if (adoption.contract_signed || (adoption.reservation_paid && !contractRequired)) {
        steps.push(
          {
            id: 'awaiting_final_payment',
            title: 'Awaiting Final Payment',
            description: adoption.payment_completed ? 'Final payment has been completed' : 'Waiting for applicant to complete final payment',
            status: adoption.payment_completed ? 'completed' :
              adoption.contract_signed || (adoption.reservation_paid && !contractRequired) ? 'current' : 'locked',
            info: [
              'Final payment completes the adoption',
              'Reservation fee will be deducted from total',
            ],
          }
        )
      }

      if (adoption.payment_completed) {
        steps.push(
          {
            id: 'finalize',
            title: adoption.status === 'completed' ? 'Adoption Completed' : 'Finalize Adoption',
            description: adoption.status === 'completed' ? 'Congratulations! Your adoption is complete. If you enjoyed your experiece, please leave us a review.' : 'Finalize the adoption.',
            status: adoption.status === 'completed' ? 'completed' : 'current',
            date: getStatusDate('completed'),
            info: [
              'Mark adoption as completed',
              'Arrange pickup/delivery with new owner',
            ],
            actionButtons: adoption.payment_completed && adoption.status !== 'completed' ? [{
              label: 'Mark as Completed',
              onClick: onMarkCompleted || (() => { }),
              colorScheme: 'green',
              icon: CheckIcon,
            },
            {
              // contact new owner
              label: 'Contact New Owner',
              onClick: onContactNewOwner || (() => { }),
              colorScheme: 'purple',
              icon: PhoneIcon,
            }] : [{
              label: 'Leave Review',
              onClick: onLeaveReview || (() => { }),
              colorScheme: 'purple',
              icon: StarIcon,
            }],
          }
        )
      }
      return steps;
    }
  };

  const steps = getTimelineSteps();

  const getCurrentStepIndex = () => {
    // If completed, return length
    if (adoption.status === 'completed') return steps.length;
    // Otherwise find the first non-completed or current
    const idx = steps.findIndex(step => step.status === 'current');
    return idx === -1 ? steps.findIndex(step => step.status === 'locked') : idx;
  };

  const { activeStep } = useSteps({
    index: getCurrentStepIndex(),
    count: steps.length,
  });

  // Export function to get current step buttons for use in parent components
  const getCurrentStepButtons = () => {
    const currentStep = steps.find(step => step.status === 'current');
    return currentStep?.actionButtons || [];
  };

  // Make this available to parent component
  React.useImperativeHandle(ref, () => ({
    getCurrentStepButtons,
  }));

  return (
    <Stepper index={activeStep} orientation="vertical" gap="0" colorScheme="brand">
      {steps.map((step, index) => (
        <Step key={step.id}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>

          <Box flexShrink="1" w="full">
            <VStack align="start" spacing={2}>
              <HStack align="center" justify="space-between" w="full">
                <Box>
                  <StepTitle>{step.title}</StepTitle>
                  {step.date && (
                    <StepDescription fontSize="xs" color="gray.500">
                      {step.date}
                    </StepDescription>
                  )}
                </Box>

                {step.status === 'current' && (
                  <Badge colorScheme="orange" variant="subtle" size="sm">
                    Pending
                  </Badge>
                )}
                {step.status === 'completed' && (
                  <Badge colorScheme="green" variant="subtle" size="sm">
                    Completed
                  </Badge>
                )}
              </HStack>

              <StepDescription pt={2} pb={4}>{step.description}</StepDescription>

              {adoption.status === 'approved' || adoption.status === 'rejected' || adoption.status === 'withdrawn' && (
                <Text fontSize="xs" color="red.500">
                  {
                    //@ts-ignore
                    adoption.application_data?.response_message
                  }
                </Text>
              )}

              {/* Additional info - only show for current step */}
              {step.status === 'current' && step.info && step.info.length > 0 && (
                <VStack align="start" spacing={3} pb={4} pl={4} borderLeft="2px solid" borderColor="gray.200">
                  {step.info.map((info, idx) => (
                    <Text key={idx} fontSize="xs" color="gray.600">
                      • {info}
                    </Text>
                  ))}
                </VStack>
              )}

              {/* Action buttons */}
              {step.actionButtons && step.actionButtons.length > 0 && (
                <Box py={2} mb={4}>
                  <HStack spacing={2} wrap="wrap">
                    {step.actionButtons.map((button, btnIndex) => (
                      <Button
                        key={btnIndex}
                        size="sm"
                        colorScheme={button.colorScheme}
                        leftIcon={<Icon as={button.icon} />}
                        onClick={button.onClick}
                        isDisabled={button.disabled}
                      >
                        {button.label}
                      </Button>
                    ))}
                  </HStack>
                </Box>
              )}
            </VStack>
          </Box>

          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
});
