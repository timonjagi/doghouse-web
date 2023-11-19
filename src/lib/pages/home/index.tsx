import { Box, Flex } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

import Footer from "lib/components/nav/Footer";

import { Cta } from "./Cta";
import Features from "./Features";
import Hero from "./Hero";
import { BreedGroups } from "./BreedGroups";
import { Process } from "./Process";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "lib/firebase/client";
import { Stats } from "./Stats";
import { Testimonials } from "./Testimonials";
import { LogoGrid } from "./LogoGrid";

const Home = () => {
  const [user] = useAuthState(auth);

  return (
    <Box as="section" height="100vh" overflowY="auto">
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        minHeight="70vh"
        w="full"
      >
        <NextSeo title="Home" />
        <Hero user={user} />
        {/* 
        <Features />
        <Stats /> */}

        {/* <Process /> */}

        <BreedGroups />

        {/* <Testimonials /> */}

        <Cta />

        <LogoGrid />
      </Flex>
      <Footer />
    </Box>
  );
};

export default Home;
