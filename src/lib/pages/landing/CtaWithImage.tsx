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
import Link from "next/link";
import * as React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const EmbeddedIframe = () => {
  const containerStyle: React.CSSProperties = {
    position: "relative",
    paddingBottom: "calc(82.39293139293139% + 42px)",
    height: 0,
  };

  const iframeStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  };

  return (
    <div style={containerStyle}>
      <iframe
        src="https://app.supademo.com/embed/WqOLGJBXHR2ee58zs_mer"
        allow="clipboard-write"
        frameBorder="0"
        style={iframeStyle}
      ></iframe>
    </div>
  );
};

export default EmbeddedIframe;

export const CtaWithImage = () => {

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
                href={""}
              >
                Get the app
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
