import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";

export const Cta = () => {
  return (
    <Box as="section">
      <Container py={{ base: "8", md: "16" }}>
        <Stack spacing={{ base: "8", md: "10" }}>
          <Stack spacing={{ base: "4", md: "5" }} align="center">
            <Heading size={useBreakpointValue({ base: "sm", md: "md" })}>
              Is Your Home Pet-Ready?
            </Heading>
            <Text color="muted" maxW="2xl" textAlign="center" fontSize="xl">
              Take our Ethical Adoption Questionnaire to ensure you&apos;re
              prepared for the joy, commitment, and love a furry friend brings.
            </Text>
          </Stack>
          <Stack
            spacing="3"
            direction={{ base: "column", sm: "row" }}
            justify="center"
          >
            <Button variant="primary" size="lg">
              Take the Quiz
            </Button>
            <Button variant="secondary" size="lg">
              Learn more
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
