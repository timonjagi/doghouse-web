import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Center,
  DarkMode,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue as mode,
  useToast,
} from "@chakra-ui/react";
import { LoginForm } from "lib/components/auth/LoginForm";
import { auth } from "lib/firebase/client";
// import * as React from "react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { Logo } from "../../layout/Logo";

const Login = () => {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const toast = useToast();
  useEffect(() => {
    if (!loading && user) {
      const fetchUserDoc = async () => {
        const response = await fetch(
          `/api/users/get-user?${new URLSearchParams({
            uid: user.uid,
          })}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.status === 200) {
          router.push("/home");
        } else {
          toast({
            title: "Account created successfully",
            description: "Let's finish creating your your profile",
            status: "success",
          });
          router.push("/signup");
        }
      };

      fetchUserDoc();
    }
  }, [user, loading, error]);

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
            <Heading size="lg">Log in to your account</Heading>

            <LoginForm />

            <HStack justify="center" spacing="1">
              <Text color="muted">Don&apos;t have an account?</Text>
              <Button
                variant="link"
                colorScheme="brand"
                onClick={() => router.push("/signup")}
              >
                Sign up
              </Button>
            </HStack>
          </Stack>
        </Center>
      </Flex>
    </Flex>
  );
};

export default Login;
