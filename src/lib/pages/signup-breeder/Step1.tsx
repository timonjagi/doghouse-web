import {
  useToast,
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
} from "@chakra-ui/react";
import type { ConfirmationResult } from "firebase/auth";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useState } from "react";
import { useUpdateProfile } from "react-firebase-hooks/auth";

import { auth } from "lib/firebase/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Step1 = ({ currentStep, setStep }: any) => {
  const toast = useToast();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(
    {} as ConfirmationResult
  );
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line
  const [updateProfile, updating, error] = useUpdateProfile(auth);
  const [displayName, setDisplayName] = useState("");

  const [invalidCode, setInvalidCode] = useState(false);

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

  const completeProfile = async (uid: string) => {
    try {
      await updateProfile({ displayName });

      const response = await fetch("/api/set-custom-claims", {
        method: "POST",
        body: JSON.stringify({ uid, isBreeder: true }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        // await createUserDocument(uid);
        setStep(currentStep + 1);
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
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      setLoading(false);
    }
  };

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
      const response = await fetch("/api/get-user", {
        method: "POST",
        body: JSON.stringify({ phoneNumber }),
        headers: { "Content-Type": "application/json" },
      });

      setLoading(true);

      if (response.status === 200) {
        sendVerificationCode();
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

  return (
    <Stack
      as="form"
      spacing="5"
      mt="5"
      onSubmit={codeSent ? onVerifyCode : checkIfUserExists}
    >
      {!codeSent && (
        <Stack spacing="3">
          <FormControl id="name">
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
            <FormLabel htmlFor="code">Code</FormLabel>
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

      <ButtonGroup width="100%">
        <Button
          onClick={() => setStep(currentStep - 1)}
          isDisabled={currentStep === 0}
          variant="ghost"
        >
          Back
        </Button>
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
  );
};
