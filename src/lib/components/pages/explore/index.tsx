import { Box, Container, Flex, Heading, Image, Link, Stack, useColorModeValue } from "@chakra-ui/react";
import EthicalQuestionairreCard from "lib/components/ui/EthicalQuestionairreCard";
import ExploreOverview from "lib/components/ui/ExploreOverview";
import { NextSeo } from "next-seo";
import Head from "next/head";
import { useRouter } from "next/router";

const ExplorePage = () => {

  const router = useRouter();

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


      <Container maxW="5xl" bg="bg-surface" h="full" pb={{ base: 0, md: 4 }} px={0}>
        <Box position="relative">
          <Image
            src="/images/images/hero_2.png"
            alt="Lovely Image"
            objectFit="cover"
            width="100%"
            height="md"
          />
          <Box position="absolute" boxSize="full" inset="0" zIndex="1">
            <Flex
              direction="column-reverse"
              height="full"
              maxW="7xl"
              mx="auto"
              px={{ base: '4', md: '8', lg: '12' }}
              py={{ base: '6', md: '8', lg: '12' }}
            >
              <Box
                bg={useColorModeValue('white', 'gray.800')}
                alignSelf={{ md: 'start' }}
                p={{ base: '5', md: '8' }}
                minW={{ md: 'lg' }}
              >
                <Stack spacing="5">
                  <Stack spacing="1">
                    <Heading size="lg" color={useColorModeValue('gray.500', 'gray.400')}>
                      Find your
                    </Heading>
                    <Heading size="lg" color={useColorModeValue('black', 'white')}>
                      perfect companion
                    </Heading>
                  </Stack>
                  <Link href="/dashboard/search" fontWeight="bold" textDecoration="underline">
                    Discover now
                  </Link>
                </Stack>
              </Box>
            </Flex>
          </Box>
        </Box>
        <ExploreOverview />

      </Container>

      <EthicalQuestionairreCard />

    </>

  )
}

export default ExplorePage