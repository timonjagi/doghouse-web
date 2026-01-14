import React from "react";
import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  VStack,
  SimpleGrid,
  useBreakpointValue,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { SupportFAQ } from "./SupportFAQ";
import { useFeaturedFAQs } from "../../hooks/queries/useSupportFAQs";

interface LandingFAQsProps {
  title?: string;
  description?: string;
}

export const LandingFAQs: React.FC<LandingFAQsProps> = ({
  title = "Frequently Asked Questions",
  description = "Find answers to common questions about using Pethouse Kenya.",
}) => {
  const { data: faqs = [], isLoading } = useFeaturedFAQs(4);

  if (!isLoading && faqs.length === 0) return null;

  return (
    <Box as="section" py={{ base: "16", md: "24" }} bg={mode("gray.50", "gray.900")}>
      <Container maxW="7xl">
        <Stack spacing={{ base: "12", md: "16" }}>
          <Stack spacing="4" textAlign="center">
            <Heading
              size={useBreakpointValue({
                base: "sm",
                lg: "md",
              })}
            >
              {title}
            </Heading>
            <Text
              fontSize={{
                base: "lg",
                md: "xl",
              }}
              color="muted"
              maxW="2xl"
              mx="auto"
            >
              {description}
            </Text>
          </Stack>
          <VStack spacing={4} align="stretch">
            <SimpleGrid columns={{ base: 1 }} spacing={4}>
              {faqs.map((faq) => (
                <SupportFAQ
                  key={faq.id}
                  faq={faq}
                  showCategory={true}
                  showVotes={false}
                  showViewCount={false}
                />
              ))}
            </SimpleGrid>
          </VStack>
        </Stack>
      </Container>
    </Box>
  );
};
