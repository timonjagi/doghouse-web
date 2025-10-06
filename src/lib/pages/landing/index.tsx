import { Box, Flex } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

import Footer from "lib/components/layout/Footer";

import { Blog } from "./Blog";
import BreedTraits from "./BreedTraits";
import { Cta } from "./Cta";
import { CtaWithImage } from "./CtaWithImage";
import Hero from "./Hero";
import { LogoGrid } from "./LogoGrid";
import { Process } from "./Process";
import { RecentLitters } from "./RecentLitters";
import { Stats } from "./Stats";
import { Testimonials } from "./Testimonials";
import WhyDoghouse from "./WhyDoghouse";

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
        <NextSeo title="Doghouse - Quality breeds" />
        <Hero />

        <BreedTraits />

        <RecentLitters />

        <Process />

        <Stats />

        <WhyDoghouse />

        <Testimonials />

        {/* <Cta /> */}

        {/* <CtaWithImage /> */}
        {/* <LogoGrid /> */}

        <Blog />
      </Flex>
      <Footer />
    </Box>
  );
};

export default Home;
