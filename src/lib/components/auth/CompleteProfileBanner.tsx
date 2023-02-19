import {
  Box,
  Button,
  CloseButton,
  Container,
  Icon,
  Link,
  Square,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
// import * as React from "react";
import { BiCookie } from "react-icons/bi";

export const CompleteProfileBanner = () => {
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });
  return (
    <Box bg="bg-surface" boxShadow={useColorModeValue("sm", "sm-dark")}>
      <Container
        py={{
          base: "4",
          md: "2.5",
        }}
        position="relative"
      >
        <CloseButton
          display={{
            md: "none",
          }}
          position="absolute"
          right="2"
          top="2"
        />
        <Stack
          direction={{
            base: "column",
            md: "row",
          }}
          justify="space-between"
          spacing={{
            base: "3",
            md: "2",
          }}
        >
          <Stack
            spacing="4"
            direction={{
              base: "column",
              md: "row",
            }}
            align={{
              base: "start",
              md: "center",
            }}
          >
            {!isMobile && (
              <Square size="12" bg="bg-subtle" borderRadius="md">
                <Icon as={BiCookie} boxSize="6" />
              </Square>
            )}
            <Stack
              spacing="0.5"
              pe={{
                base: "4",
                md: "0",
              }}
            >
              <Text fontWeight="medium">
                We use our own and third-party cookies to personalize content.
              </Text>
              <Text color="muted">
                Read our <Link>Cookie Policy</Link>
              </Text>
            </Stack>
          </Stack>
          <Stack
            direction={{
              base: "column",
              sm: "row",
            }}
            spacing={{
              base: "3",
              md: "2",
            }}
            align={{
              base: "stretch",
              md: "center",
            }}
          >
            <Button variant="secondary" width="full">
              Reject
            </Button>
            <Button variant="primary" width="full">
              Allow
            </Button>
            <CloseButton
              display={{
                base: "none",
                md: "inline-flex",
              }}
            />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
