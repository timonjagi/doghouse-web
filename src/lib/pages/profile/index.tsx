import {
  Box,
  DarkMode,
  Flex,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue as mode,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  useSteps,
  Step,
} from "@chakra-ui/react";
// import * as React from "react";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import { Logo } from "../../components/nav/Logo";

import { Confirm } from "./04-confirm";
import { SelectPath } from "./02-select-path";
import { PetDetails } from "./03-pet-details";
import { ContactDetails } from "./01-contact-details";
import index from "instantsearch.js/es/widgets/index/index";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, fireStore } from "lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { Loader } from "lib/components/Loader";

type User = {
  // eslint-disable-next-line
  customClaims: any;
  disabled: boolean;
  displayName: string;
  emailVerified: boolean;
  // eslint-disable-next-line
  metadata: any;
  phoneNumber: string;
  // eslint-disable-next-line
  providerData: any;
  uid: string;
};

type UserProfile = {
  userId: string;
  name: string;
  location: string;
  roles: any;
  pet_profiles: any;
};

const SignUp = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [user, loadingUser] = useAuthState(auth);
  const [loadingUserProfile, setLoadingUserProfile] = useState(false);
  const [userProfile, setUserProfile] = useState({} as any);

  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  const steps = [
    { title: "Contact info", description: "Name, Location" },
    { title: "Choose path", description: "Owner, Seeker" },
    { title: "Pet details", description: "Breed, Gender, Age" },
    { title: "Confirm", description: "Review info" },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  useEffect(() => {
    setModalOpen(isMobile);

    try {
      const profile = JSON.parse(localStorage.getItem("profile"));
      if (profile) {
        setUserProfile(profile);
        if (
          profile.name &&
          profile.location &&
          profile.roles &&
          profile.pet_profiles
        ) {
          setActiveStep(3);
        } else if (profile.name && profile.location && profile.roles) {
          setActiveStep(2);
        } else if (profile.name && profile.location) {
          setActiveStep(1);
        }
      }
    } catch (error) {
      console.error("Error parsing or retrieving profile data:", error);
    }
  }, []);

  return (
    <Flex h="100%">
      <NextSeo title="Complete Profile" />

      <Flex maxW="8xl" w="full">
        {/* side bar */}
        <Box
          display={{ base: "none", md: "flex" }}
          backgroundColor="brand.700"
          minW={{ md: "sm", lg: "lg" }}
        >
          <Flex
            direction="column"
            px={{ base: "4", md: "8" }}
            height="full"
            color="on-accent"
          >
            <Flex align="center" h="24">
              <Logo />
            </Flex>

            <Flex
              align="center"
              h="full"
              px={useBreakpointValue({ base: "0", xl: "16" })}
            >
              <Stepper
                index={activeStep}
                orientation="vertical"
                height="400px"
                gap="0"
                colorScheme="brand"
              >
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>

                    <Box flexShrink="0">
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>
                        <Text color="whiteAlpha.600">{step.description}</Text>
                      </StepDescription>
                    </Box>

                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>
            </Flex>

            <Flex align="center" h="24">
              <Text color="on-accent-subtle" fontSize="sm">
                © 2022 Doghouse Kenya. All rights reserved.
              </Text>
            </Flex>
          </Flex>
        </Box>
        {/* end sidebar */}

        <Flex
          flex="1"
          w="full"
          h="full"
          align={{ base: "start", md: "center" }}
        >
          {!loadingUser && !loadingUserProfile && (
            <Stack
              spacing="9"
              w="full"
              px={{ base: "6", sm: "8", lg: "16", xl: "32" }}
            >
              {isMobile && (
                <Stack mt="8">
                  <Stepper
                    size="sm"
                    index={activeStep}
                    gap="0"
                    colorScheme="brand"
                  >
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
                    Step {activeStep + 1}: <b>{steps[activeStep].title}</b>
                  </Text>
                </Stack>
              )}

              {activeStep === 0 && (
                <ContactDetails
                  currentStep={activeStep}
                  setStep={setActiveStep}
                />
              )}

              {activeStep === 1 && (
                <SelectPath
                  currentStep={activeStep}
                  setStep={setActiveStep}
                  user={user}
                />
              )}
              {activeStep === 2 && (
                <PetDetails currentStep={activeStep} setStep={setActiveStep} />
              )}
              {activeStep === 3 && (
                <Confirm currentStep={activeStep} setStep={setActiveStep} />
              )}
            </Stack>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SignUp;
