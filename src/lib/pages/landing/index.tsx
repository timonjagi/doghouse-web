import { Box, Flex } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

import Footer from "lib/layout/Footer";

import Features from "./Features";
import Hero from "./Hero";
import { Process } from "./Process";
import { CtaWithImage } from "./CtaWithImage";
const Home = () => {

  return (
    <Box as="section" height="100vh" overflowY="auto">
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        minHeight="70vh"
        w="full"
      >
        <NextSeo title="Doghouse - Quality breeds" />
        <Hero />

        {/* <Stats /> */}

        <Features />

        {/* <PopularBreeds /> */}

        <Process />

        {/* <Testimonials /> */}

        {/* <Cta /> */}

        <CtaWithImage />

        {/* <LogoGrid /> */}
      </Flex>
      <Footer />
    </Box>
  );
};

export default Home;
