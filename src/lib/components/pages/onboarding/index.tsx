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
  Card,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useCurrentUser } from "../../../hooks/queries";
import { useSeekerProfile } from "../../../hooks/queries/useSeekerProfile";
import { useBreederProfile } from "../../../hooks/queries/useBreederProfile";
import { BreederOnboardingFlow } from "./breeder";
import { SeekerOnboardingFlow } from "./seeker";
import { useRouter } from "next/router";
import RoleSelectionStep from "./role-selection";
import { NextSeo } from "next-seo";
import { Logo } from "lib/components/layout/Logo";
import { Loader } from "lib/components/ui/Loader";

const OnboardingPage = () => {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const profile = user ? {
    id: user.id,
    display_name: user.user_metadata?.display_name,
    email: user.email,
    role: user.user_metadata?.role,
    onboarding_completed: user.user_metadata?.onboarding_completed,
  } : null;

  if (userLoading) return <Loader />;

  return (
    <Flex
      minH="100vh"
      bgImage="url('/images/doggo.png')"
      bgSize="cover"
      bgRepeat="no-repeat"
    // bgGradient={{
    //   md: mode(
    //     "linear(to-r, brand.200 10%, gray.100 50%)"
    //   ),
    // }}
    >
      <NextSeo title="Get Started" />

      <Flex maxW="xl" mx="auto" width="full">
        <Center flex="1">
          <Card
            p="8"
            my={{ base: "8", lg: "16", xl: "32" }}
            mx={{ base: "4", lg: "8" }}
          >
            {!profile?.role && <RoleSelectionStep />}

            {profile?.role === "breeder" && <BreederOnboardingFlow />}

            {profile?.role === "seeker" && <SeekerOnboardingFlow />}



          </Card>
        </Center>
      </Flex>
    </Flex >
  )

};



export default OnboardingPage
