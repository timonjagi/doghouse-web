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
    <Box as="section" bg="bg-accent" color="on-accent" w="full">
      <Container py={{ base: '16', md: '24' }}>
        <Stack spacing={{ base: '8', md: '10' }}>
          <Stack spacing={{ base: '4', md: '5' }} align="center">
            <Heading size={useBreakpointValue({ base: 'md', md: 'lg' })}>Ready to Start your Journey?</Heading>
            <Text color="on-accent-muteed" maxW="2xl" textAlign="center" fontSize="xl">
              No credit card is required. You&apos;ll be ready to go within a
              few minutes. Let&apos;s go.
            </Text>
          </Stack>
          <Stack spacing="3" direction={{ base: 'column', sm: 'row' }} justify="center">
            <Button colorScheme="brand"
              size="lg">
              Get Started
            </Button>
            <Button variant="brand-on-accent" size="lg">
              Learn more
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
