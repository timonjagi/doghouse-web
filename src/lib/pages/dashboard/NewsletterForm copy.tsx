import {
  Box,
  Button,
  CloseButton,
  Container,
  HStack,
  Icon,
  IconButton,
  Input,
  LightMode,
  Square,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import * as React from "react";
import { FiArrowRight, FiMail } from "react-icons/fi";

export const NewsletterForm = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Box bg="bg-surface" w="full">
      <Container py={{ base: "4", md: "8" }} position="relative">
        <Stack
          direction={{ base: "column", md: "column" }}
          justify="space-between"
          spacing={{ base: "4", md: "8" }}
        >
          {/* <Stack
            spacing="4"
            direction={{ base: "column", md: "column" }}
            align={{ base: "start", md: "center" }}
          >
            <HStack>
              <Square size="12" borderRadius="md">
                <Icon as={FiMail} boxSize="6" color="subtle" />
              </Square>

              <Text fontWeight="medium">Subscribe to our newsletter</Text>
            </HStack>

            <Stack spacing="0.5" pe={{ base: "4", sm: "0" }}>
              <Text color="on-accent-muted" fontSize="sm">
                This way you'll be the first to know when we launch.
              </Text>
            </Stack>
          </Stack> */}

          <Stack
            spacing="6"
            direction={{ base: "column", md: "row" }}
            align={{ base: "start", md: "center" }}
          >
            <Stack spacing="0.5" pe={{ base: "4", md: "0" }}>
              <HStack>
                <Square size="12" borderRadius="md">
                  <Icon as={FiMail} boxSize="6" color="subtle" />
                </Square>

                <Text fontWeight="medium" fontSize="lg">
                  Subscribe to our newsletter
                </Text>
              </HStack>
              <Text color="muted" fontSize="sm">
                You can add more of your pets, upload their photos and update
                their veterinary information
              </Text>
            </Stack>
          </Stack>
          <HStack
            as="form"
            onSubmit={(e) => e.preventDefault()}
            direction={{ base: "column", sm: "column" }}
            spacing={{ base: "3", md: "2" }}
            align={{ base: "stretch" }}
            w="full"
          >
            <LightMode>
              <Input
                placeholder="Enter your email"
                type="email"
                isRequired
                variant="outline-on-accent"
                colorScheme="brand"
                size="sm"
              />
            </LightMode>
            <IconButton
              aria-label="Subscribe"
              icon={<FiArrowRight />}
              flexShrink={0}
              type="submit"
              size="sm"
            ></IconButton>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
};
