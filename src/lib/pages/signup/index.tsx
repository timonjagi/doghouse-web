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
  Avatar,
  Heading,
  Icon,
  AvatarGroup,
  useToast,
  Button,
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
import { LoginForm } from "lib/components/auth/LoginForm";
import { useRouter } from "next/router";

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
const Features = () => {
  return (
    <Box display={{ base: "none", md: "flex" }}>
      <DarkMode>
        <Flex direction="column" height="full" color="on-accent">
          <Flex flex="1" align="center">
            <Stack spacing="8">
              <Stack spacing="6">
                <Heading size={useBreakpointValue({ md: "lg", xl: "xl" })}>
                  Find your perfect match
                </Heading>
                <Text fontSize="lg" maxW="md" fontWeight="medium">
                  Create an account and get connected to our network of
                  reputable breeders.
                </Text>
              </Stack>
              <HStack spacing="4">
                <AvatarGroup
                  size="md"
                  max={useBreakpointValue({ base: 2, lg: 5 })}
                  borderColor="on-accent"
                >
                  <Avatar
                    name="Ryan Florence"
                    src="https://bit.ly/ryan-florence"
                  />
                  <Avatar
                    name="Segun Adebayo"
                    src="https://bit.ly/sage-adebayo"
                  />
                  <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                  <Avatar
                    name="Prosper Otemuyiwa"
                    src="https://bit.ly/prosper-baba"
                  />
                  <Avatar
                    name="Christian Nwamba"
                    src="https://bit.ly/code-beast"
                  />
                </AvatarGroup>
                <Text fontWeight="medium">Join 1000+ users</Text>
              </HStack>
            </Stack>
          </Flex>
          {/* <Flex align="center" h="24">
            <Text color="on-accent-subtle" fontSize="sm">
              © 2022 Doghouse Kenya. All rights reserved.
            </Text>
          </Flex> */}
        </Flex>
      </DarkMode>
    </Box>
  );
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

  const toast = useToast();
  const router = useRouter();

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
      } else {
        const fetchUserDoc = async () => {
          const response = await fetch(
            `/api/users/get-user?${new URLSearchParams({
              uid: user?.uid,
            })}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (response.status === 200) {
            toast({
              title: "Already signed up",
              description: "You already created your profile",
              status: "success",
            });

            router.push("/dashboard");
          }
        };

        if (!loadingUser && user) {
          fetchUserDoc();
        }
      }
    } catch (error) {
      console.error("Error parsing or retrieving profile data:", error);
    }
  }, [user, loadingUser]);

  return (
    <Flex h="100%">
      <NextSeo title="Create Profile" />

      <Flex w="full">
        {/* side bar */}
        <Box
          display={{ base: "none", md: "flex" }}
          backgroundColor="brand.700"
          minW={{ md: "sm", lg: "lg" }}
          maxW="xl"
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
              {!user?.uid && <Features />}

              {user?.uid && (
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
              )}
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
            <>
              {!user?.uid ? (
                <Stack
                  spacing="9"
                  px={{ base: "6", sm: "8", lg: "16", xl: "32" }}
                  align="center"
                >
                  <Heading size="lg">Let's create your account</Heading>
                  <LoginForm />

                  <HStack justify="center" spacing="1">
                    <Text color="muted">Already&apos;t have an account?</Text>
                    <Button
                      variant="link"
                      colorScheme="brand"
                      onClick={() => router.push("/login")}
                    >
                      Log in
                    </Button>
                  </HStack>
                </Stack>
              ) : (
                <Stack
                  spacing="9"
                  px={{ base: "6", sm: "8", lg: "16", xl: "32" }}
                  align="center"
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
                    <PetDetails
                      currentStep={activeStep}
                      setStep={setActiveStep}
                    />
                  )}

                  {activeStep === 3 && (
                    <Confirm currentStep={activeStep} setStep={setActiveStep} />
                  )}
                </Stack>
              )}
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SignUp;
