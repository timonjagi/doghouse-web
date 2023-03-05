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
import {
  collection,
  query,
  where,
  getCountFromServer,
  setDoc,
  doc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthState, useUpdateProfile } from "react-firebase-hooks/auth";

import { auth, fireStore } from "lib/firebase/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Step1 = ({ currentStep, setStep }: any) => {
  const toast = useToast();
  const router = useRouter();
  const [user] = useAuthState(auth);

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
        body: JSON.stringify({ uid, isBreeder: true }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        await createUserDocument(uid);
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
      setLoading(false);
    }
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
    <Stack
      as="form"
      spacing="5"
      mt="5"
      onSubmit={codeSent ? onVerifyCode : onSendCode}
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
