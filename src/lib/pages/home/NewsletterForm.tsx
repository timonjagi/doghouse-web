import {
  Box,
  Container,
  HStack,
  Icon,
  IconButton,
  Input,
  LightMode,
  Square,
  Stack,
  Text,
} from "@chakra-ui/react";
import * as React from "react";
import { FiArrowRight, FiMail } from "react-icons/fi";

export const NewsletterForm = () => {
  return (
    <Box bg="bg-surface" w="full">
      <Container py={{ base: "4", md: "4" }} position="relative">
        <Stack
          direction={{ base: "column", md: "column" }}
          justify="space-between"
          spacing={{ base: "4", md: "6" }}
        >
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
              />
            </LightMode>
            <IconButton
              aria-label="Subscribe"
              icon={<FiArrowRight />}
              flexShrink={0}
              type="submit"
            ></IconButton>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
};
