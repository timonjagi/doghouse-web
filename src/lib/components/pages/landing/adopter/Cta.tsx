import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";

export const Cta = () => {
  return (
    <Box as="section" bg="bg-accent" color="on-accent" w="full">
      <Container py={{ base: '16', md: '24' }}>
        <Stack spacing={{ base: '8', md: '10' }}>
          <Stack spacing={{ base: '4', md: '5' }} align="center">
            <Heading size={useBreakpointValue({ base: 'md', md: 'lg' })}>Are you a Breeder or Shelter?</Heading>
            <Text color="on-accent-muteed" maxW="2xl" textAlign="center" fontSize="xl">
              Join our network of trusted partners. Manage your kennel or shelter efficiently and connect with loving families looking for their next pet.
            </Text>
          </Stack>
          <Stack spacing="3" direction={{ base: 'column', sm: 'row' }} justify="center">
            <Button
              as={Link}
              href="/signup?role=breeder"
              colorScheme="on-accent"
              size="lg"
            >
              Start for Free
            </Button>
            <Button
              as={Link}
              href="/partners"
              variant="brand-on-accent"
              size="lg"
            >
              Learn more
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
