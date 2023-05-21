import { Stack, Heading, Text, Box, Container } from "@chakra-ui/react";
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

import SearchBox from "./SearchBox";
import SearchResults from "./SearchResults";

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
                Search breeds
              </Heading>

              <Text color="muted">Find out all about your future friend</Text>
            </Stack>
            <InstantSearchSSRProvider {...serverState}>
              <InstantSearch
                searchClient={client}
                indexName="breeds"
                routing={{
                  router: createInstantSearchRouterNext({
                    serverUrl: url,
                    singletonRouter,
                  }),
                }}
                insights
              >
                <Stack spacing="5">
                  <SearchBox />
                  <SearchResults />
                </Stack>
              </InstantSearch>
            </InstantSearchSSRProvider>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

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
