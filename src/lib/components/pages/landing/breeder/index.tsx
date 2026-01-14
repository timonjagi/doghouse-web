import { Box, Flex } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

import Footer from "lib/components/layout/Footer";

import { Blog } from "./Blog";
import BreedTraits from "./BreedTraits";
import Hero from "./Hero";
import { Process } from "./OurProcess";
import { OurPets } from "./Breeds";
import { Stats } from "./Stats";
import { Testimonials } from "./Testimonials";
import WhyDoghouse from "./WhyDoghouse";
import { LandingFAQs } from "lib/components/ui/LandingFAQs";
import { Cta } from "./Cta";
import { LogoGrid } from "./LogoGrid";

const Home = () => {
  return (
    <Box as="section" bg="bg-surface">
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        minHeight="70vh"
        w="full"
      >
        <NextSeo title="Pethouse - Quality breeds" />
        <Hero />

        <BreedTraits />

        {/* <OurPets /> */}

        <Process />

        <Stats />

        <WhyDoghouse />

        <LogoGrid />

        {/* <Testimonials /> */}

        <LandingFAQs
          title="Common Questions from Partners"
          description="Everything you need to know about managing your kennel or shelter and connecting with seekers on Pethouse Kenya."
        />

        <Cta />

        {/* <CtaWithImage /> */}


        <Blog />
      </Flex>
    </Box>
  );
};

export default Home;
