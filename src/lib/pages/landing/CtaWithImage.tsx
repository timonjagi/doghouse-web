import {
  Box,
  Button,
  Container,
  Heading,
  Image,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { auth } from "lib/firebase/client";
import Link from "next/link";
import * as React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export const CtaWithImage = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [user, loading, error] = useAuthState(auth);

  return (
    <Box bg="bg-surface">
      <Container
        py={{
          base: "16",
          md: "24",
        }}
      >
        <Stack
          direction={{
            base: "column",
            md: "row",
          }}
          spacing={{
            base: "12",
            lg: "16",
          }}
        >
          <Stack
            spacing={{
              base: "8",
              md: "10",
            }}
            width="full"
            justify="center"
          >
            <Stack
              spacing={{
                base: "4",
                md: "6",
              }}
            >
              <Heading
                size={useBreakpointValue({
                  base: "sm",
                  md: "lg",
                })}
              >
                Ready to start your journey?
              </Heading>
              <Text
                fontSize={{
                  base: "lg",
                  md: "xl",
                }}
                color="muted"
              >
                No credit card is required. You'll be ready to go within a few
                minutes. Let's go.
              </Text>
            </Stack>
            <Stack
              direction={{
                base: "column-reverse",
                md: "row",
              }}
              spacing="3"
            >
              <Button variant="secondary" size="lg">
                Learn more
              </Button>

              <Button
                variant="primary"
                size="lg"
                as={Link}
                href={user ? "/home" : "/signup"}
              >
                Get Started
              </Button>
            </Stack>
          </Stack>
          <Image
            width="full"
            height={{
              base: "auto",
              md: "lg",
            }}
            objectFit="cover"
            src={"images/screenshot.png"}
          />
        </Stack>
      </Container>
    </Box>
  );
};
