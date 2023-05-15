import {
  Button,
  Heading,
  Stack,
  Flex,
  Text,
  Image,
  HStack,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { Step } from "../../components/Step";
import { useStep } from "../../components/useStep";

import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";

type User = {
  // eslint-disable-next-line
  customClaims: any;
  disabled: boolean;
  displayName: string;
  emailVerified: boolean;
  // eslint-disable-next-line
  metadata: any;
  phoneNumber: string;
  // eslint-disable-next-line
  providerData: any;
  uid: string;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BreederSignUpForm = (props: any) => {
  const router = useRouter();
  const [existingUser, setExistingUser] = useState({} as User);
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const numberOfSteps = 3;
  const [currentStep, { setStep }] = useStep({
    maxStep: numberOfSteps,
    initialStep: 0,
  });

  return (
    <Stack spacing="5" {...props}>
      <Flex justify="center" as="a" href="/">
        <Image src="images/logo.png" height="100px" />
      </Flex>

      {!existingUser.uid && (
        <Stack spacing="1" textAlign="center">
          <Heading size="sm">Sign up as breeder</Heading>
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
      )}

      {existingUser.uid && (
        <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
          {!codeVerified && (
            <Stack spacing="1" textAlign="center">
              <Heading size="sm">Hi, {existingUser.displayName}</Heading>
              {existingUser.customClaims?.isBreeder && (
                <Text color="muted" fontSize="sm">
                  Welcome back! Login to your account to continue
                </Text>
              )}
              {!existingUser.customClaims?.isBreeder && (
                <Text color="muted">
                  Let&apos;s create your breeder account
                </Text>
              )}
            </Stack>
          )}
        </Stack>
      )}
      {(!existingUser || !existingUser.customClaims?.isBreeder) && (
        <HStack spacing="0" justify="space-evenly" flex="1">
          {[...Array(numberOfSteps)].map((_, id) => (
            <Step
              // eslint-disable-next-line
              key={id}
              cursor="pointer"
              isActive={currentStep === id}
              isCompleted={currentStep > id}
              isLastStep={numberOfSteps === id + 1}
            />
          ))}
        </HStack>
      )}
      {currentStep === 0 && (
        <Step1
          currentStep={currentStep}
          setStep={setStep}
          existingUser={existingUser}
          setExistingUser={setExistingUser}
          setCodeSent={setCodeSent}
          codeSent={codeSent}
          setCodeVerified={setCodeVerified}
          loading={loading}
          setLoading={setLoading}
        />
      )}
      {currentStep === 1 && (
        <Step2
          currentStep={currentStep}
          setStep={setStep}
          setCodeSent={setCodeSent}
        />
      )}
      {currentStep === 2 && (
        <Step3 currentStep={currentStep} setStep={setStep} />
      )}
      {currentStep === 3 && (
        <Stack spacing="5">
          <Alert
            status="success"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              You&apos;re all set!
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Thanks for creating your account. Now you are ready to start
              posting offers
            </AlertDescription>
          </Alert>
          <Button as={Link} href="/dashboard" variant="primary">
            Continue to Dashboard
          </Button>
        </Stack>
      )}
      {currentStep === 0 && !codeSent && (
        <Text fontSize="xs" color="subtle" textAlign="center">
          By continuing, you acknowledge that you have read, understood, and
          agree to our terms and condition
        </Text>
      )}
    </Stack>
  );
};
