import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  Alert,
  AlertIcon,
  ButtonGroup,
  Button,
  Box,
  Spacer,
  InputGroup,
  InputLeftAddon,
  HStack,
  PinInput,
  PinInputField,
  useToast,
  Text,
} from "@chakra-ui/react";
import type { ConfirmationResult } from "firebase/auth";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useRouter } from "next/router";
import { useState } from "react";

import { auth } from "lib/firebase/client";

type PageProps = {
  currentStep: number;
  // eslint-disable-next-line
  setStep: any;
  // eslint-disable-next-line
  existingUser: any;
  // eslint-disable-next-line
  setExistingUser: any;
  // eslint-disable-next-line
  setCodeVerified: any;
  loading: boolean;
  // eslint-disable-next-line
  setLoading: any;
  // eslint-disable-next-line
  setCodeSent: any;
  codeSent: boolean;
};

// eslint-disable-next-line
export const Step1 = ({
  currentStep,
  setStep,
  existingUser,
  setExistingUser,
  setCodeVerified,
  loading,
  setLoading,
  setCodeSent,
  codeSent,
}: PageProps) => {
  const toast = useToast();
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(
    {} as ConfirmationResult
  );
  const [invalidCode, setInvalidCode] = useState(false);

  // eslint-disable-next-line
  // const [updateProfile, updating, error] = useUpdateProfile(auth);
  // const [displayName, setDisplayName] = useState("");

  // eslint-disable-next-line

  // const createUserDocument = async (uid: string) => {
  //   try {
  //     const { currentUser } = auth;
  //     if (currentUser) {
  //       const userPayload = JSON.parse(JSON.stringify(currentUser));
  //       delete userPayload.stsTokenManager;
  //       await setDoc(doc(fireStore, "users", uid), userPayload);
  //     }
  //     // eslint-disable-next-line
  //   } catch (err: any) {
  //     toast({
  //       title: err.message,
  //       status: "error",
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //   }

  //   setLoading(false);
  // };

  const assignBreederRole = async (uid: string) => {
    try {
      const response = await fetch("/api/set-custom-claims", {
        method: "POST",
        body: JSON.stringify({ uid, isBreeder: true }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        // await createUserDocument(uid);
        setStep(currentStep + 1);
      }
      // eslint-disable-next-line
    } catch (err: any) {
      toast({
        title: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      setLoading(false);
    }
  };

  const sendVerificationCode = async () => {
    setLoading(true);
    setInvalidCode(false);
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
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      appVerifier.clear();
    }

    setLoading(false);
  };

  // eslint-disable-next-line
  const onVerifyCode = async (event: any) => {
    event.preventDefault();

    try {
      if (code.length !== 6) {
        const error = new Error("Invalid Code");
        error.name = "Please enter a valid 6-digit code";
        throw error;
      }

      setLoading(true);
      const result = await confirmationResult.confirm(code);
      if (result) {
        setCodeVerified(true);
        if (existingUser.uid) {
          if (
            existingUser.customClaims &&
            existingUser.customClaims.isBreeder
          ) {
            await router.push("/dashboard");
            toast({
              title: "Logged in successfully",
              duration: 2000,
              status: "success",
            });
          } else {
            assignBreederRole(existingUser.uid);
          }
        } else {
          await assignBreederRole(result.user.uid);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setInvalidCode(true);
      event.target.reset();
      toast({
        title:
          err.code === "auth/invalid-verification-code"
            ? "Invalid Code"
            : err.message,
        description:
          err.code === "auth/invalid-verification-code"
            ? "Please try again or try resending code"
            : err.name,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  const checkIfUserExists = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        `/api/get-user?${new URLSearchParams({ phoneNumber })}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        await sendVerificationCode();
        const { user } = await response.json();
        setExistingUser(user);
      } else {
        await sendVerificationCode();
      }

      // eslint-disable-next-line
    } catch (err: any) {
      toast({
        title: err.message,
        status: "error",
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <Stack spacing="9">
      {!codeSent && (
        <Stack spacing="6" as="form" onSubmit={checkIfUserExists}>
          {/* <FormControl id="name">
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              required
              id="name"
              name="name"
              type="text"
              disabled={codeSent}
              placeholder="Enter your name"
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </FormControl> */}

          <FormControl>
            <FormLabel htmlFor="phone">Mobile number</FormLabel>

            <InputGroup>
              <InputLeftAddon>+254</InputLeftAddon>
              <Input
                as="input"
                required
                id="phone"
                name="phone"
                placeholder="Enter you mobile number"
                type="tel"
                disabled={codeSent}
                onChange={(event) =>
                  setPhoneNumber(`+254${event?.target.value}`)
                }
                pattern="^([7]{1}|[1]{1})[0-9]{8}$"
                maxLength={9}
              />
            </InputGroup>
          </FormControl>

          <Text fontSize="xs" color="subtle" textAlign="center">
            By continuing, you acknowledge that you have read, understood, and
            agree to our terms and condition
          </Text>

          <ButtonGroup width="100%">
            <Spacer />
            <Button
              isLoading={loading}
              type="submit"
              isDisabled={currentStep >= 3}
              variant="primary"
            >
              Next
            </Button>
          </ButtonGroup>
        </Stack>
      )}

      {codeSent && (
        <Stack spacing="5" as="form" onSubmit={onVerifyCode}>
          {!loading && !invalidCode && (
            <Alert status="success">
              <AlertIcon />
              <Text fontSize="sm">One-time password sent to {phoneNumber}</Text>
            </Alert>
          )}
          <FormControl>
            {/* <FormLabel htmlFor="code">Enter OTP Code</FormLabel> */}
            <HStack justify="space-between">
              <PinInput otp onChange={(value) => setCode(value)}>
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          </FormControl>

          {(!existingUser || !existingUser.customClaims?.isBreeder) && (
            <ButtonGroup width="100%">
              <Spacer />
              <Button
                isLoading={loading}
                type="submit"
                isDisabled={currentStep >= 3}
                variant="primary"
              >
                Next
              </Button>
            </ButtonGroup>
          )}

          {existingUser && existingUser.customClaims?.isBreeder && (
            <Button
              variant="primary"
              type="submit"
              isLoading={loading}
              loadingText="Logging you in..."
              spinnerPlacement="end"
            >
              Continue to Dashboard
            </Button>
          )}

          <HStack spacing="1" justify="center">
            <Text fontSize="sm" color="muted">
              Did&apos;t get a code?
            </Text>
            <Button
              size="sm"
              variant="link"
              colorScheme="brand"
              onClick={sendVerificationCode}
            >
              Resend
            </Button>
          </HStack>
        </Stack>
      )}

      <Box id="recaptcha-container" hidden />
    </Stack>
  );
};
