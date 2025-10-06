// pages/contact.jsx
import { useEffect, useState } from "react"; // Import useEffect
import Script from "next/script";
import {
  Flex,
  Box,
  Spinner,
  ModalOverlay,
  Modal,
  ModalContent,
} from "@chakra-ui/react";
import { NextSeo } from "next-seo";

export default function ContactUs() {
  const [loading, setLoading] = useState(true);

  const loadTallyEmbeds = () => {
    setLoading(false);
    // eslint-disable-next-line
    if (window.Tally) {
      window.Tally.loadEmbeds();
    }
  };

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
          <NextSeo title="Welcome" />

          <Modal isCentered isOpen={loading ? true : false} onClose={() => {}}>
            <ModalOverlay
              marginTop={{ base: "64px", lg: "72px" }}
              bg="none"
              backdropFilter="auto"
              backdropBlur="2px"
              alignItems="center"
              justifyContent="center"
              zIndex={1}
            ></ModalOverlay>
          </Modal>

          {loading && (
            <Spinner
              position="absolute"
              thickness="4px"
              emptyColor="gray.200"
              color="brand.500"
              size="xl"
              zIndex={2}
            />
          )}
          <iframe
            data-tally-src="https://tally.so/r/wQelgg"
            width="100%"
            height="100%"
            title="Contact form"
            onLoad={() => loadTallyEmbeds()}
          ></iframe>
        </Flex>
      </Box>
      <Script id="tally-js" src="https://tally.so/widgets/embed.js" />
    </>
  );
}
