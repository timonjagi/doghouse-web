import {
  Box,
  DarkMode,
  Flex,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
  Avatar,
  Heading,
  AvatarGroup,
  Button,
  Center,
} from "@chakra-ui/react";
// import * as React from "react";
import { NextSeo } from "next-seo";
import { Logo } from "../../layout/Logo";

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
  const router = useRouter();

  return (
    <Flex h="100%">
      <NextSeo title="Create Profile" />

      <Flex maxW="8xl" mx="auto" width="full">
        {/* side bar */}
        <Box
          display={{ base: "none", md: "flex" }}
          backgroundColor="brand.700"
          flex="1"
        >
          <Flex
            direction="column"
            px={{ base: "4", md: "8" }}
            height="full"
            color="on-accent"
            minW={{ base: "none", md: "sm", lg: "md" }}
          >
            <Flex align="center" h="24">
              <Logo />
            </Flex>

            <Flex
              align="center"
              h="full"
              px={useBreakpointValue({ base: "0", xl: "16" })}
            >
              <Features />

              {/* {user?.uid && (
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
              )} */}
            </Flex>

            <Flex align="center" h="24">
              <Text color="on-accent-subtle" fontSize="sm">
                © 2022 Doghouse Kenya. All rights reserved.
              </Text>
            </Flex>
          </Flex>
        </Box>
        {/* end sidebar */}

        <Center w="full" flex="1">
          <Stack
            spacing={{ base: "6", md: "9" }}
            px={{ base: "6", sm: "8", lg: "16", xl: "32" }}
            align="center"
            textAlign="center"
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
        </Center>
      </Flex>
    </Flex>
  );
};

export default SignUp;
