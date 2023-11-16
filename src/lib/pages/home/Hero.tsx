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
              Welcome to Doghouse 🐶
            </Heading>
            <Text
              fontSize={{
                base: "xl",
                md: "2xl",
              }}
              mt="4"
              maxW="lg"
            >
              Fostering Responsible Pet Adoption and Ethical Breeding
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
                href={user ? "/profile" : "/signup"}
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
                <Text color="white">Join Our Community</Text>
              </Button>
              <HStack
                as={Link}
                href={user ? "/profile" : "/signup"}
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
                <span>Already a member? Login</span>
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
            src="images/hero_2_2.png"
            alt="Main Image"
            w="full"
            h="full"
            objectFit="cover"
            objectPosition="90% center"
            position="absolute"
          />
          <Box position="absolute" w="full" h="full" bg="blackAlpha.700" />
        </Box>
      </Flex>
    </Box>
  );
}
