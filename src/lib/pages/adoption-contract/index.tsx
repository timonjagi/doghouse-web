// pages/contact.jsx
import { useEffect } from "react"; // Import useEffect
import Script from "next/script";
import { Flex, Box } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

export default function ContactUs() {
  useEffect(() => {
    // Load Tally embeds after the page has mounted
    const loadTallyEmbeds = () => {
      if (window.Tally) {
        window.Tally.loadEmbeds();
      }
    };

    // Add an event listener for the "load" event to ensure Tally is loaded
    window.addEventListener("load", loadTallyEmbeds);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("load", loadTallyEmbeds);
    };
  }, []);

  return (
    <>
      <Box as="section" height="100vh" overflowY="auto">
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          h="full"
          w="full"
        >
          <NextSeo title="Home" />
          <iframe
            data-tally-src="https://tally.so/r/wQelgg"
            width="100%"
            height="100%"
            title="Contact form"
          ></iframe>
        </Flex>
      </Box>
      <Script id="tally-js" src="https://tally.so/widgets/embed.js" />
    </>
  );
}
