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
  Img,
} from "@chakra-ui/react";
import { LoginForm } from "lib/components/auth/LoginForm";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

import { Logo } from "../../layout/Logo";

const LoginPage = () => {
  const router = useRouter();

  return (
    <Flex
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
              as={Stack}
              spacing="12"
              justify="center"
            >
              <Logo color="on-accent" />

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
                  © 2022 Pethouse Kenya. All rights reserved.
                </Text>
              </Flex>
            </Flex>
          </DarkMode>
        </Box>

        <Box flex="1" overflow="auto">
          <Center py="4" h="full">
            <Stack
              spacing={{ base: "6", md: "9" }}
              textAlign="center"
              px={{ base: "8", lg: "16", xl: "32" }}
            >

              <Box position="relative" mx="auto">
                <Img
                  src={mode('images/pethouse-logo-icon-light.png', 'images/pethouse-logo-icon-dark.png')}
                  alt="Main Image"
                  w="150"
                  h="150"
                  borderRadius="0.5rem 0.5rem 0 0"
                  objectFit="cover"
                  objectPosition="90% center"
                />
              </Box>
              <Stack>
                <Heading size="lg">Welcome back!</Heading>
                <Text color="muted">Sign in to your account to continue</Text>
              </Stack>

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
        </Box>
      </Flex>
    </Flex>
  );
};

export default LoginPage;
