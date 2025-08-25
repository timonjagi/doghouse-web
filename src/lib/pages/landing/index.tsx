import { Box, Flex } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

import Footer from "lib/layout/Footer";

import Hero from "./Hero";
import { Process } from "./Process";
import { CtaWithImage } from "./CtaWithImage";
import { RecentLitters } from "./RecentLitters";
import { Cta } from "./Cta";
import { LogoGrid } from "./LogoGrid";
import { Stats } from "./Stats";
import { Testimonials } from "./Testimonials";
import BreedTraits from "./BreedTraits";
import WhyDoghouse from "./WhyDoghouse";
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



        <BreedTraits />


        <RecentLitters />

        <Process />

        <Stats />

        <WhyDoghouse />



        {/* <Testimonials /> */}

        <Cta />

        {/* <CtaWithImage />

        <LogoGrid /> */}
      </Flex>
      <Footer />
    </Box>
  );
};

export default Home;
