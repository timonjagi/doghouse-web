import { Stack, Heading, Text, Box, Container, AspectRatio, SimpleGrid, Skeleton } from "@chakra-ui/react";
// import type { User } from "firebase/auth";
import Head from "next/head";

import SearchBox from "./SearchBox";
import { SortbySelect } from "./SortBySelect";
import { useState } from "react";
import { BreedCard } from "./BreedCard";
import breeds from "../../data/breeds_with_group_and_traits.json";

export default function Breeds() {
  const [loading, setLoading] = useState(false);

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
              <Heading size="md" mb={{ base: "3", md: "0" }}>
                Breeds
              </Heading>

              <Text color="muted">
                Search our database of over 100 dog breeds
              </Text>
            </Stack>

            <Stack
              spacing={{ base: "6", md: "4" }}
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align="flex-start"
              width="full"
            >
              <SearchBox />

              <SortbySelect
                display={{ base: "none", md: "flex" }}
                placeholder="Sort"
                width="200px"
                size="md"
                colorScheme="brand"
              />
            </Stack>

            {loading && (
              <SimpleGrid
                columns={{ base: 2, md: 3, lg: 4 }}
                gap={{ base: "4", md: "6", lg: "8" }}
              >
                {[...Array(20)].map((item, index) => (
                  <Box
                    position="relative"
                    // eslint-disable-next-line
                    key={index}
                    borderRadius="xl"
                    overflow="hidden"
                  >
                    <AspectRatio ratio={1}>
                      <Skeleton bg="brand.500" color="white" fadeDuration={2} />
                    </AspectRatio>
                  </Box>
                ))}
              </SimpleGrid>
            )}

            <SimpleGrid
              columns={{ base: 2, md: 3, lg: 4 }}
              gap={{ base: "4", md: "6", lg: "8" }}
            >
              {breeds.map((hit) => (
                <BreedCard hit={hit} />
              ))}

              {/* {status !== "idle" && breeds.length && (
                      <Center>
                        <Spinner size="lg" />
                      </Center>
                    )} */}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

