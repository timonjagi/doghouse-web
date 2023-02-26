import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "lib/firebase/client";
// import * as React from "react";

export const CompleteProfileModal = () => {
  const [isOpen, setIsOpen] = useState(true);

  const [user] = useAuthState(auth);

  const assignBreederRole = async (role: "client" | "breeder") => {
    try {
      const customClaims = {
        role,
      };
      await user.setCustomUserClaims(customClaims);
    } catch (error) {
      console.error("Error setting custom claims: ", error);
    }
  };

  return (
    <Box height="100vh">
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="full">
        <ModalOverlay />
        <ModalContent borderRadius="none" mx="4">
          <ModalCloseButton size="lg" />
          <ModalBody padding="0">
            <Flex
              direction="column"
              align="center"
              flex="1"
              py="12"
              px={{ base: "4", md: "6" }}
            >
              <Box maxW="sm" mx="auto">
                <Flex justify="center">
                  <Image
                    src="images/doghouse.png"
                    width="200px"
                    height="200px"
                  />
                </Flex>
                <Box
                  textAlign="center"
                  maxW={{ base: "2xs", sm: "xs" }}
                  mx="auto"
                >
                  <Heading size="sm" fontWeight="bold">
                    Welcome to Doghouse, {user && user.displayName}
                  </Heading>
                  <Text fontSize="lg" mt="2">
                    Tell us your name so we can get to know you better
                  </Text>
                </Box>
                <Stack spacing="4" mt="8">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={false}
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="lg"
                    isLoading={false}
                  >
                    Continue as breeder
                  </Button>
                </Stack>
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
