import {
  Stack,
  Img,
  Box,
  Heading,
  Button,
  Text,
  ButtonGroup,
  Flex,
} from "@chakra-ui/react";
import React from "react";

type WelcomeProps = {
  setShowOnboardingSteps: any;
};

const Welcome: React.FC<WelcomeProps> = ({ setShowOnboardingSteps }) => {
  return (
    <Box>
      <Stack
        direction="column"
        mt="16"
        justifyContent="center"
        justify="center"
        spacing={{ base: 6, md: 9 }}
        px={{ base: "6", sm: "8", lg: "16" }}
        py={{ base: "6", md: "8", lg: "16" }}
        align="center"
      >
        <Box position="relative" mx="auto">
          <Img
            src="images/logo.png"
            alt="Main Image"
            w="150"
            h="150"
            borderRadius="0.5rem 0.5rem 0 0"
            objectFit="cover"
            objectPosition="90% center"
          />
        </Box>

        <Stack mx="auto" textAlign="center">
          <Heading size="md" letterSpacing="tight">
            Welcome to Doghouse
          </Heading>
          <Text color="muted">
            Discover your ideal furry companion and start a journey of love and
            companionship.
          </Text>
        </Stack>

        <ButtonGroup w="full">
          <Button
            type="submit"
            size="lg"
            w="full"
            variant="primary"
            onClick={() => setShowOnboardingSteps(true)}
          >
            <span>Get Started</span>
          </Button>
        </ButtonGroup>
      </Stack>
    </Box>
  );
};
export default Welcome;
