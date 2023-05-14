import {
  HStack,
  Stack,
  Heading,
  useBreakpointValue,
  Button,
  Text,
} from "@chakra-ui/react";
import algoliasearch from "algoliasearch/lite";
import type { User } from "firebase/auth";
import type { Hit as AlgoliaHit } from "instantsearch.js";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import singletonRouter from "next/router";
import { renderToString } from "react-dom/server";
import { createInstantSearchRouterNext } from "react-instantsearch-hooks-router-nextjs";
import { getServerState } from "react-instantsearch-hooks-server";
import type { InstantSearchServerState } from "react-instantsearch-hooks-web";
import {
  DynamicWidgets,
  InstantSearch,
  Hits,
  Highlight,
  RefinementList,
  SearchBox,
  InstantSearchSSRProvider,
} from "react-instantsearch-hooks-web";

// import { Panel } from "../components/Panel";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string
);

type HitProps = {
  hit: AlgoliaHit<{
    name: string;
    price: number;
  }>;
};

function Hit({ hit }: HitProps) {
  return <Highlight hit={hit} attribute="name" className="Hit-label" />;
}

function FallbackComponent({ attribute }: { attribute: string }) {
  return <RefinementList attribute={attribute} />;
}

type PageProps = {
  serverState?: InstantSearchServerState;
  url?: string;
  user?: User;
};

export default function ClientDashboard({ serverState, url, user }: PageProps) {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <Head>
        <title>Doghouse | Find breeds</title>
      </Head>

      <HStack spacing="4" justify="space-between">
        <Stack spacing="1">
          <Heading
            size={useBreakpointValue({
              base: "xs",
              lg: "sm",
            })}
            fontWeight="medium"
          >
            Hi, {user?.displayName}
          </Heading>
          <Text color="muted">Find out all about your future friend</Text>
        </Stack>
        <Button variant="primary">Create</Button>
      </HStack>
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
        <div className="Container">
          <div>
            <DynamicWidgets fallbackComponent={FallbackComponent} />
          </div>
          <div>
            <SearchBox />
            <Hits hitComponent={Hit} />
          </div>
        </div>
      </InstantSearch>
    </InstantSearchSSRProvider>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> =
  async function getServerSideProps({ req }) {
    const protocol = req.headers.referer?.split("://")[0] || "https";
    const url = `${protocol}://${req.headers.host}${req.url}`;
    const serverState = await getServerState(<ClientDashboard url={url} />, {
      renderToString,
    });

    return {
      props: {
        serverState,
        url,
      },
    };
  };
