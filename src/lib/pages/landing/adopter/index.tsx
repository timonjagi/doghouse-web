import { Box, Flex } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

import Footer from "lib/components/layout/Footer";

import { Blog } from "./Blog";
import BreedTraits from "./BreedTraits";
import { Hero } from "./Hero";
import { Process } from "./OurProcess";
import { OurBreeds } from "./Breeds";
import { Stats } from "./Stats";
import { Testimonials } from "./Testimonials";
import WhyDoghouse from "./WhyDoghouse";
import { CtaWithImage } from "./CtaWithImage";
import { Cta } from "./Cta";

const Home = () => {
  return (
    <Box as="section" bg="bg-surface" h="full">
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        w="full"
      >
        <NextSeo title="Doghouse - Your Home for Quality Breeds" />

        <Hero />

        {/* <BreedTraits /> */}
        {/* 
        <OurBreeds /> */}

        <Process />

        <Stats />

        <WhyDoghouse />
        {/* 
        <Testimonials /> */}


        <Cta />
        {/* <LogoGrid /> */}

        <Blog />
      </Flex>
      <Footer />
    </Box>
  );
};

export default Home;
