import {
  Button,
  Heading,
  Stack,
  Flex,
  Text,
  Image,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
// import type * as React from "react";

import { Step } from "../../components/Step";
import { useStep } from "../../components/useStep";

import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BreederSignUpForm = (props: any) => {
  const router = useRouter();

  const numberOfSteps = 3;
  const [currentStep, { setStep }] = useStep({
    maxStep: numberOfSteps,
    initialStep: 0,
  });

  return (
    <Stack spacing="8" {...props}>
      <Stack spacing="6" align="center">
        <Flex justify="center" as="a" href="/">
          <Image src="images/doghouse.png" width="200px" height="200px" />
        </Flex>
      </Stack>

      <Stack spacing="5" mt="0px !important">
        <Stack spacing="3" textAlign="center">
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

        {currentStep === 0 && (
          <Step1 currentStep={currentStep} setStep={setStep} />
        )}

        {currentStep === 1 && (
          <Step2 currentStep={currentStep} setStep={setStep} />
        )}

        {currentStep === 2 && (
          <Step3 currentStep={currentStep} setStep={setStep} />
        )}

        {currentStep === 0 && (
          <Text fontSize="xs" color="subtle" textAlign="center">
            By continuing, you acknowledge that you have read, understood, and
            agree to our terms and condition
          </Text>
        )}
      </Stack>
    </Stack>
  );
};
