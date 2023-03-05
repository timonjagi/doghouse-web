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
  useToast,
  HStack,
  Divider,
  InputGroup,
  InputLeftAddon,
  PinInput,
  PinInputField,
} from "@chakra-ui/react";
import type { ConfirmationResult } from "firebase/auth";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import {
  collection,
  doc,
  getCountFromServer,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import type * as React from "react";
import { useState } from "react";
import { useAuthState, useUpdateProfile } from "react-firebase-hooks/auth";

import { auth, fireStore } from "lib/firebase/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SignUpForm = (props: any) => {
  const router = useRouter();
  const toast = useToast();

  const [user] = useAuthState(auth);
  // eslint-disable-next-line
  const [updateProfile, updating, error] = useUpdateProfile(auth);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(
    {} as ConfirmationResult
  );
  const [loading, setLoading] = useState(false);
  const [invalidCode, setInvalidCode] = useState(false);

  // eslint-disable-next-line
  const userExists = async () => {
    try {
      const userQuery = query(
        collection(fireStore, "users"),
        where("phoneNumber", "==", phoneNumber)
      );
      const userDocs = await getCountFromServer(userQuery);
      return userDocs.data().count;
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

  const createUserDocument = async (uid: string) => {
    try {
      const userPayload = JSON.parse(JSON.stringify(user));
      delete userPayload.stsTokenManager;
      await setDoc(doc(fireStore, "users", uid), userPayload);
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

  const completeProfile = async (uid: string) => {
    try {
      await updateProfile({ displayName });

      const response = await fetch("/api/set-custom-claims", {
        method: "POST",
        body: JSON.stringify({ uid, isBreeder: false }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        await createUserDocument(uid);
        router.push("/dashboard");
      }

      toast({
        title: "Account created successfully",
        description: "",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
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

  const onSendCode = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    if (await userExists()) {
      toast({
        title: "Account already exists",
        description: "You are already signed up. Please log in to continue",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      router.push("/login");
    } else {
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
    }

    setLoading(false);
  };

  const onVerifyCode = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setInvalidCode(false);
    try {
      const result = await confirmationResult.confirm(code);
      if (result) {
        completeProfile(result.user.uid);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setInvalidCode(true);
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
        <Stack spacing="3" textAlign="center">
          <Heading size="sm">Create an account</Heading>
          <HStack justify="center" spacing="1">
            <Text color="muted">Already have an account?</Text>
            <Button
              variant="link"
              colorScheme="brand"
              onClick={() => router.push("/login")}
            >
              Log in
            </Button>
          </HStack>
        </Stack>

        {!codeSent && (
          <Stack spacing={3}>
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
          </Stack>
        )}

        {codeSent && (
          <Stack spacing="3">
            <Alert status="success">
              <AlertIcon />
              Code sent to {phoneNumber}
            </Alert>
            <FormControl>
              <FormLabel htmlFor="code">Enter Code</FormLabel>

              <HStack justify="space-between">
                <PinInput
                  otp
                  isInvalid={invalidCode}
                  onChange={(value) => setCode(value)}
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
          </Stack>
        )}

        <Box id="recaptcha-container" hidden />

        <Stack spacing="6">
          <Button
            variant="primary"
            type="submit"
            isLoading={loading}
            disabled={codeSent ? !displayName || !phoneNumber : code.length < 6}
          >
            {codeSent ? "Create Account " : "Continue"}
          </Button>

          <Text fontSize="xs" color="subtle" textAlign="center">
            By continuing, you acknowledge that you have read, understood, and
            agree to our terms and condition
          </Text>

          {!codeSent && (
            <>
              <Divider />

              <Stack textAlign="center">
                <Text color="muted">Want to sell your dogs?</Text>
                <Button
                  variant="outline"
                  onClick={() => router.push("/signup-breeder")}
                >
                  Sign up as Breeder
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
