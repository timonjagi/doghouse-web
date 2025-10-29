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
} from '@chakra-ui/icons';

interface ApplicationTimelineProps {
  application: any;
  userProfile: any;
  onPayReservation?: () => void;
  onSignContract?: () => void;
  onCompletePayment?: () => void;
  onMarkCompleted?: () => void;
}

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending' | 'locked';
  date?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    colorScheme: string;
    icon: any;
    disabled?: boolean;
  };
  info?: string[];
}

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({
  application,
  userProfile,
  onPayReservation,
  onSignContract,
  onCompletePayment,
  onMarkCompleted,
}) => {
  const isOwner = userProfile?.id === application.listings.owner_id;
  const isApplicant = userProfile?.id === application.seeker_id;

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
        },
        {
          id: 'under_review',
          title: 'Under Review',
          description: 'Application is being reviewed by the breeder',
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
              ? 'Application was not approved at this time'
              : 'Awaiting breeder decision',
          status: ['approved', 'rejected'].includes(application.status) ? 'completed' :
            application.status === 'pending' ? 'current' : 'pending',
          info: application.status === 'approved' ? [
            'Listing is now reserved for you',
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
            description: application.reservation_paid ? 'Listing is reserved for you' : 'Pay reservation fee to secure your adoption',
            status: application.reservation_paid ? 'completed' : 'current',
            info: [
              'Reservation fee is deducted from final payment',
              'If payment is not received within 24 hours, listing will be released',
            ],
            actionButton: application.status === 'approved' && !application.reservation_paid ? {
              label: 'Pay Reservation Fee',
              onClick: onPayReservation || (() => { }),
              colorScheme: 'green',
              icon: StarIcon,
            } : undefined,
          },
          {
            id: 'contract',
            title: 'Sign Adoption Contract',
            description: 'Review and sign the adoption contract',
            status: application.contract_signed ? 'completed' :
              application.reservation_paid ? 'current' : 'locked',
            info: [
              'Legal agreement outlining adoption terms',
              'Includes responsibilities of both parties',
              'Required before final payment',
            ],
            actionButton: application.reservation_paid && !application.contract_signed ? {
              label: 'Sign Contract',
              onClick: onSignContract || (() => { }),
              colorScheme: 'blue',
              icon: EditIcon,
            } : undefined,
          },
          {
            id: 'payment',
            title: 'Complete Payment',
            description: 'Make final payment to complete adoption',
            status: application.payment_complete ? 'completed' :
              application.contract_signed ? 'current' : 'locked',
            info: [
              'Reservation fee will be deducted from final amount',
              'Payment secures ownership transfer',
              'Adoption process completes upon payment',
            ],
            actionButton: application.contract_signed && !application.payment_complete ? {
              label: 'Complete Payment',
              onClick: onCompletePayment || (() => { }),
              colorScheme: 'green',
              icon: StarIcon,
            } : undefined,
          },
          {
            id: 'completed',
            title: 'Adoption Completed',
            description: application.status === 'completed' ? 'Congratulations! Adoption process is complete' : '',
            status: application.status === 'completed' ? 'completed' : 'pending',
            info: [
              'Ownership transfer is complete',
              'You will receive pickup/delivery arrangements',
              'Welcome to your new family member!',
            ],
          }
        );
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
          ],
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
              'Reservation secures the listing for adoption',
            ],
          },
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
          },
          {
            id: 'awaiting_final_payment',
            title: 'Awaiting Final Payment',
            description: 'Waiting for applicant to complete final payment',
            status: application.payment_complete ? 'completed' :
              application.contract_signed ? 'current' : 'locked',
            info: [
              'Final payment completes the adoption',
              'Reservation fee will be deducted from total',
            ],
          },
          {
            id: 'finalize',
            title: 'Finalize Adoption',
            description: 'Complete the adoption process',
            status: application.status === 'completed' ? 'completed' : 'pending',
            info: [
              'Mark adoption as completed',
              'Arrange pickup/delivery with new owner',
            ],
            actionButton: application.payment_complete && application.status !== 'completed' ? {
              label: 'Mark as Completed',
              onClick: onMarkCompleted || (() => { }),
              colorScheme: 'purple',
              icon: CheckIcon,
            } : undefined,
          }
        );
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

          <Box flexShrink="0" w="full">
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
                  <Badge colorScheme="blue" variant="subtle" size="sm">
                    Current Step
                  </Badge>
                )}
                {step.status === 'completed' && (
                  <Badge colorScheme="green" variant="subtle" size="sm">
                    Completed
                  </Badge>
                )}
              </HStack>

              <StepDescription pt={2} pb={4}>{step.description}</StepDescription>


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

              {/* Action button */}
              {step.actionButton && (
                <Box py={2}>
                  <Button
                    size="sm"
                    colorScheme={step.actionButton.colorScheme}
                    leftIcon={<Icon as={step.actionButton.icon} />}
                    onClick={step.actionButton.onClick}
                    isDisabled={step.actionButton.disabled}
                  >
                    {step.actionButton.label}
                  </Button>
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
