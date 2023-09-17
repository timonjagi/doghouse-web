// pages/contact.jsx
import { useEffect, useState } from "react"; // Import useEffect
import Script from "next/script";
import { Flex, Box, Modal, ModalOverlay, Spinner } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

export default function ContactUs() {
  const [loading, setLoading] = useState(true);

  const loadTallyEmbeds = () => {
    setLoading(false);
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
          <NextSeo title="Adoption Contract" />

          <Modal isCentered isOpen={loading ? true : false} onClose={() => {}}>
            <ModalOverlay
              bg="none"
              backdropFilter="auto"
              backdropBlur="2px"
              alignItems="center"
              justifyContent="center"
              zIndex={modal}
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
          ></iframe>
        </Flex>
      </Box>
      <Script id="tally-js" src="https://tally.so/widgets/embed.js" />
    </>
  );
}
