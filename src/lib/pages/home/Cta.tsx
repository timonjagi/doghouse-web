import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
// import * as React from "react";

export const Cta = () => {
  const router = useRouter();

  return (
    <Container
      py={{
        base: "16",
        md: "24",
      }}
    >
      <Box
        bg="bg-surface"
        boxShadow={useColorModeValue("sm", "sm-dark")}
        borderRadius="xl"
        px={{
          base: "6",
          lg: "16",
        }}
        py={{
          base: "10",
          lg: "16",
        }}
      >
        <Stack
          spacing="8"
          direction={{
            base: "column",
            lg: "row",
          }}
          justify="space-between"
        >
          <Stack spacing="4" maxW="2xl">
            <Heading size="sm">We're getting ready to launch soon!</Heading>
            <Text
              color="muted"
              fontSize={useBreakpointValue({
                base: "lg",
                lg: "xl",
              })}
            >
              Be among the first to experience the future of responsible pet
              adoption and ethical breeding. Join our waitlist and stay informed
              about our latest updates, early access opportunities, and
              exclusive benefits.
            </Text>
          </Stack>
          <Stack
            spacing="3"
            direction={{
              base: "column",
              sm: "row",
            }}
            justify={{
              base: "start",
            }}
          >
            {/* <Button variant="secondary" size="lg" rounded="full">
            Learn more
          </Button> */}
            <Button
              variant="primary"
              color="brand.500"
              backgroundColor="brand.500"
              colorScheme="brand"
              size="lg"
              rounded="full"
              as={Link}
              href="/waitlist"
            >
              <Text color="white"> Join the waitlist</Text>
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
};
