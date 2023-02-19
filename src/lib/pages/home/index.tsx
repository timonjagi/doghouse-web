import { Flex } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

import { Cta } from "./Cta";
import Features from "./Features";
import Hero from "./Hero";
// import { LogoGrid } from "./LogoGrid";
import { Pricing } from "./Pricing";
import { Stats } from "./Stats";
import { Testimonials } from "./Testimonials";

const Home = () => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      w="full"
    >
      <NextSeo title="Home" />
      <Hero />

      <Features />
      <Stats />

      <Pricing />

      <Testimonials />
      {/* <LogoGrid /> */}

      <Cta />
    </Flex>
  );
};

export default Home;
