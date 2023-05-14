import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
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
            <Heading size="sm">Ready to start your search?</Heading>
            <Text
              color="muted"
              fontSize={useBreakpointValue({
                base: "lg",
                lg: "xl",
              })}
            >
              Find your perfect match on Doghouse today!
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
              size="lg"
              rounded="full"
              onClick={() => router.push("breeds")}
            >
              Start for Free
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
};
