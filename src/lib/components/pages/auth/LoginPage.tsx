import {
  Box,
  HStack,
  Stack,
  Text,
  Heading,
  Img,
  useColorModeValue as mode
} from "@chakra-ui/react";
import { LoginForm } from "lib/components/auth/LoginForm";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

const LoginPage = () => {
  const router = useRouter();

  return (
    <>
      <NextSeo title="Login" />
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
          <Text color="muted">Don't have an account?</Text>
          <Box
            as="button"
            color="brand.500"
            fontWeight="semibold"
            onClick={() => router.push("/signup")}
            _hover={{ textDecoration: "underline" }}
          >
            Sign up
          </Box>
        </HStack>
      </Stack>
    </>
  );
};

export default LoginPage;
