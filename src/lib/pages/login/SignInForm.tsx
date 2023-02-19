import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import type { ConfirmationResult } from "firebase/auth";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useRouter } from "next/router";
import type * as React from "react";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import {
  GoogleIcon,
  TwitterIcon,
  GitHubIcon,
} from "../../components/auth/ProviderIcons";
import { Logo } from "../../components/Logo";
import { auth } from "lib/firebase/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SignInForm = (props: any) => {
  const router = useRouter();
  const toast = useToast();

  const isMobile = useBreakpointValue({ base: true, md: false });

  const [user] = useAuthState(auth);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(
    {} as ConfirmationResult
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSendCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const appVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
      },
      auth
    );

    setLoading(true);

    try {
      const result = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );

      if (result) {
        setCodeSent(true);
        setConfirmationResult(result);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast({
        title: err.message,
        description: err.message || "",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      appVerifier.clear();
      setError(err.message);
    }

    setLoading(false);
  };

  const onVerifyCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(code);
      if (result) {
        toast({
          title: "Logged in successfully",
          description: "",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast({
        title: err.message,
        description: err.message || "",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setError(err.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  return (
    <Stack spacing="8" {...props}>
      <Stack spacing="6">
        {isMobile && <Logo />}
        <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
          <Heading size={useBreakpointValue({ base: "xs", md: "sm" })}>
            Log in to your account
          </Heading>
        </Stack>

        {codeSent && (
          <Alert status="success">
            <AlertIcon />
            Code sent to {phoneNumber}
          </Alert>
        )}
      </Stack>

      <form onSubmit={codeSent ? onVerifyCode : onSendCode}>
        <Stack spacing="6">
          <Stack spacing="5">
            {!codeSent && (
              <FormControl>
                <Input
                  data-peer
                  required
                  id="phone"
                  name="phone"
                  placeholder=" "
                  type="tel"
                  onChange={(event) => setPhoneNumber(event?.target.value)}
                />
                <FormLabel htmlFor="phone" variant="floating">
                  Phone
                </FormLabel>
              </FormControl>
            )}
            {codeSent && (
              <FormControl>
                <Input
                  data-peer
                  required
                  id="code"
                  name="code"
                  placeholder=" "
                  type="tel"
                  onChange={(event) => setCode(event?.target.value)}
                />
                <FormLabel htmlFor="code" variant="floating">
                  Code
                </FormLabel>
              </FormControl>
            )}

            <Box id="recaptcha-container" hidden />

            {error && (
              <Text textAlign="center" color="red" fontSize="10pt">
                {error}
              </Text>
            )}

            <Button variant="primary" type="submit" isLoading={loading}>
              {codeSent ? "Log in" : "Continue with phone"}
            </Button>
          </Stack>

          {/* <Stack spacing="4" pt="4">
          <FormControl>
            <Input id="email" type="email" placeholder=" " data-peer />
            <FormLabel htmlFor="email" variant="floating">
              Email
            </FormLabel>
          </FormControl>
          <Button variant="primary">Continue with email</Button>
        </Stack> */}

          <Stack spacing="6">
            <HStack>
              <Divider />
              <Text fontSize="sm" color="muted">
                OR
              </Text>
              <Divider />
            </HStack>
            <Stack spacing="3">
              <Button
                variant="secondary"
                leftIcon={<GoogleIcon boxSize="5" />}
                iconSpacing="3"
              >
                Continue with Google
              </Button>
              <Button
                variant="secondary"
                leftIcon={<TwitterIcon boxSize="5" />}
                iconSpacing="3"
              >
                Continue with Twitter
              </Button>
              <Button
                variant="secondary"
                leftIcon={<GitHubIcon boxSize="5" />}
                iconSpacing="3"
              >
                Continue with GitHub
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};
