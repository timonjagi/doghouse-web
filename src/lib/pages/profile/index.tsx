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
import { Logo } from "../../components/Logo";

import { Confirm } from "./04-confirm";
import { PetBasics } from "./02-pet-basics";
import { PetDetails } from "./03-pet-details";
import { HumanProfile } from "./01-human-profile";
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
};

const SignUp = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [user, loadingUser] = useAuthState(auth);
  const [loadingUserProfile, setLoadingUserProfile] = useState(false);

  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  const steps = [
    { title: "Human profile", description: "Contact Info" },
    { title: "Pet basics", description: "Breed, Gender, Age" },
    { title: "Pet details", description: "" },
    { title: "Confirm", description: "" },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // const res = await fetch(`api/users/get-user?uid=${user.uid}`, {
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // });

        const docRef = doc(fireStore, "users", user.uid as string);
        const docSnap = await getDoc(docRef);

        setLoadingUserProfile(false);

        if (docSnap.exists()) {
          const user = docSnap.data();
          console.log(user);

          if (user.name && user.location) {
            setActiveStep(1);
            // } else if {
            //
          }
          return user;
        } else {
          setModalOpen(isMobile);
          console.log("user not found");
          return null;
        }
      } catch (error) {
        setLoadingUserProfile(false);
      }
    };

    setLoadingUserProfile(true);

    if (!loadingUser && user) {
      fetchUser();
    }
  }, [user, loadingUser, setLoadingUserProfile]);

  return (
    <Flex
      bgGradient={useBreakpointValue({
        md: mode(
          "linear(to-r, brand.600 50%, white 50%)",
          "linear(to-r, brand.600 50%, gray.900 50%)"
        ),
      })}
      h="100%"
    >
      <NextSeo title="Complete Profile" />

      <Flex maxW="8xl" w="full">
        {/* side bar */}
        <Box flex="1" display={{ base: "none", md: "block" }}>
          <DarkMode>
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
                  colorScheme="brand-on-accent"
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
                        <StepDescription>{step.description}</StepDescription>
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
          </DarkMode>
        </Box>
        {/* end sidebar */}

        <Flex flex="1" w="full" h="full">
          {!loadingUser && !loadingUserProfile && (
            <Stack
              spacing="9"
              w="full"
              px={{ base: "8", lg: "16", xl: "32" }}
              pt={{ base: "16", md: "32" }}
            >
              {isMobile && (
                <Stack>
                  <Stepper
                    size="sm"
                    index={activeStep}
                    gap="0"
                    colorScheme="brand-on-accent"
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
                <HumanProfile
                  currentStep={activeStep}
                  setStep={setActiveStep}
                />
              )}

              {activeStep === 1 && (
                <PetBasics currentStep={activeStep} setStep={setActiveStep} />
              )}
              {activeStep === 2 && (
                <PetDetails currentStep={activeStep} setStep={setActiveStep} />
              )}
              {activeStep === 3 && (
                <Confirm currentStep={activeStep} setStep={setActiveStep} />
              )}
            </Stack>
          )}

          {(loadingUser || loadingUserProfile) && <Loader />}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SignUp;
