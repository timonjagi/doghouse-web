import { Box, Container, Heading, Icon, Input, InputGroup, InputLeftElement, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import EthicalQuestionairreCard from "lib/components/ui/EthicalQuestionairreCard";
import ExploreOverview from "lib/components/ui/ExploreOverview";
import { NextSeo } from "next-seo";
import Head from "next/head";
import router, { useRouter } from "next/router";
import { useState, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import * as searchService from "lib/services/searchService";
import { SearchInput } from "lib/components/layout/SearchInput";

const ExplorePage = () => {

  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState(router.query?.q as string || '');
  const currentFilters = useMemo(() => searchService.parseSearchParams(router.query), [router.query])

  const handleSearch = () => {
    // Parse existing filters from URL if on search page
    const currentFilters = router.pathname === '/dashboard/search'
      ? searchService.parseSearchParams(router.query)
      : searchService.getDefaultFilters();

    // Update search query while preserving other filters
    const updatedFilters: searchService.SearchFilters = {
      ...currentFilters,
      q: searchQuery,
      tab: currentFilters.tab || 'all', // Default to all tab to show summary
    };

    // Build query params using search service
    const params = searchService.buildQueryParams(updatedFilters);

    router.push({
      pathname: '/dashboard/search',
      query: params
    });
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  return (
    <>
      <Head >
        <title>Explore | Pethouse Kenya</title>
        <meta name="description" content="Browse pets available from verified breeders in Kenya. Connect with professional breeders and find your perfect companion." />
        <meta name="keywords" content="dog breeds Kenya, puppies for sale, cats for sale, dog breeders Kenya, Golden Retriever, Boerboel, Great Dane, verified breeders, pets Kenya, pets for sale, pets breeders Kenya " />
        <meta name="robots" content="index, follow" />
      </Head>

      <NextSeo
        title="Explore | Pethouse Kenya"
        description="Explore pets available from verified breeders in Kenya. Find Golden Retrievers, Boerboels, Great Danes, and more from reputable breeders across the country."
        openGraph={{
          title: "Explore | Pethouse Kenya",
          description: "Explore pets available from verified breeders in Kenya. Find Golden Retrievers, Boerboels, Great Danes, and more from reputable breeders across the country.",
          images: [
            {
              url: "/images/logo.png",
              width: 1200,
              height: 630,
              alt: "Pethouse Kenya - Pet Breeds",
            },
          ],
        }}
        additionalMetaTags={[
          {
            name: "keywords",
            content: "dog breeds Kenya, puppies for sale, cats for sale, dog breeders Kenya, Golden Retriever, Boerboel, Great Dane, verified breeders, pets Kenya, pets for sale, pets breeders Kenya "
          },
          {
            name: "robots",
            content: "index, follow"
          }
        ]}
      />

      <Box bg="bg-accent" color="on-accent">
        <Container
          pt={{
            base: "16",
            md: "24",
          }}
          pb={{
            base: "16",
            md: "24",
          }}
        >
          <Stack
            spacing={{
              base: "8",
              md: "10",
            }}
            align="center"
          >
            <Stack
              spacing={{
                base: "4",
                md: "6",
              }}
              textAlign="center"
            >
              <Stack spacing="4">
                <Text
                  fontWeight="semibold"
                  color="blue.50"
                  fontSize={{
                    base: "sm",
                    md: "md",
                  }}
                >
                  Our Pets
                </Text>
                <Heading
                  size={useBreakpointValue({
                    base: "md",
                    md: "lg",
                  })}
                >
                  Explore Pets
                </Heading>

                <Text
                  fontSize={{
                    base: "lg",
                    md: "xl",
                  }}
                  maxW="2xl"
                  color="on-accent-muted"
                >
                  Browse our extensive selection of pets from verified breeders across Kenya. Find your perfect companion today!
                </Text>
              </Stack>
            </Stack>
            {/* <InputGroup
              size="lg"
              maxW={{
                md: "sm",
              }}
            >
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="on-accent" boxSize="5" />
              </InputLeftElement>
              <Input
                placeholder="Search"
                variant="filled"
                colorScheme="brand"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                onClear={() => searchService.clearSearchParams(currentFilters)}
              />
            </InputGroup> */}
            <SearchInput
              placeholder="Search"
              variant="filled"
              colorScheme="brand"
              iconColor="on-brand"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              onClear={() => searchService.clearSearchParams(currentFilters)}
              maxW={{
                md: "sm",
              }}
            />
          </Stack>
        </Container>
      </Box>
      <Container maxW="5xl" bg="bg-surface" h="full" pb={{ base: 0, md: 4 }} px={0}>

        <ExploreOverview />

      </Container>

      <EthicalQuestionairreCard />

    </>

  )
}

export default ExplorePage