import { Container, Stack, Heading, Box, Text } from "@chakra-ui/react";
import Head from "next/head";

export default function BreedDetails() {
  // const [breed, setBreed] = useState({} as Hit);
  // const { query } = useRouter();

  return (
    <>
      <Head>
        <title>Search breeds - Doghouse</title>
      </Head>
      <Box as="section" height="100vh" overflowY="auto">
        <Container
          pt={{
            base: "4",
            lg: "8",
          }}
          pb={{
            base: "12",
            lg: "24",
          }}
        >
          <Stack spacing="5">
            <Stack spacing="1">
              <Heading size="md" mb={{ base: "3", md: "0" }} />

              <Text color="muted">Find out all about your future friend</Text>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
