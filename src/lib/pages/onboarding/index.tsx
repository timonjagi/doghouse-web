import {
  Stack,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepSeparator,
  Text,
  useSteps,
  Flex,
  Box,
  Img,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ContactDetails } from "./02-contact-details";
import { SelectPath } from "./01-select-path";
import { PetBasics } from "./03-pet-basics";
import { PetDetails } from "./04-pet-details";
import { Success } from "./05-success";
import { UserProfile } from "lib/models/user-profile";
import { auth } from "lib/firebase/client";
import { useAuthState } from "react-firebase-hooks/auth";
import Welcome from "./00-welcome";

type OnboardingModalProps = {
  userProfile?: UserProfile;
  onClose: any;
};

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  userProfile,
  onClose,
}) => {
  const isMobile = useBreakpointValue({
    base: true,
    sm: false,
  });

  const steps = [
    { title: "Choose your journey", description: "Owner, Seeker" },
    { title: "Contact info", description: "Name, Location" },
    { title: "Pet basics", description: "Breed, Gender, Age" },
    { title: "Pet details", description: "Breed, Gender, Age" },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  useEffect(() => {
    if (userProfile) {
      if (
        userProfile.name &&
        userProfile.location &&
        userProfile.roles &&
        userProfile.pet_profiles
      ) {
        setActiveStep(3);
      } else if (
        userProfile.name &&
        userProfile.location &&
        userProfile.roles
      ) {
        setActiveStep(2);
      } else if (userProfile.name && userProfile.location) {
        setActiveStep(1);
      }
    }
  }, [userProfile]);

  return (
    <Box maxW="2xl">
      {/* {isMobile && (
        <Box position="relative" w="full" h="full" bg="brand.100">
          <Img
            src="images/doggo.png"
            alt="Main Image"
            w="full"
            h={{ base: "120px", md: "100px" }}
            borderRadius="0.5rem 0.5rem 0 0"
            objectFit="cover"
            objectPosition="90% center"
          />
        </Box>
      )} */}
      <Stack
        spacing={{ base: 6, md: 9 }}
        px={{ base: "6", sm: "8", lg: "16" }}
        py={{ base: "6", md: "8" }}
        align="center"
      >
        <Stack mt={{ base: 4, md: 8 }} w="full">
          <Stepper size="sm" index={activeStep} gap="0" colorScheme="brand">
            {steps.map((step, index) => (
              <Step key={index} gap="0">
                <StepIndicator>
                  <StepStatus complete={<StepIcon />} />
                </StepIndicator>
                <StepSeparator _horizontal={{ ml: "0" }} />
              </Step>
            ))}
          </Stepper>
          <Text>
            {activeStep + 1}: <b>{steps[activeStep].title}</b>
          </Text>
        </Stack>

        {activeStep === 0 && (
          <SelectPath currentStep={activeStep} setStep={setActiveStep} />
        )}

        {activeStep === 1 && (
          <ContactDetails currentStep={activeStep} setStep={setActiveStep} />
        )}

        {activeStep === 2 && (
          <PetBasics currentStep={activeStep} setStep={setActiveStep} />
        )}

        {activeStep === 3 && (
          <PetDetails
            currentStep={activeStep}
            setStep={setActiveStep}
            onClose={onClose}
          />
        )}
      </Stack>
    </Box>
  );
};
export default OnboardingModal;
