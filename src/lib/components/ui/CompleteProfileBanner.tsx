import {
  Box,
  Button,
  CloseButton,
  Container,
  HStack,
  Icon,
  Square,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import * as React from "react";
import { FiUser } from "react-icons/fi";

export const CompleteProfileBanner = () => {
  const router = useRouter();

  return (
    <Box as="section" pb={{ base: "4", md: "6" }}>
      <Box bg="bg-surface">
        <Container py={{ base: "4", md: "4" }} position="relative">
          <CloseButton
            display={{ md: "none" }}
            position="absolute"
            right="2"
            top="2"
          />
          <Stack
            direction={{ base: "column", md: "column" }}
            justify="space-between"
            spacing={{ base: "3", md: "4" }}
          >
            <Stack
              spacing="6"
              direction={{ base: "column", md: "row" }}
              align={{ base: "start", md: "center" }}
            >
              <Stack spacing="2">
                <HStack>
                  <Square size="12" borderRadius="md">
                    <Icon as={FiUser} boxSize="6" color="subtle" />
                  </Square>

                  <Text fontWeight="medium" fontSize="lg">
                    Complete your profile
                  </Text>
                </HStack>
                <Text color="muted" fontSize="sm">
                  Add a profile photo so guys can know you better. You can also
                  list more breeds, upload their photos and update their
                  veterinary information.
                </Text>
              </Stack>
            </Stack>
            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={{ base: "4", md: "8" }}
              align={{ base: "stretch", md: "center" }}
              w="full"
            >
              <Button
                variant="ghost"
                bg="bg-muted"
                width="full"
                onClick={() => router.push("/account/profile")}
              >
                Update Profile
              </Button>

            </Stack>
          </Stack>
        </Container>

      </Box>
    </Box>
  );
};

export default CompleteProfileBanner