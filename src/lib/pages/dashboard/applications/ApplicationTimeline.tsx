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
  onWithdrawApplication?: () => void;
  onApproveApplication?: () => void;
  onRejectApplication?: () => void;
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
  onPayReservation,
  onSignContract,
  onCompletePayment,
  onMarkCompleted,
  onWithdrawApplication,
  onApproveApplication,
  onRejectApplication,
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
            actionButtons: application.status === 'approved' && !application.reservation_paid ? [{
              label: 'Pay Reservation Fee',
              onClick: onPayReservation || (() => { }),
              colorScheme: 'green',
              icon: StarIcon,
            }] : undefined,
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
              'Required before final payment',
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
            status: application.payment_complete ? 'completed' :
              application.contract_signed ? 'current' : 'locked',
            info: [
              'Reservation fee will be deducted from final amount',
              'Payment secures ownership transfer',
              'Adoption process completes upon payment',
            ],
            actionButtons: application.contract_signed && !application.payment_complete ? [{
              label: 'Complete Payment',
              onClick: onCompletePayment || (() => { }),
              colorScheme: 'green',
              icon: StarIcon,
            }] : undefined,
          }
        )
      }

      if (application.payment_complete) {
        steps.push(
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
          actionButtons: application.status === 'pending' && onApproveApplication && onRejectApplication ? [
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
            status: application.payment_complete ? 'completed' :
              application.contract_signed ? 'current' : 'locked',
            info: [
              'Final payment completes the adoption',
              'Reservation fee will be deducted from total',
            ],
          }
        )
      }

      if (application.payment_complete) {
        steps.push(
          {
            id: 'finalize',
            title: 'Finalize Adoption',
            description: 'Complete the adoption process',
            status: application.status === 'completed' ? 'completed' : 'pending',
            info: [
              'Mark adoption as completed',
              'Arrange pickup/delivery with new owner',
            ],
            actionButtons: application.payment_complete && application.status !== 'completed' ? [{
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
                  {application.response_message}
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
                  <HStack spacing={2}>
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
