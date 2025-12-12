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
  Img,
  useColorModeValue as mode
} from "@chakra-ui/react";
// import * as React from "react";
import { NextSeo } from "next-seo";
import { Logo } from "../../layout/Logo";

import { SignupForm } from "lib/components/auth/SignupForm";
import { useRouter } from "next/router";


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
          <Flex align="center" h="24">
            <Text color="on-accent-subtle" fontSize="sm">
              © {new Date().getFullYear()} Pethouse Kenya. All rights reserved.
            </Text>
          </Flex>
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
            as={Stack}
            spacing="12"
            justify="center"
          >
            <Logo color="on-accent" />


            <Flex
              align="center"
              h="full"
              px={useBreakpointValue({ base: "0", xl: "16" })}
            >
              <Features />

            </Flex>

            <Flex align="center" h="24">
              <Text color="on-accent-subtle" fontSize="sm">
                © {new Date().getFullYear()} Pethouse Kenya. All rights reserved.
              </Text>
            </Flex>
          </Flex>
        </Box>
        {/* end sidebar */}

        <Box w="full">

          <Center flex="1" py="4">
            <Stack
              spacing={{ base: "6", md: "9" }}
              px={{ base: "6", sm: "8", lg: "16", xl: "32" }}
              align="center"
              textAlign="center"
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
              <Heading size="lg">Let's create your account</Heading>



              <SignupForm />

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
        </Box>
      </Flex>
    </Flex>
  );
};

export default SignUp;
