import { Container, useBreakpointValue } from "@chakra-ui/react";
import EthicalQuestionairreCard from "lib/components/ui/EthicalQuestionairreCard";
import ExploreOverview from "lib/components/ui/ExploreOverview";
import { NextSeo } from "next-seo";
import Head from "next/head";

const ExplorePage = () => {

  const isMobile = useBreakpointValue({ base: true, md: false })
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


      <Container maxW="5xl" bg="bg-surface" h="full" pb={{ base: 0, md: 12 }}>

        <ExploreOverview />

      </Container>

      {isMobile && <EthicalQuestionairreCard />}

    </>

  )
}

export default ExplorePage