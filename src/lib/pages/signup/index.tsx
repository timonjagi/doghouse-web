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
  useToast,
} from "@chakra-ui/react";
// import * as React from "react";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import { Logo } from "../../components/nav/Logo";
import { Step } from "../../components/Step";
import { useStep } from "../../components/useStep";
import { useRouter } from "next/router";

import { LocationCheck } from "./LocationCheck";
import { LoginForm } from "../../components/auth/LoginForm";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "lib/firebase/client";

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

const SignUp = () => {
  const [location, setLocation] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const [user, loading] = useAuthState(auth);

  const numberOfSteps = 3;
  const [currentStep, { setStep }] = useStep({
    maxStep: numberOfSteps,
    initialStep: 0,
  });

  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  const toast = useToast();

  useEffect(() => {
    setModalOpen(isMobile);
  }, [user, loading]);

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
        isOpen={isMobile && !currentStep && modalOpen ? true : false}
        onClose={() => {}}
        size="sm"
      >
        <ModalOverlay></ModalOverlay>

        <ModalContent>
          <DarkMode>
            <ModalBody>
              <Flex align="center" h="full" pt="8" px="2">
                <Features />
              </Flex>
            </ModalBody>
          </DarkMode>

          <ModalFooter>
            <Button
              size="lg"
              variant="primary"
              w="full"
              onClick={() => setModalOpen(false)}
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

        <Flex
          flex="1"
          w="full"
          h="full"
          align="center"
          justify="center"
          direction="column"
        >
          {!location && (
            <LocationCheck
              loading={loading}
              location={location}
              setLocation={setLocation}
            />
          )}

          {isMobile && currentStep && (
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

          {location && !user?.uid && (
            <Stack
              spacing={{ base: "6", md: "9" }}
              textAlign="center"
              px={{ base: "8", lg: "16", xl: "32" }}
            >
              <Heading size="lg">
                Good news! We care for pets in {location}. Let's create your
                account.
              </Heading>

              <LoginForm />

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
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SignUp;
