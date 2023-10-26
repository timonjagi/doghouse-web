import {
  Avatar,
  Box,
  Center,
  DarkMode,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  Icon,
  Input,
  Button,
  Link,
  Modal,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  useBreakpointValue,
  useColorModeValue as mode,
} from "@chakra-ui/react";
// import * as React from "react";
import { NextSeo } from "next-seo";
import { useState } from "react";
import { Logo } from "../../components/Logo";
import { Step } from "../../components/Step";
import { useStep } from "../../components/useStep";
import { useRouter } from "next/router";

import { LocationCheck } from "./00-location-check";
import { HumanProfile } from "./01-human-profile";

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

const Features = () => {
  return (
    <Stack spacing="8">
      <Heading size={useBreakpointValue({ base: "md", lg: "lg" })}>
        Why our service?
      </Heading>

      <Stack spacing="8">
        <HStack>
          <Avatar as={Icon} />

          <Text fontSize="lg" maxW="md" fontWeight="medium">
            Create an account and get connected to our network of reputable
            breeders.
          </Text>
        </HStack>

        <HStack>
          <Avatar as={Icon} />

          <Text fontSize="lg" maxW="md" fontWeight="medium">
            Create an account and get connected to our network of reputable
            breeders.
          </Text>
        </HStack>
        <HStack>
          <Avatar as={Icon} />

          <Text fontSize="lg" maxW="md" fontWeight="medium">
            Create an account and get connected to our network of reputable
            breeders.
          </Text>
        </HStack>
        <HStack>
          <Avatar as={Icon} />

          <Text fontSize="lg" maxW="md" fontWeight="medium">
            Create an account and get connected to our network of reputable
            breeders.
          </Text>
        </HStack>
      </Stack>
    </Stack>
  );
};

const Login = () => {
  const [location, setLocation] = useState("");
  const [modalClosed, setModalClosed] = useState("");
  // const [locationChecked, setLocationChecked] = useState(false);
  const router = useRouter();
  const [existingUser, setExistingUser] = useState({} as User);
  const [loading, setLoading] = useState(false);
  const numberOfSteps = 3;
  const [currentStep, { setStep }] = useStep({
    maxStep: numberOfSteps,
    initialStep: 0,
  });

  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  const onCheckLocation = (event) => {
    // check location
    // navigate to next step if location accepted
    // show error modal if not with option to add phone number to get notified when we expand to the area
    event.preventDefault();
    // setLocationChecked(true);
    setStep(currentStep + 1);
    return false;
  };

  return (
    <Flex
      bgGradient={useBreakpointValue({
        md: mode(
          "linear(to-r, brand.600 50%, white 50%)",
          "linear(to-r, brand.600 50%, gray.900 50%)"
        ),
      })}
      h="100%"
    >
      <NextSeo title="Get Started" />

      <Modal
        isCentered
        isOpen={isMobile && !currentStep && !modalClosed ? true : false}
        onClose={() => {}}
        size="full"
      >
        <ModalOverlay
          marginTop={{ base: "64px", lg: "72px" }}
          bg="none"
          backdropFilter="auto"
          backdropBlur="2px"
          alignItems="center"
          justifyContent="center"
          zIndex={1}
        ></ModalOverlay>

        <ModalContent>
          <DarkMode>
            <ModalBody>
              <Flex align="center" h="full">
                <Features />
              </Flex>
            </ModalBody>
          </DarkMode>

          <ModalFooter>
            <Button
              size="lg"
              variant="primary"
              w="full"
              onClick={() => setModalClosed(true)}
            >
              Get Started
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex maxW="8xl" mx="auto" width="full">
        <Box flex="1" display={{ base: "none", md: "flex" }}>
          <DarkMode>
            <Flex
              direction="column"
              px={{ base: "4", md: "8" }}
              height="full"
              color="on-accent"
            >
              <Flex align="center" h="24">
                <Logo />
              </Flex>

              <Flex
                align="center"
                h="full"
                px={useBreakpointValue({ base: "0", xl: "16" })}
              >
                {!currentStep && <Features />}
              </Flex>

              <Flex align="center" h="24">
                <Text color="on-accent-subtle" fontSize="sm">
                  © 2022 Doghouse Kenya. All rights reserved.
                </Text>
              </Flex>
            </Flex>
          </DarkMode>
        </Box>

        <Flex flex="1" w="full" h="full" align="center" justify="center">
          {isMobile &&
            currentStep &&
            existingUser.uid &&
            !existingUser.customClaims?.isBreeder && (
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

          {!currentStep && (
            <LocationCheck
              currentStep={currentStep}
              loading={loading}
              setStep={setStep}
              setLocation={setLocation}
              onSubmit={onCheckLocation}
            />
          )}

          {currentStep === 1 && (
            <HumanProfile currentStep={currentStep} setStep={setStep} />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Login;
