import { Box, Flex } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

import Footer from "lib/components/layout/Footer";

import { Blog } from "./Blog";
import BreedTraits from "./BreedTraits";
import { Hero } from "./Hero";
import { Process } from "./OurProcess";
import { OurPets } from "./Breeds";
import { Stats } from "./Stats";
import { Testimonials } from "./Testimonials";
import WhyDoghouse from "./WhyDoghouse";
import { CtaWithImage } from "./CtaWithImage";
import { Cta } from "./Cta";
import { LandingFAQs } from "lib/components/ui/LandingFAQs";

const Home = () => {
  return (
    <Box as="section" bg="bg-surface" h="full">
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        w="full"
      >
        <NextSeo title="Pethouse - Your Home for Quality Breeds" />

        <Hero />

        <BreedTraits />

        {/* <OurPets /> */}

        <Process />

        <Stats />

        <WhyDoghouse />
        {/* 
        <Testimonials /> */}

        <LandingFAQs
          title="Common Questions from Seekers"
          description="Everything you need to know about finding and adopting your next pet through Pethouse Kenya."
        />

        <Cta />
        {/* <LogoGrid /> */}

        <Blog />
      </Flex>
    </Box>
  );
};

export default Home;
