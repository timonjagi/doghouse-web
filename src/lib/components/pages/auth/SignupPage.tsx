import {
  Box,
  HStack,
  Stack,
  Text,
  Heading,
  Center,
  Img,
  useColorModeValue as mode
} from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import { SignupForm } from "lib/components/auth/SignupForm";
import { useRouter } from "next/router";
import AuthLayout from "../../layout/AuthLayout";
import { AuthSidebarContent } from "../../layout/AuthSidebarContent";

const SignUp = () => {
  const router = useRouter();
  const role = router.query.role as 'breeder' | 'seeker' | null;

  const mainContent = (
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
        <Text color="muted">Already have an account?</Text>
        <Box
          as="button"
          color="brand.500"
          fontWeight="semibold"
          onClick={() => router.push("/login")}
          _hover={{ textDecoration: "underline" }}
        >
          Log in
        </Box>
      </HStack>
    </Stack>
  );

  const sidebarContent = <AuthSidebarContent role={role} />;

  return (
    <>
      <NextSeo title="Create Profile" />
      <AuthLayout sidebarContent={sidebarContent}>
        {mainContent}
      </AuthLayout>
    </>
  );
};

export default SignUp;
