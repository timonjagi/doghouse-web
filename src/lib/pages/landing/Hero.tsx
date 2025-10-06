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
  Center,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { HiChevronRight } from "react-icons/hi";

export default function Hero() {
  return (
    <Box w="full" bg="gray.800" as="section" position="relative">
      <Box pt="16" py="32" position="relative" zIndex={1}>
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
            <Heading as="h1" size="3xl" fontWeight="bold">
              Find Your Perfect Furry Friend
            </Heading>
            <Text
              fontSize={{
                base: "xl",
                md: "2xl",
              }}
              mt="4"
              maxW="lg"
            >
              Discover your ideal furry companion and start a journey of love
              and companionship
            </Text>
            <Stack
              direction={{
                base: "column",
                md: "row",
              }}
              mt="10"
              spacing={{ base: 4, md: 2 }}
            >
              <Button
                as={Link}
                href="/available-dogs"
                variant="primary"
                color="brand.500"
                backgroundColor="brand.500"
                colorScheme="brand"
                px="8"
                py="4"
                rounded="full"
                size="lg"
                fontSize="md"
                fontWeight="bold"
              >
                <Text color="white">Browse Dogs</Text>
              </Button>
              <HStack
                as={Link}
                href="/about"
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
                <span>Learn more</span>
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
            objectPosition="90% center"
            position="absolute"
          />
          <Box position="absolute" w="full" h="full" bg="blackAlpha.400" />
        </Box>
      </Flex>
    </Box>
  );
}
