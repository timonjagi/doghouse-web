import {
  Pagination,
  usePagination,
  PaginationPage,
  PaginationNext,
  PaginationPrevious,
  PaginationPageGroup,
  PaginationContainer,
  PaginationSeparator,
} from "@ajna/pagination";
import {
  Stack,
  Heading,
  Text,
  Image,
  AspectRatio,
  Box,
  Link,
  Skeleton,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Icon,
  Container,
} from "@chakra-ui/react";
import algoliasearch from "algoliasearch/lite";
import type { User } from "firebase/auth";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import singletonRouter from "next/router";
import { renderToString } from "react-dom/server";
import { FiSearch } from "react-icons/fi";
import { createInstantSearchRouterNext } from "react-instantsearch-hooks-router-nextjs";
import { getServerState } from "react-instantsearch-hooks-server";
import {
  InstantSearch,
  InstantSearchSSRProvider,
  useSearchBox,
  useHits,
  usePagination as useInstantSearchPagination,
} from "react-instantsearch-hooks-web";
import type { InstantSearchServerState } from "react-instantsearch-hooks-web";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string
);

// eslint-disable-next-line
const BreedCard = ({ hit }: any) => {
  return (
    <Box position="relative" key={hit.name} borderRadius="xl" overflow="hidden">
      <Link>
        <AspectRatio ratio={1}>
          <Image src={hit.image} alt={hit.name} fallback={<Skeleton />} />
        </AspectRatio>
        <Box
          position="absolute"
          inset="0"
          bgGradient="linear(to-b, transparent 60%, gray.900)"
          boxSize="full"
        />
        <Box
          position="absolute"
          bottom="6"
          width="full"
          textAlign="start"
          px={4}
        >
          <Stack spacing="1">
            <Text color="white" fontSize="lg" fontWeight="semibold">
              {hit.name}
            </Text>

            <Text color="white" fontSize="sm" fontWeight="light">
              {hit.breedGroup.substring(0, hit.breedGroup.length - 1)}
            </Text>
          </Stack>
        </Box>
      </Link>
    </Box>
  );
};

function Hits() {
  const { hits } = useHits();

  return (
    <SimpleGrid
      columns={{ base: 2, md: 3, lg: 4 }}
      gap={{ base: "4", md: "6", lg: "8" }}
    >
      {hits.map((hit) => (
        <BreedCard hit={hit} />
      ))}
    </SimpleGrid>
  );
}

const SearchBox = () => {
  const { refine } = useSearchBox();

  return (
    <InputGroup>
      <InputLeftElement>
        <Icon as={FiSearch} color="muted" boxSize="5" />
      </InputLeftElement>
      <Input
        placeholder="Search breeds"
        type="search"
        onChange={(e) => refine(e.currentTarget.value)}
      />
    </InputGroup>
  );
};

const ListPagination = () => {
  const {
    pages,
    currentRefinement,
    nbHits,
    nbPages,
    isFirstPage,
    isLastPage,
    refine,
  } = useInstantSearchPagination();

  const { setCurrentPage, isDisabled } = usePagination({
    total: nbHits,
    limits: {
      outer: 20,
      inner: 10,
    },
    initialState: {
      pageSize: 3,
      isDisabled: false,
      currentPage: 0,
    },
  });

  return (
    <Stack>
      <Pagination
        pagesCount={nbPages}
        currentPage={currentRefinement}
        isDisabled={isDisabled}
        onPageChange={() => {}}
      >
        <PaginationContainer
          align="center"
          justify="space-between"
          p={4}
          w="full"
        >
          <PaginationPrevious
            _hover={{
              bg: "brand.300",
            }}
            isDisabled={isFirstPage}
            onClick={() => refine(currentRefinement - 1)}
          >
            <Text>Previous</Text>
          </PaginationPrevious>

          <PaginationPageGroup
            isInline
            align="center"
            separator={
              <PaginationSeparator
                onClick={() => setCurrentPage(0)}
                bg="brand.300"
                fontSize="sm"
                w={7}
                jumpSize={11}
              />
            }
          >
            {pages.map((page: number) => (
              <PaginationPage
                w={10}
                key={`pagination_page_${page}`}
                page={page}
                onClick={() => refine(page)}
                fontSize="sm"
                _hover={{
                  bg: "brand.300",
                }}
                _current={{
                  bg: "brand.300",
                  fontSize: "sm",
                  w: 10,
                }}
              />
            ))}
          </PaginationPageGroup>

          <PaginationNext
            _hover={{
              bg: "brand.300",
            }}
            isDisabled={isLastPage}
            onClick={() => refine(currentRefinement + 1)}
          >
            <Text>Next</Text>
          </PaginationNext>
        </PaginationContainer>
      </Pagination>
    </Stack>
  );
};

type PageProps = {
  serverState?: InstantSearchServerState;
  url?: string;
  user?: User;
};

export default function ClientDashboard({ serverState, url }: PageProps) {
  return (
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
            <Head>
              <title>Doghouse | Find breeds</title>
            </Head>
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

                <Hits />
                <ListPagination />
              </Stack>

              {/* <div className="Container">
      <div>
        <DynamicWidgets fallbackComponent={FallbackComponent} />
      </div>
    </div> */}
            </InstantSearch>
          </InstantSearchSSRProvider>
        </Stack>
      </Container>
    </Box>
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
