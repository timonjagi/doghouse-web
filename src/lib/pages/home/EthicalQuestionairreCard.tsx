import {
  Container,
  Stack,
  Heading,
  useBreakpointValue,
  Button,
  Text,
  Box,
  DarkMode,
} from "@chakra-ui/react";
import React from "react";

type CompleteProfileCTAProps = {};

const EthicalQuestionairreCard: React.FC<CompleteProfileCTAProps> = () => {
  return (
    <Box as="section" bg="bg-surface">
      <Container
        py={{
          base: "8",
          md: "16",
        }}
      >
        <Stack
          spacing={{
            base: "8",
            md: "10",
          }}
        >
          <Stack
            spacing={{
              base: "4",
              md: "5",
            }}
            align="center"
            textAlign="center"
          >
            <Heading
              size={useBreakpointValue({
                base: "sm",
                md: "md",
              })}
            >
              Is Your Home Pet-Ready?
            </Heading>
            <Text color="muted" maxW="2xl" fontSize="xl">
              Take our Ethical Adoption Questionnaire to ensure you're prepared
              for the joy, commitment, and love a furry friend brings.
            </Text>
          </Stack>
          <Stack
            spacing="3"
            direction={{
              base: "column",
              sm: "row",
            }}
            justify="center"
          >
            <Button variant="secondary" size="lg">
              Learn more
            </Button>
            <Button variant="primary" size="lg">
              Start Quiz
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
export default EthicalQuestionairreCard;
