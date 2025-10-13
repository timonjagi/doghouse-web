import {
  Box,
  Center,
  Container,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
// import * as React from "react";

import * as logos from "./Logos";

export const LogoGrid = () => (
  <Box bg="bg-accent" color="on-accent" w="full">
    <Container py={{ base: "12", md: "16" }}>
      <Stack spacing="8">
        <Text
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="medium"
          textAlign="center"
        >
          These and other companies trust us
        </Text>
        <SimpleGrid
          gap={{ base: "4", md: "8" }}
          columns={{ base: 2, md: 3, lg: 5 }}
        >
          {Object.entries(logos).map(([name, Logo]) => (
            <Center key={name}>
              <Logo h={{ base: "8", md: "10" }} maxW="180px" />
            </Center>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  </Box>
);
