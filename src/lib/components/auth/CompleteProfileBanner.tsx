import {
  Box,
  Button,
  Container,
  Icon,
  Square,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { CgProfile } from "react-icons/cg";

export const CompleteProfileBanner = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Container
      as="section"
      pt={{ base: "4", md: "8" }}
      pb={{ base: "12", md: "24" }}
    >
      <Box
        bg="bg-surface"
        px={{ base: "4", md: "3" }}
        py={{ base: "4", md: "2.5" }}
        position="relative"
        boxShadow={useColorModeValue("sm", "sm-dark")}
        borderRadius="xl"
      >
        {/* <CloseButton
          display={{ md: "none" }}
          position="absolute"
          right="2"
          top="2"
        /> */}
        <Stack
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          spacing={{ base: "3", md: "2" }}
        >
          <Stack
            spacing="4"
            direction={{ base: "column", md: "row" }}
            align={{ base: "start", md: "center" }}
          >
            {!isMobile && (
              <Square size="12" bg="bg-subtle" borderRadius="md">
                <Icon as={CgProfile} boxSize="6" />
              </Square>
            )}
            <Stack spacing="0.5" pe={{ base: "4", md: "0" }}>
              <Text fontWeight="medium">You're almost there </Text>
              <Text color="muted">
                Fill in some more information about yourself to get started
              </Text>
            </Stack>
          </Stack>
          <Stack
            direction={{ base: "column", sm: "row" }}
            spacing={{ base: "3", md: "2" }}
            align={{ base: "stretch", md: "center" }}
          >
            {/* <Button variant="secondary" width="full">
              Reject
            </Button> */}
            <Button variant="primary" width="full">
              Update Profile
            </Button>
            {/* <CloseButton display={{ base: 'none', md: 'inline-flex' }} /> */}
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
};
