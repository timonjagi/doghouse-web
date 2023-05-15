import {
  Flex,
  Heading,
  Stack,
  Text,
  Button,
  Box,
  HStack,
  Img,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { HiChevronRight } from "react-icons/hi";

export default function CallToActionWithIllustration() {
  return (
    <Box w="full" bg="gray.800" as="section" position="relative">
      <Box py="32" position="relative" zIndex={1}>
        <Box
          maxW={{
            base: "xl",
            md: "7xl",
          }}
          mx="auto"
          px={{
            base: "6",
            md: "8",
          }}
          color="white"
        >
          <Box maxW="xl">
            <Heading as="h1" size="3xl" fontWeight="extrabold">
              Quality breeds from the most reputable breeders
            </Heading>
            <Text
              fontSize={{
                md: "2xl",
              }}
              mt="4"
              maxW="lg"
            >
              Search for your favorite breeds and get a list of qualified
              breeders that will contact you for offers.
            </Text>
            <Stack
              direction={{
                base: "column",
                md: "row",
              }}
              mt="10"
              spacing="4"
            >
              <Button
                as={NextLink}
                href="/breeds"
                variant="primary"
                px="8"
                rounded="full"
                size="lg"
                fontSize="md"
                fontWeight="bold"
              >
                Get Started for Free
              </Button>
              <HStack
                as={NextLink}
                href="/signup"
                transition="background 0.2s"
                justify={{
                  base: "center",
                  md: "flex-start",
                }}
                color="white"
                rounded="full"
                fontWeight="bold"
                px="6"
                py="3"
                _hover={{
                  bg: "whiteAlpha.300",
                }}
              >
                <span>Sign up as breeder</span>
                <HiChevronRight />
              </HStack>
            </Stack>
          </Box>
        </Box>
      </Box>
      <Flex
        id="image-wrapper"
        position="absolute"
        insetX="0"
        insetY="0"
        w="full"
        h="full"
        overflow="hidden"
        align="center"
      >
        <Box position="relative" w="full" h="full">
          <Img
            src="images/hero.jpg"
            alt="Main Image"
            w="full"
            h="full"
            objectFit="cover"
            objectPosition="top bottom"
            position="absolute"
          />
          <Box position="absolute" w="full" h="full" bg="blackAlpha.600" />
        </Box>
      </Flex>
    </Box>
  );
}
