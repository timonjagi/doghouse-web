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
    <Box as="section">
      <Container py={{ base: "8", md: "16" }}>
        <Stack spacing={{ base: "8", md: "10" }}>
          <Stack spacing={{ base: "4", md: "5" }} align="center">
            <Heading size={useBreakpointValue({ base: "sm", md: "md" })}>
              Is Your Home Pet-Ready?
            </Heading>
            <Text color="muted" maxW="2xl" textAlign="center" fontSize="xl">
              Take our Ethical Adoption Questionnaire to ensure you're prepared
              for the joy, commitment, and love a furry friend brings.
            </Text>
          </Stack>
          <Stack
            spacing="3"
            direction={{ base: "column", sm: "row" }}
            justify="center"
          >
            <Button variant="primary" size="lg">
              Take the Quiz
            </Button>
            <Button variant="secondary" size="lg">
              Learn more
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
  // return (
  //   <Box as="section" bg="bg-accent" color="on-accent" w="full">
  //     <Container py={{ base: "16", md: "24" }}>
  //       <Stack spacing={{ base: "8", md: "10" }}>
  //         <Stack spacing={{ base: "4", md: "5" }} align="center">
  //           <Heading size={useBreakpointValue({ base: "sm", md: "md" })}>
  //             Is Your Home Pet-Ready?
  //           </Heading>
  //           <Text
  //             color="on-accent-muteed"
  //             maxW="2xl"
  //             textAlign="center"
  //             fontSize="xl"
  //           >
  //             Take our Ethical Adoption Questionnaire to ensure you're prepared
  //             for the joy, commitment, and love a furry friend brings.
  //           </Text>
  //         </Stack>
  //         <Stack
  //           spacing="3"
  //           direction={{ base: "column", sm: "row" }}
  //           justify="center"
  //         >
  //           <Button variant="secondary-on-accent" size="lg">
  //             Learn more
  //           </Button>
  //           <Button
  //             size="lg"
  //             variant="primary"
  //             color="brand.500"
  //             backgroundColor="brand.500"
  //             colorScheme="brand"
  //           >
  //             <Text color="white">Take the Quiz</Text>
  //           </Button>
  //         </Stack>
  //       </Stack>
  //     </Container>
  //   </Box>
  // );
  // return (
  //   <Container
  //     py={{
  //       base: "16",
  //       md: "24",
  //     }}
  //   >
  //     <Box
  //       bg="bg-surface"
  //       boxShadow={useColorModeValue("sm", "sm-dark")}
  //       borderRadius="xl"
  //       px={{
  //         base: "6",
  //         lg: "16",
  //       }}
  //       py={{
  //         base: "10",
  //         lg: "16",
  //       }}
  //     >
  //       <Stack
  //         spacing="8"
  //         direction={{
  //           base: "column",
  //           lg: "row",
  //         }}
  //         justify="space-between"
  //       >
  //         <Stack spacing="4" maxW="2xl">
  //           <Heading size="sm">Is Your Home Pet-Ready?</Heading>
  //           <Text
  //             color="muted"
  //             fontSize={useBreakpointValue({
  //               base: "lg",
  //               lg: "xl",
  //             })}
  //           >
  //             Take our Ethical Adoption Questionnaire to ensure you're prepared
  //             {/* for the joy, commitment, and love a furry friend brings. Ready to
  //             embark on the journey of ethical adoption and responsible pet
  //             ownership? */}
  //           </Text>
  //         </Stack>
  //         <Stack
  //           spacing="3"
  //           direction={{
  //             base: "column",
  //             sm: "row",
  //           }}
  //           justify={{
  //             base: "start",
  //           }}
  //         >
  //           {/* <Button variant="secondary" size="lg" rounded="full">
  //           Learn more
  //         </Button> */}
  //           <Button
  //             variant="primary"
  //             color="brand.500"
  //             backgroundColor="brand.500"
  //             colorScheme="brand"
  //             size="lg"
  //             rounded="full"
  //             as={Link}
  //             href="/waitlist"
  //           >
  //             <Text color="white">Begin Now</Text>
  //           </Button>
  //         </Stack>
  //       </Stack>
  //     </Box>
  //   </Container>
  // );
};
