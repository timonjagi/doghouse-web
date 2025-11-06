import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Badge,
  Divider,
  useColorModeValue,
  Icon,
  Flex,
  Spacer,
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
} from '@chakra-ui/react';
import {
  CheckCircleIcon,
  TimeIcon,
  WarningIcon,
  CalendarIcon,
  LockIcon,
  CheckIcon,
  EditIcon,
  StarIcon,
  InfoIcon,
} from '@chakra-ui/icons';
import { ApplicationWithListing } from 'lib/hooks/queries';

interface ApplicationTimelineProps {
  application: ApplicationWithListing;
  userProfile: any;
  transactions?: any[];
  onPayReservation?: () => void;
  onSignContract?: () => void;
  onCompletePayment?: () => void;
  onMarkCompleted?: () => void;
  onWithdrawApplication?: () => void;
  onApproveApplication?: () => void;
  onRejectApplication?: () => void;
  onCheckPaymentStatus?: (reference: string, type: 'reservation' | 'final') => void;
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

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({
  application,
  userProfile,
  transactions = [],
  onPayReservation,
  onSignContract,
  onCompletePayment,
  onMarkCompleted,
  onWithdrawApplication,
  onApproveApplication,
  onRejectApplication,
  onCheckPaymentStatus,
}) => {
  const isOwner = userProfile?.id === application.listings.owner_id;
  const isApplicant = userProfile?.id === application.seeker_id;

  // Check for pending transactions from props
  const pendingTransactions = transactions?.filter(tx => tx.status === 'pending') || [];
  const hasPendingReservationPayment = pendingTransactions.some(tx => (tx.meta as any)?.payment_type === 'reservation');
  const hasPendingFinalPayment = pendingTransactions.some(tx => (tx.meta as any)?.payment_type === 'final');

  const getTimelineSteps = (): TimelineStep[] => {
    if (isApplicant) {
      // Steps for seekers (applicants)
      const steps: TimelineStep[] = [
        {
          id: 'submitted',
          title: 'Application Submitted',
          description: 'Your application has been received and is awaiting review',
          status: 'completed',
          date: new Date(application.created_at).toLocaleDateString(),
          info: [
            'Application includes your personal details and preferences',
            'Breeder will review your suitability for adoption',
          ],
          actionButtons: application.status === 'submitted' && onWithdrawApplication ? [{
            label: 'Withdraw Application',
            onClick: onWithdrawApplication,
            colorScheme: 'red',
            icon: WarningIcon,
          }] : undefined,
        },
        {
          id: 'under_review',
          title: 'Under Review',
          description: 'Your application is being reviewed by the breeder',
          status: application.status === 'submitted' ? 'current' :
            ['pending', 'approved', 'rejected', 'completed'].includes(application.status) ? 'completed' : 'pending',
          info: [
            'Breeder evaluates your application against their requirements',
            'May include phone/video calls or home visits',
          ],
        },
        {
          id: 'decision',
          title: application.status === 'approved' ? 'Application Approved' : 'Decision Made',
          description: application.status === 'approved'
            ? 'Congratulations! Your application has been approved'
            : application.status === 'rejected'
              ? 'Your application was not approved at this time'
              : 'Awaiting breeder decision',
          status: ['approved', 'rejected'].includes(application.status) ? 'completed' :
            application.status === 'pending' ? 'current' : 'pending',
          info: application.status === 'approved' ? [
            'Listing is now temporarily reserved for you',
            'Next step: Pay reservation fee within 24 hours',
          ] : application.status === 'rejected' ? [
            'You can apply for other available listings',
            'Consider reaching out to the breeder for feedback',
          ] : [
            'Breeder will notify you of their decision',
            'This may take 1-3 business days',
          ],

        },
      ];

      // Add post-approval steps only if approved
      if (application.status === 'approved') {
        steps.push(
          {
            id: 'reserved',
            title: 'Reserve Listing',
            description: application.reservation_paid ? 'The listing has been reserved for you' : 'Pay reservation fee to secure your adoption',
            status: application.reservation_paid ? 'completed' : 'current',
            info: [
              'Reservation fee is deducted from final payment',
              'If payment is not received within 24 hours, listing will be released',
            ],
            actionButtons: (() => {
              const buttons = [];
              if (application.status === 'approved' && !application.reservation_paid) {
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

      if (application.reservation_paid) {
        steps.push(
          {
            id: 'contract',
            title: 'Sign Adoption Contract',
            description: 'Review and sign the adoption contract',
            status: application.contract_signed ? 'completed' :
              application.reservation_paid ? 'current' : 'locked',
            info: [
              'Legal agreement outlining adoption terms',
              'Includes responsibilities of both parties',
              'Required by breeder before final payment',
            ],
            actionButtons: application.reservation_paid && !application.contract_signed ? [{
              label: 'Sign Contract',
              onClick: onSignContract || (() => { }),
              colorScheme: 'blue',
              icon: EditIcon,
            }] : undefined,
          }
        )
      }

      if (application.contract_signed) {
        steps.push(
          {
            id: 'payment',
            title: 'Complete Payment',
            description: 'Make final payment to complete adoption',
            status: application.payment_completed ? 'completed' :
              application.contract_signed ? 'current' : 'locked',
            info: [
              'Reservation fee will be deducted from final amount',
              'Payment secures ownership transfer',
            ],
            actionButtons: (() => {
              const buttons = [];
              if (application.contract_signed && !application.payment_completed) {
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

      if (application.payment_completed) {
        steps.push(
          {
            id: 'completed',
            title: application.status === 'completed' ? 'Adoption Completed' : 'Final Payment Received',
            description: application.status === 'completed' ? 'Congratulations! Adoption process is complete. If you enjoyed your experiece, please leave us a review.' : 'You will receive pickup/ delivery arrangements',
            status: application.status === 'completed' ? 'completed' : 'pending',
            info: application.status === 'completed' ? [
              'Ownership transfer is complete',
            ] : ['You will receive pickup/delivery arrangements'],
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
          description: 'New application received for your listing',
          status: 'completed',
          date: new Date(application.created_at).toLocaleDateString(),
          info: [
            'Applicant has submitted their details and preferences',
            'Review their suitability for adoption',
          ],
        },
        {
          id: 'review',
          title: 'Review Application',
          description: 'Review the applicant\'s suitability',
          status: application.status === 'submitted' ? 'current' :
            ['pending', 'approved', 'rejected', 'completed'].includes(application.status) ? 'completed' : 'pending',
          info: [
            'Evaluate applicant against your requirements',
            'Consider phone/video calls or home visits if needed',
          ],
          actionButtons: application.status === 'submitted' && onApproveApplication && onRejectApplication ? [
            {
              label: 'Approve',
              onClick: onApproveApplication,
              colorScheme: 'green',
              icon: CheckCircleIcon,
            },
            {
              label: 'Reject',
              onClick: onRejectApplication,
              colorScheme: 'red',
              icon: WarningIcon,
            },
          ] : undefined,
        },
        {
          id: 'decision',
          title: application.status === 'approved' ? 'Application Approved' :
            application.status === 'rejected' ? 'Application Rejected' : 'Make Decision',
          description: application.status === 'approved'
            ? 'You approved this application'
            : application.status === 'rejected'
              ? 'You rejected this application'
              : 'Approve or reject the application',
          status: ['approved', 'rejected'].includes(application.status) ? 'completed' :
            application.status === 'pending' ? 'current' : 'pending',
          info: application.status === 'approved' ? [
            'Applicant will be notified of approval',
            'They have 24 hours to pay reservation fee',
          ] : application.status === 'rejected' ? [
            'Applicant will be notified of rejection',
            'They can apply for other listings',
          ] : [
            'Take time to make the right decision',
            'Consider the applicant\'s profile and requirements',
          ]
        },
      ];

      // Add post-approval steps only if approved
      if (application.status === 'approved') {
        steps.push(
          {
            id: 'awaiting_payment',
            title: 'Awaiting Reservation Payment',
            description: 'Waiting for applicant to pay reservation fee',
            status: application.reservation_paid ? 'completed' : 'current',
            info: [
              'Applicant has 24 hours to pay reservation fee',
              'If payment is not received within 24 hours, listing will be released',

            ],
          }
        );
      }

      if (application.reservation_paid) {
        steps.push(
          {
            id: 'awaiting_contract',
            title: 'Awaiting Contract Signature',
            description: 'Waiting for applicant to sign adoption contract',
            status: application.contract_signed ? 'completed' :
              application.reservation_paid ? 'current' : 'locked',
            info: [
              'Contract outlines adoption terms and responsibilities',
              'Both parties must agree to the terms',
            ],
          }
        )
      }

      if (application.contract_signed) {
        steps.push(
          {
            id: 'awaiting_final_payment',
            title: 'Awaiting Final Payment',
            description: 'Waiting for applicant to complete final payment',
            status: application.payment_completed ? 'completed' :
              application.contract_signed ? 'current' : 'locked',
            info: [
              'Final payment completes the adoption',
              'Reservation fee will be deducted from total',
            ],
          }
        )
      }

      if (application.payment_completed) {
        steps.push(
          {
            id: 'finalize',
            title: application.status === 'completed' ? 'Adoption Completed' : 'Finalize Adoption',
            description: application.status === 'completed' ? 'Congratulations! Your adoption is complete. If you enjoyed your experiece, please leave us a review.' : 'Complete the adoption process',
            status: application.status === 'completed' ? 'completed' : 'pending',
            info: [
              'Mark adoption as completed',
              'Arrange pickup/delivery with new owner',
            ],
            actionButtons: application.payment_completed && application.status !== 'completed' ? [{
              label: 'Mark as Completed',
              onClick: onMarkCompleted || (() => { }),
              colorScheme: 'purple',
              icon: CheckIcon,
            }] : undefined,
          }
        )
      }
      return steps;
    }
  };

  const steps = getTimelineSteps();

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.status === 'current');
  };

  const { activeStep } = useSteps({
    index: getCurrentStepIndex(),
    count: steps.length,
  });

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
              <HStack align="center">
                <Box>
                  <StepTitle>{step.title}</StepTitle>
                  {/* 
                  {step.date && (
                    <StepDescription fontSize="xs" color="gray.500">
                      {step.date}
                    </StepDescription>
                  )} */}
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

              {application.status === 'approved' || application.status === 'rejected' && (
                <Text fontSize="xs" color="red.500">
                  {
                    //@ts-ignore
                    application.application_data?.response_message
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
};
