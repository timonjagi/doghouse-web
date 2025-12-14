import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Badge,
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
} from '@chakra-ui/react';
import { AdoptionWithListing, AdoptionStatusHistory, useAdoptionTimelineLogic } from 'lib/hooks/queries/useAdoptions';

interface AdoptionTimelineProps {
  adoption: AdoptionWithListing;
  userProfile: any;
  transactions?: any[];
  statusHistory?: AdoptionStatusHistory[];
  availableActions?: any[]; // Defined button configs
}

export const AdoptionTimeline = React.forwardRef<{
  getCurrentStepButtons: () => any[];
}, AdoptionTimelineProps>((props, ref) => {
  // Use the logic hook - no actions passed here anymore
  const { steps, currentStepIndex, currentStep } = useAdoptionTimelineLogic({
    adoption: props.adoption,
    userProfile: props.userProfile,
    transactions: props.transactions,
    statusHistory: props.statusHistory
  });
  // Export function to get current step buttons for use in parent components
  const getCurrentStepButtons = () => {
    return props.availableActions || [];
  };

  // Make this available to parent component
  React.useImperativeHandle(ref, () => ({
    getCurrentStepButtons,
  }));

  const { activeStep } = useSteps({
    index: currentStepIndex,
    count: steps.length,
  });

  return (
    <Stepper index={activeStep} orientation='vertical' height='400px' gap='0'>
      {steps.map((step, index) => (
        <Step key={index} style={{ width: '100%' }}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>

          <Box flexShrink='0' width="100%">
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
            {step.info && step.info.length > 0 && (
              <VStack align="start" mt={2} mb={2} pl={2} borderLeft="2px solid" borderColor="gray.200">
                {step.info.map((info, i) => (
                  <Text key={i} fontSize="sm" color="gray.600">{info}</Text>
                ))}
              </VStack>
            )}

            {/* Render Actions ONLY for the current step */}
            {step.status === 'current' && props.availableActions && props.availableActions.length > 0 && (
              <Box mt={4} mb={4}>
                <HStack spacing={4} wrap="wrap">
                  {props.availableActions.map((btn, i) => (
                    <Button
                      key={i}
                      onClick={btn.onClick}
                      colorScheme={btn.colorScheme}
                      leftIcon={btn.icon ? <Icon as={btn.icon} /> : undefined}
                      variant={btn.variant || 'solid'}
                      size="sm"
                    >
                      {btn.label}
                    </Button>
                  ))}
                </HStack>
              </Box>
            )}
          </Box>

          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
});
