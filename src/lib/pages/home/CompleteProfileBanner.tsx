import {
  Box,
  Button,
  CloseButton,
  Container,
  Icon,
  Link,
  Square,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { BiCookie } from "react-icons/bi";
import { FiGitlab } from "react-icons/fi";

export const CompleteProfileBanner = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Box as="section" pb={{ base: "4", md: "8" }}>
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
              {!isMobile && (
                <Square size="12" bg="bg-subtle" borderRadius="md">
                  <Icon as={FiGitlab} boxSize="6" />
                </Square>
              )}
              <Stack spacing="0.5" pe={{ base: "4", md: "0" }}>
                <Text fontWeight="semibold" fontSize="lg">
                  Complete Profile
                </Text>
                <Text color="muted">Add you pets, upload photos and more</Text>
              </Stack>
            </Stack>
            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={{ base: "3", md: "2" }}
              align={{ base: "stretch", md: "center" }}
            >
              <Button variant="primary" width="full">
                Add
              </Button>
              <Button variant="secondary" width="full">
                Later
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};
