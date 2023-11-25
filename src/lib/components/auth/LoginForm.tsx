import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  ButtonGroup,
  Button,
  Box,
  Spacer,
  InputGroup,
  InputLeftAddon,
  HStack,
  useToast,
  Text,
  useBreakpointValue,
  Divider,
  Icon,
} from "@chakra-ui/react";
import type { ConfirmationResult } from "firebase/auth";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { VerifyOTPModal } from "./VerifyOTPModal";

import { auth } from "lib/firebase/client";
import { User } from "lib/models/user";
import { GoogleIcon, TwitterIcon, GitHubIcon } from "./ProviderIcons";
import { BsChevronBarRight, BsChevronRight } from "react-icons/bs";
import { useAuthState } from "react-firebase-hooks/auth";

type PageProps = {};

// eslint-disable-next-line
export const LoginForm = (props: PageProps) => {
  const toast = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [user, loadingUser, error] = useAuthState(auth);
  const [openOTPModal, setOpenOTPModal] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(
    {} as ConfirmationResult
  );
  const [invalidCode, setInvalidCode] = useState(false);
  const [mountRecapture, setMountRecapture] = useState(true);

  const isMobile = useBreakpointValue({
    base: true,
    sm: false,
  });

  const sendVerificationCode = async (event) => {
    event.preventDefault();

    setLoading(true);
    setInvalidCode(false);
    setMountRecapture(false);
    setMountRecapture(true);
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
        `+254${phoneNumber}`,
        appVerifier
      );
      console.log(result);
      if (result) {
        setOpenOTPModal(true);
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

        if (!loading && user) {
          checkIfUserExists();
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setInvalidCode(true);
      setMountRecapture(false);

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

  const checkIfUserExists = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/users/get-user?${new URLSearchParams({
          uid: user.uid,
        })}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("response: ", response);

      if (response.status === 200) {
        router.push("/home");
      } else {
        toast({
          title: "Account created successfully",
          description: "Let's finish creating your your profile",
          status: "success",
        });
        router.push("/signup");
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

  const onInputChange = (value: string) => {
    console.log(value);
    if (value.charAt(0) === "0") {
      return;
    }
    setPhoneNumber(value);
  };

  return (
    <Stack spacing="8">
      <Stack spacing="6">
        <Stack
          spacing="6"
          as="form"
          align="center"
          onSubmit={(event) => sendVerificationCode(event)}
          w="full"
        >
          <FormControl>
            {/* <FormLabel htmlFor="phone">Continue with mobile number</FormLabel> */}

            <InputGroup size="lg">
              <InputLeftAddon>+254</InputLeftAddon>
              <Input
                as="input"
                required
                id="phone"
                name="phone"
                placeholder="e.g 722..."
                type="number"
                onChange={(event) => onInputChange(event?.target.value)}
                pattern="^([7]{1}|[1]{1})[0-9]{8}$"
                maxLength={9}
                value={phoneNumber}
              />
            </InputGroup>
          </FormControl>

          <ButtonGroup w="full">
            {router.pathname.includes("signup") && <Spacer />}
            <Button
              isLoading={loading}
              type="submit"
              size="lg"
              w="full"
              variant="primary"
              isDisabled={phoneNumber.length !== 9}
            >
              <span>Continue with phone</span>
            </Button>
          </ButtonGroup>
        </Stack>

        <VerifyOTPModal
          loading={loading}
          existingUser={user}
          phoneNumber={phoneNumber}
          onSubmit={onVerifyCode}
          setCode={setCode}
          openOTPModal={openOTPModal}
          sendVerificationCode={sendVerificationCode}
        />

        <Box id="recaptcha-container" display="none" />

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

        {router.pathname.includes("signup") && (
          <Text fontSize="xs" color="subtle" textAlign="center">
            By continuing, you acknowledge that you have read, understood, and
            agree to our terms and condition
          </Text>
        )}
      </Stack>
    </Stack>
  );
};
