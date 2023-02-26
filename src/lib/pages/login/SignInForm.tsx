import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Flex,
  Text,
  Image,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import type { ConfirmationResult } from "firebase/auth";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useRouter } from "next/router";
import type * as React from "react";
import { useEffect, useState } from "react";
import { useAuthState, useUpdateProfile } from "react-firebase-hooks/auth";

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
  const [displayName, setDisplayName] = useState("");
  const [updateProfile, updating, error] = useUpdateProfile(auth);

  const onSendCode = async (event: React.FormEvent) => {
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
    }

    setLoading(false);
  };

  const onVerifyCode = async (event: React.FormEvent) => {
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
    }

    setLoading(false);
  };

  const onUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const success = await updateProfile({ displayName });
      if (success) {
        toast({
          title: "Profile updated successfully",
          description: "",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }

      router.push("/dashboard");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast({
        title: error?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (user && user.displayName) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <Stack spacing="8" {...props}>
      <Stack spacing="6" align="center">
        <Flex justify="center">
          <Image src="images/doghouse.png" width="200px" height="200px" />
        </Flex>
      </Stack>

      {!user && (
        <Stack
          as="form"
          spacing="5"
          onSubmit={codeSent ? onVerifyCode : onSendCode}
        >
          <Stack spacing="3" textAlign="center">
            <Heading size={isMobile ? "xs" : "md"}>
              Log in to your account
            </Heading>{" "}
            <Text color="muted">Start making your dreams come true</Text>
          </Stack>

          {codeSent && (
            <Alert status="success">
              <AlertIcon />
              Code sent to {phoneNumber}
            </Alert>
          )}
          <FormControl>
            <FormLabel htmlFor="phone">Phone</FormLabel>
            <Input
              data-peer
              required
              id="phone"
              name="phone"
              placeholder=" "
              type="tel"
              disabled={codeSent}
              onChange={(event) => setPhoneNumber(event?.target.value)}
            />
          </FormControl>

          {codeSent && (
            <FormControl>
              <FormLabel htmlFor="code">Code</FormLabel>
              <Input
                data-peer
                required
                id="code"
                name="code"
                placeholder="Enter verification code"
                type="tel"
                onChange={(event) => setCode(event?.target.value)}
              />
            </FormControl>
          )}

          <Box id="recaptcha-container" hidden />

          <Button variant="primary" type="submit" isLoading={loading}>
            Continue with phone
          </Button>
        </Stack>
      )}

      {user && !user?.displayName && (
        <Stack as="form" spacing="4" mt="8" onSubmit={onUpdateProfile}>
          <Heading size={isMobile ? "xs" : "md"}>Complete your profile</Heading>
          <FormControl id="name">
            <FormLabel srOnly>Enter your name</FormLabel>
            <Input
              type="text"
              placeholder="Enter your name"
              size="lg"
              fontSize="md"
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </FormControl>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={updating}
          >
            Update Profile
          </Button>
        </Stack>
      )}

      <Stack spacing="0.5" align="center">
        <Text fontSize="sm" color="muted">
          Having trouble logging in?
        </Text>
        <Button variant="link" colorScheme="blue" size="sm">
          Contact us
        </Button>
      </Stack>
      <Text fontSize="xs" color="subtle" textAlign="center">
        By continuing, you acknowledge that you have read, understood, and agree
        to our terms and condition
      </Text>
    </Stack>
  );
};
