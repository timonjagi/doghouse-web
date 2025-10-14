import {
  Text,
  Spinner,
  Center,
  VStack,
  Avatar,
  AvatarGroup,
  Box,
  DarkMode,
  Flex,
  Heading,
  HStack,
  Stack,
  useBreakpointValue,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useCurrentUser, useUserProfile } from "../../hooks/queries";
import { BreederOnboardingFlow } from "./breeder";
import { SeekerOnboardingFlow } from "./seeker";
import { useRouter } from "next/router";
import RoleSelectionStep from "./role-selection";
import { NextSeo } from "next-seo";
import { Logo } from "lib/components/layout/Logo";

const OnboardingPage = () => {
  const { data: user, isLoading: userLoading, error: userError } = useCurrentUser();

  const [selectedRole, setSelectedRole] = useState<string>("");
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    if (profile?.onboarding_completed) {
      router.push('/dashboard');
    }
  }, [profile]);

  useEffect(() => {
    if (userError) {
      router.push('/login');
    }
  }, [userError, user]);

  // Show loading spinner while checking authentication
  if (userLoading || profileLoading) {
    return (
      <Center h="400px">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  // Redirect if not authenticated
  if (userError || !user) {
    return (
      <Center h="400px">
        <VStack spacing={4}>
          <Text color="red.500" fontSize="lg">Please log in to continue with onboarding.</Text>
          <Text color="gray.600">You need to be authenticated to complete the onboarding process.</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Flex
      minH={{ base: "auto", md: "100vh" }}
      bgGradient={useBreakpointValue({
        md: mode(
          "linear(to-r, brand.600 50%, white 50%)",
          "linear(to-r, brand.600 50%, gray.900 50%)"
        ),
      })}
    >
      <NextSeo title="Login" />

      <Flex maxW="8xl" mx="auto" width="full">
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
                      <Avatar
                        name="Kent Dodds"
                        src="https://bit.ly/kent-c-dodds"
                      />
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
              <Flex align="center" h="24">
                <Text color="on-accent-subtle" fontSize="sm">
                  © 2022 Doghouse Kenya. All rights reserved.
                </Text>
              </Flex>
            </Flex>
          </DarkMode>
        </Box>
        <Center h="100vh" flex="1">
          <Stack
            spacing={{ base: "6", md: "9" }}
            textAlign="center"
            px={{ base: "8", lg: "16", xl: "32" }}
          >
            {!selectedRole && !user.user_metadata?.role && <RoleSelectionStep onRoleSelect={setSelectedRole} />}

            {selectedRole === "breeder" || user.user_metadata?.role === "breeder" && <BreederOnboardingFlow />}

            {selectedRole === "seeker" || user.user_metadata?.role === "seeker" && <SeekerOnboardingFlow />}

          </Stack>
        </Center>
      </Flex>
    </Flex>
  )

};



export default OnboardingPage
