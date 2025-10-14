import React from 'react';
import {
  Box,
  useSteps,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepSeparator,
  Text,
  Stack,
} from '@chakra-ui/react';
import { SeekerContactDetails } from './contact-details';
import { SeekerPreferences } from './preferences';
import { WantedListing } from './wanted-listing';
import { SeekerSuccess } from './success';

export const SeekerOnboardingFlow: React.FC = () => {
  const steps = [
    { title: 'Contact Details', description: 'Personal information' },
    { title: 'Preferences', description: 'Your ideal dog' },
    { title: 'Wanted Listing', description: 'Create your request' },
    { title: 'Complete Setup', description: 'Welcome to DogHouse!' },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  return (
    <Box maxW="2xl">
      <Stack spacing={{ base: 6, md: 9 }} px={{ base: "6", sm: "8", lg: "16" }} py={{ base: "6", md: "8" }} align="center">
        <Stack mt={{ base: 4, md: 8 }} w="full">
          <Stepper size="sm" index={activeStep} gap="0" colorScheme="brand">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus complete={<StepIcon />} />
                </StepIndicator>
                <StepSeparator />
              </Step>
            ))}
          </Stepper>
          <Text>
            Step {activeStep + 1} of {steps.length}: <b>{steps[activeStep].title}</b>
          </Text>
          <Text fontSize="sm" color="gray.600">
            {steps[activeStep].description}
          </Text>
        </Stack>

        {activeStep === 0 && (
          <SeekerContactDetails currentStep={activeStep} setStep={setActiveStep} />
        )}

        {activeStep === 1 && (
          <SeekerPreferences currentStep={activeStep} setStep={setActiveStep} />
        )}

        {activeStep === 2 && (
          <WantedListing currentStep={activeStep} setStep={setActiveStep} />
        )}

        {activeStep === 3 && (
          <SeekerSuccess />
        )}
      </Stack>
    </Box>
  );
};
