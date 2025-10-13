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

export const CtaWithImage = () => {
  return (
    <Box>
      <Container
        py={{
          base: "16",
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
                No credit card is required. You&apos;ll be ready to go within a
                few minutes. Let&apos;s go.
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

<<<<<<< HEAD
  <Button variant="primary" size="lg" as={Link} href="">
    Get the app
=======
              <Button
      variant="primary"
      size="lg"
      as={Link}
      href={user ? "/home" : "/signup"}
    >
      Get Started
>>>>>>> parent of b0357f4 (feat(components): Remove app features)
    </Button>
  </Stack>
          </Stack >
{/* <Image
            width="full"
            height={{
              base: "auto",
              md: "lg",
            }}
<<<<<<< HEAD
            objectFit="contain"
            src="images/mockup.png"
          />
=======
            objectFit="cover"
            src={"images/screenshot.png"}
          /> */}

  < EmbeddedIframe />
>>>>>>> parent of b0357f4 (feat(components): Remove app features)
        </Stack >
      </Container >
    </Box >
  );
};
