import {
  Box,
  Button,
  CloseButton,
  Container,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";
import * as React from "react";
import { FiArrowRight } from "react-icons/fi";

export const CompleteProfileBanner = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Box as="section" pb={{ base: "4", md: "6" }}>
      <Box bg="bg-surface">
        <Container py={{ base: "4", md: "8" }} position="relative">
          <CloseButton
            display={{ md: "none" }}
            position="absolute"
            right="2"
            top="2"
          />
          <Stack
            direction={{ base: "column", md: "column" }}
            justify="space-between"
            spacing={{ base: "3", md: "6" }}
          >
            <Stack
              spacing="6"
              direction={{ base: "column", md: "row" }}
              align={{ base: "start", md: "center" }}
            >
              <Stack spacing="0.5" pe={{ base: "4", md: "0" }}>
                <Text fontWeight="medium" fontSize="lg">
                  Complete Your Profile
                </Text>
                <Text color="muted" fontSize="sm">
                  You can add more of your pets, upload their photos and update
                  their veterinary information
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
                variant="primary"
                width="full"
                size="sm"
                as={Link}
                href="/accounts/pets"
              >
                Add a Pet
              </Button>

              <Button
                variant="ghost"
                width="full"
                rightIcon={<FiArrowRight />}
                as={Link}
                href="/account/profile"
                size="sm"
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
