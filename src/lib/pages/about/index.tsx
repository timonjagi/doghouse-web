import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  IconButton,
  Divider,
  useColorModeValue,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { BsTiktok } from "react-icons/bs";
import { NextSeo } from "next-seo";
import Footer from "lib/components/layout/Footer";
import WhyDoghouse from "../landing/WhyDoghouse";
import { Socials } from "./Socials";
import { Team } from "./Team";

const About = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <>
      <NextSeo title="About Us - Doghouse Kenya" />

      <Box bg="bg-surface" minH="100vh">
        <Container maxW="4xl" py={{ base: 12, md: 20 }}>
          <VStack spacing={{ base: 12, md: 16 }} align="stretch">
            {/* Header */}
            <VStack spacing={4} textAlign="center">

              <Heading
                as="h1"
                size={{ base: "md", md: "lg" }}
              >
                About Us
              </Heading>
              <Text fontSize={{ base: "md", md: "lg" }} color={textColor} maxW="2xl">
                Your trusted partner in finding the perfect canine companion in Kenya
              </Text>
            </VStack>

            <Divider />

            {/* Mission Section */}

            <VStack spacing={4} align="stretch">
              <Heading size={useBreakpointValue({ base: 'sm', md: 'md' })}>Our Mission</Heading>

              <Text fontSize={{ base: "md", md: "lg" }} color={textColor} lineHeight="tall">
                To connect loving families with healthy, well-bred puppies while promoting responsible
                dog ownership and supporting ethical breeding practices across Kenya. We strive to make
                the process of finding your perfect furry friend seamless, transparent, and enjoyable.
              </Text>
            </VStack>
            {/* Vision Section */}
            <VStack spacing={4} align="stretch">

              <Heading size={useBreakpointValue({ base: 'sm', md: 'md' })}>Our Vision</Heading>

              <Text fontSize={{ base: "md", md: "lg" }} color={textColor} lineHeight="tall">
                To become Kenya's leading platform for premium dog breeds, setting the standard for
                quality, transparency, and customer satisfaction in the pet industry. We envision a
                future where every dog finds a loving home and every family finds their perfect companion.
              </Text>
            </VStack>
            <Team />

            <WhyDoghouse />


            {/* Social Media Section */}
            <Socials />
          </VStack>
        </Container>
        <Footer />
      </Box >
    </>
  );
};

export default About;


