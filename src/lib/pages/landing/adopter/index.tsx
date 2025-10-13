import { Box, Flex } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

import Footer from "lib/components/layout/Footer";

<<<<<<< HEAD
import { Blog } from "./Blog";
import BreedTraits from "./BreedTraits";
import Hero from "./Hero";
import { Process } from "./OurProcess";
import { OurBreeds } from "./Breeds";
import { Stats } from "./Stats";
import { Testimonials } from "./Testimonials";
import WhyDoghouse from "./WhyDoghouse";
=======
import { Cta } from "./Cta";
import Features from "./Features";
import Hero from "./Hero";
// import { BreedGroups } from "./BreedGroups";
import { Process } from "./Process";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "lib/firebase/client";
import { Stats } from "./Stats";
import { Testimonials } from "./Testimonials";
import { LogoGrid } from "./LogoGrid";
import { PopularBreeds } from "./PopularBreeds";
import { CtaWithImage } from "./CtaWithImage";
const Home = () => {
  const [user] = useAuthState(auth);
>>>>>>> parent of b0357f4 (feat(components): Remove app features)

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
        <NextSeo title="Home" />
        <Hero user={user} />

        <BreedTraits />

<<<<<<< HEAD
        <OurBreeds />

        <Process />

        <Stats />

        <WhyDoghouse />

        <Testimonials />
=======
        <Features />

        <PopularBreeds />

        <Process />

        {/* <BreedGroups /> */}

        {/* <Testimonials /> */}
>>>>>>> parent of b0357f4 (feat(components): Remove app features)

        <Cta />

        {/* <CtaWithImage /> */}
        {/* <LogoGrid /> */}

        <Blog />
      </Flex>
      <Footer />
    </Box>
  );
};

export default Home;
