import {
  Stack,
  Heading,
  Text,
  Box,
  Container,
<<<<<<< HEAD
  SimpleGrid,
} from "@chakra-ui/react";
// import type { User } from "firebase/auth";
import Head from "next/head";

import { BreedCard } from "./BreedCard";
// import breeds from "../../data/breeds_with_group_and_traits.json";

export default function Breeds() {
  const breeds = [
    {
      name: "Golden Retriever",
      breedGroup: "sporting",
      image: "images/breeds/doghousekenya_golden_retriever_1.webp",
    },
    {
      name: "Boerboel",
      breedGroup: "working",
      image: "images/breeds/doghousekenya_boerboel_1.jpg",
    },
    {
      name: "Great Dane",
      breedGroup: "working",
      image: "images/breeds/doghousekenya_great_dane_1.jpg",
    },
    {
      name: "Maltese",
      breedGroup: "toy",
      image: "images/breeds/doghousekenya_maltese_1.jpg",
    },
    {
      name: "Siberian Husky",
      breedGroup: "working",
      image: "images/breeds/doghousekenya_siberian_husky_1.jpg",
    },
    {
      name: "Rottweiler",
      breedGroup: "working",
      image: "images/breeds/doghousekenya_rotweiler_1.jpg",
    },
    {
      name: "Cocker Spaniel",
      breedGroup: "sporting",
      image: "images/breeds/doghousekenya_spaniel_1.jpg",
    },
    {
      name: "Saint Bernard",
      breedGroup: "working",
      image: "images/breeds/doghousekenya_st_bernard_1.jpg",
    },
  ];

  return (
    <>
      <Head>
        <title>Our breeds - Doghouse</title>
      </Head>
      <Box as="section">
=======
  Grid,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import algoliasearch from "algoliasearch/lite";
import type { User } from "firebase/auth";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import singletonRouter from "next/router";
import { renderToString } from "react-dom/server";
import { createInstantSearchRouterNext } from "react-instantsearch-hooks-router-nextjs";
import { getServerState } from "react-instantsearch-hooks-server";
import {
  InstantSearch,
  InstantSearchSSRProvider,
} from "react-instantsearch-hooks-web";
import type { InstantSearchServerState } from "react-instantsearch-hooks-web";

import { Filter } from "./Filter";
import SearchBox from "./SearchBox";
import SearchResults from "./SearchResults";
import { SortbySelect } from "./SortBySelect";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string
);

type PageProps = {
  serverState?: InstantSearchServerState;
  url?: string;
  user?: User;
};

export default function Breeds({ serverState, url }: PageProps) {
  return (
    <>
      <Head>
        <title>Explore breeds</title>
      </Head>
      <Box as="section" height="100vh">
>>>>>>> parent of b0357f4 (feat(components): Remove app features)
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
<<<<<<< HEAD
                Our Breeds
              </Heading>

              <Text color="muted">
                Explore our list of dog breeds from reputable breeders around
                the country
              </Text>
            </Stack>

            <SimpleGrid
              columns={{ base: 2, md: 3, lg: 4 }}
              gap={{ base: "4", md: "6", lg: "8" }}
            >
              {breeds.map((hit) => (
                <BreedCard hit={hit} />
              ))}
            </SimpleGrid>
=======
                Explore breeds
              </Heading>

              <Text color="muted">All about your favorite furry friend</Text>
            </Stack>

            <InstantSearchSSRProvider {...serverState}>
              <InstantSearch
                searchClient={client}
                indexName="breeds_2"
                routing={{
                  router: createInstantSearchRouterNext({
                    serverUrl: url,
                    singletonRouter,
                  }),
                }}
                insights
              >
                <Stack
                  spacing={{ base: "6", md: "4" }}
                  direction={{ base: "column", md: "row" }}
                  justify="space-between"
                  align="flex-start"
                  width="full"
                >
                  <HStack w="full">
                    <Filter />
                    <SearchBox />
                  </HStack>

                  <SortbySelect
                    display={{ base: "none", md: "flex" }}
                    placeholder="Sort"
                    width="200px"
                    size="md"
                    colorScheme="brand"
                  />
                </Stack>

                <Spacer />

                <SearchResults />
              </InstantSearch>
            </InstantSearchSSRProvider>
>>>>>>> parent of b0357f4 (feat(components): Remove app features)
          </Stack>
        </Container>
      </Box>
    </>
  );
}
<<<<<<< HEAD
=======

export const getServerSideProps: GetServerSideProps<PageProps> =
  async function getServerSideProps({ req }) {
    const protocol = req.headers.referer?.split("://")[0] || "https";
    const url = `${protocol}://${req.headers.host}${req.url}`;
    const serverState = await getServerState(<Breeds url={url} />, {
      renderToString,
    });

    return {
      props: {
        serverState,
        url,
      },
    };
  };
>>>>>>> parent of b0357f4 (feat(components): Remove app features)
