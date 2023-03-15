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
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import type { ConfirmationResult } from "firebase/auth";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import {
  query,
  collection,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { useRouter } from "next/router";
import type * as React from "react";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, fireStore } from "lib/firebase/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LoginForm = (props: any) => {
  const router = useRouter();
  const toast = useToast();

  const [user] = useAuthState(auth);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(
    {} as ConfirmationResult
  );
  const [loading, setLoading] = useState(false);

  const checkIfUserExists = async () => {
    const userQuery = query(
      collection(fireStore, "users"),
      where("phoneNumber", "==", phoneNumber)
    );

    const userDocs = await getCountFromServer(userQuery);
    return userDocs.data().count;
  };

  const onSendCode = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    const userExists = await checkIfUserExists();
    if (userExists) {
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
    } else {
      toast({
        title: "Account not found",
        description: "Please sign up to continue",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
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

  useEffect(() => {
    if (user && user.displayName) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <Stack spacing="8" {...props}>
      <Stack spacing="6" align="center">
        <Flex justify="center" as="a" href="/">
          <Image src="images/doghouse.png" width="200px" height="200px" />
        </Flex>
      </Stack>

      <Stack
        mt="0px !important"
        as="form"
        spacing="5"
        onSubmit={codeSent ? onVerifyCode : onSendCode}
      >
        <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
          <Heading size="sm">Log in to your account</Heading>
          <HStack spacing="1" justify="center">
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

        {!codeSent && (
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
        )}

        {codeSent && (
          <Stack spacing="3">
            <Alert status="success">
              <AlertIcon />
              Code sent to {phoneNumber}
            </Alert>
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
          </Stack>
        )}

        <Box id="recaptcha-container" hidden />

        <Button variant="primary" type="submit" isLoading={loading}>
          Continue to Doghouse
        </Button>
      </Stack>

      <Stack spacing="0.5" align="center">
        <Text fontSize="sm" color="muted">
          Having trouble logging in?
        </Text>
        <Button variant="link" colorScheme="brand" size="sm">
          Contact us
        </Button>
      </Stack>
    </Stack>
  );
};
