import React, { useState } from 'react';
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
import { BreederContactDetails } from './contact-details';
import { BreedSelection } from './breed-selection';
import { BreedImages } from './breed-images';
import { BreederSuccess } from './success';

export const BreederOnboardingFlow: React.FC = () => {
  const steps = [
    { title: 'Contact Details', description: 'Kennel information' },
    { title: 'Breed Selection', description: 'Choose your breeds' },
    { title: 'Breed Images', description: 'Upload breed photos' },
    { title: 'Complete Setup', description: 'Finish registration' },
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
          <BreederContactDetails currentStep={activeStep} setStep={setActiveStep} />
        )}

        {activeStep === 1 && (
          <BreedSelection currentStep={activeStep} setStep={setActiveStep} />
        )}

        {activeStep === 2 && (
          <BreedImages currentStep={activeStep} setStep={setActiveStep} />
        )}

        {activeStep === 3 && (
          <BreederSuccess />
        )}
      </Stack>
    </Box>
  );
};
