import {
  Flex,
  Heading,
  Stack,
  Text,
  Button,
  Box,
  HStack,
  Img,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { HiChevronRight } from "react-icons/hi";

export default function Hero({ user }) {
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
              Find Your Perfect Furry Companion
            </Heading>
            <Text
              fontSize={{
                md: "2xl",
              }}
              mt="4"
              maxW="lg"
            >
              Discover your ideal furry companion and start a journey of love
              and companionship.
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
                as={Link}
                href={user ? "/waitlist" : "/waitlist"}
                variant="primary"
                color="brand.500"
                backgroundColor="brand.500"
                colorScheme="brand"
                px="8"
                rounded="full"
                size="lg"
                fontSize="md"
                fontWeight="bold"
              >
                <Text color="white">Get Started</Text>
              </Button>
              <HStack
                as={Link}
                href={user ? "/waitlist" : "/waitlist"}
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
                <span>Continue as breeder</span>
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
