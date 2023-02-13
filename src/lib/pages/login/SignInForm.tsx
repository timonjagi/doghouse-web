import type { StackProps } from "@chakra-ui/react";
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
// import * as React from "react";

import { Logo } from "../../components/Logo";
import { GoogleIcon } from "../../components/auth/ProviderIcons";

export const SignInForm = (props: StackProps) => {
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Stack spacing="8" {...props}>
      <Stack spacing="6">
        {isMobile && <Logo />}
        <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
          <Heading size={useBreakpointValue({ base: "xs", md: "sm" })}>
            Log in to your account
          </Heading>
          <HStack spacing="1" justify="center">
            <Text color="muted">Don't have an account?</Text>
            <Button
              variant="link"
              colorScheme="brand"
              onClick={() => router.push("/signup")}
            >
              Sign up
            </Button>
          </HStack>
        </Stack>
      </Stack>
      <Stack spacing="6">
        <Stack spacing="5">
          <FormControl>
            <FormLabel htmlFor="phone">Phone</FormLabel>
            <Input id="phone" placeholder="Enter your phone" type="tel" />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input id="password" placeholder="********" type="password" />
          </FormControl>
        </Stack>
        <HStack justify="space-between">
          <Checkbox defaultChecked>Remember me</Checkbox>
          <Button variant="link" colorScheme="brand" size="sm">
            Forgot password
          </Button>
        </HStack>
        <Stack spacing="4">
          <Button variant="primary">Sign in</Button>
          <Button
            variant="secondary"
            leftIcon={<GoogleIcon boxSize="5" />}
            iconSpacing="3"
          >
            Sign in with Google
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
