import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  PinInput,
  PinInputField,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import type { ConfirmationResult } from "firebase/auth";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useRouter } from "next/router";
import type * as React from "react";
import { useState } from "react";
import { useUpdateProfile } from "react-firebase-hooks/auth";

import { auth } from "lib/firebase/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LoginForm = (props: any) => {
  const router = useRouter();
  const toast = useToast();

  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [codeVerificationFailed, setCodeVerificationFailed] = useState(false);
  const [code, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(
    {} as ConfirmationResult
  );
  const [updateProfile, updating] = useUpdateProfile(auth);

  const [loading, setLoading] = useState(false);
  const [userExists, setUserExists] = useState(false);
  // const [invalidCode, setInvalidCode] = useState(false);

  const sendVerificationCode = async () => {
    const appVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
      },
      auth
    );

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
        setCodeVerified(true);
        if (userExists) {
          toast({
            title: "Logged in successfully",
            description: "",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          router.push("/dashboard");
        } else {
          return;
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setCodeVerificationFailed(true);
      setVerificationCode("");
    }

    setLoading(false);
  };

  const checkIfUserExists = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `/api/get-user?${new URLSearchParams({ phoneNumber })}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        setUserExists(true);
      }

      sendVerificationCode();
      // eslint-disable-next-line
    } catch (err: any) {
      toast({
        title: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const completeProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await updateProfile({ displayName });

      toast({
        title: "Account created successfully",
        description: "",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      router.push("/dashboard");
      // eslint-disable-next-line
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

  return (
    <Stack spacing="8" {...props}>
      <Stack spacing="4" align="center">
        <Flex justify="center" as="a" href="/">
          <Image
            src="images/logo.png"
            width="auto"
            height="100px"
            alt="Doghouse Logo"
          />
        </Flex>

        <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
          {!codeVerified && <Heading size="sm">Log in to your account</Heading>}
          {codeVerified && !userExists && (
            <Heading size="sm">Complete your profile</Heading>
          )}
        </Stack>
      </Stack>

      <Stack>
        {!codeSent && (
          <Stack spacing="5" as="form" onSubmit={checkIfUserExists}>
            <FormControl>
              <FormLabel htmlFor="phone">Phone</FormLabel>
              <InputGroup>
                <InputLeftAddon>+254</InputLeftAddon>
                <Input
                  required
                  id="phone"
                  name="phone"
                  placeholder="Enter you mobile number"
                  type="tel"
                  disabled={codeSent}
                  onChange={(event) =>
                    setPhoneNumber(`+254${event?.target.value}`)
                  }
                />
              </InputGroup>
            </FormControl>

            <Button variant="primary" type="submit" isLoading={loading}>
              Continue to Doghouse
            </Button>
          </Stack>
        )}
        {codeSent && !codeVerified && (
          <Stack spacing="3">
            {!codeVerificationFailed && (
              <Alert status="success">
                <AlertIcon />
                OTP sent to {phoneNumber}
              </Alert>
            )}

            {codeVerificationFailed && (
              <Alert status="error">
                <AlertIcon />
                <Text fontSize="sm">
                  The code you entered is not valid. Try again
                </Text>
              </Alert>
            )}

            <Stack as="form" spacing="5" onSubmit={onVerifyCode}>
              <FormControl>
                <FormLabel htmlFor="code">Enter Passcode</FormLabel>
                <FormControl>
                  <HStack justify="space-between">
                    <PinInput
                      otp
                      onChange={(value) => setVerificationCode(value)}
                    >
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                    </PinInput>
                  </HStack>
                </FormControl>
              </FormControl>

              <Button variant="primary" type="submit" isLoading={loading}>
                Verify Code
              </Button>

              <HStack spacing="1" justify="center">
                <Text color="muted">Did&apos;t receive a code?</Text>
                <Button
                  variant="link"
                  colorScheme="brand"
                  onClick={() => sendVerificationCode}
                >
                  Resend
                </Button>
              </HStack>
            </Stack>
          </Stack>
        )}
        {codeVerified && !userExists && (
          <Stack spacing="5" as="form" onSubmit={completeProfile}>
            <Alert status="success">
              <AlertIcon />
              <Text fontSize="sm">Account created successfully.</Text>
            </Alert>
            <FormControl>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                required
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </FormControl>

            <Button variant="primary" type="submit" isLoading={updating}>
              Complete Profile
            </Button>
          </Stack>
        )}
        ~
      </Stack>

      <Stack spacing="0.5" align="center">
        <Text fontSize="sm" color="muted">
          {!codeSent && "Having trouble logging in?"}
          {codeSent && !codeVerified && `Did&apos;t get a code?`}
        </Text>

        {!codeSent && (
          <Button variant="link" colorScheme="brand" size="sm">
            Contact us
          </Button>
        )}

        {codeSent && !codeVerified && (
          <Button
            variant="link"
            colorScheme="brand"
            size="sm"
            onClick={sendVerificationCode}
          >
            Resend code
          </Button>
        )}
      </Stack>

      <Box id="recaptcha-container" hidden />
    </Stack>
  );
};
