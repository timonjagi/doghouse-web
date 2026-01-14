import {
  AspectRatio,
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Skeleton,
  Stack,
  Image,
  Container,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export const OurPets = () => {
  const pets = [
    {
      name: "Golden Retriever",
      category: "Dogs",
      image: "images/breeds/doghousekenya_golden_retriever_1.webp",
      exploreUrl: "/explore?category=dogs",
    },
    {
      name: "Persian Cat",
      category: "Cats",
      image: "images/breeds/doghousekenya_golden_retriever_1.webp",
      exploreUrl: "/explore?category=cats",
    },
    {
      name: "Holland Lop Rabbit",
      category: "Rodents",
      image: "images/breeds/doghousekenya_golden_retriever_1.webp",
      exploreUrl: "/explore?category=rodents",
    },
    {
      name: "African Grey Parrot",
      category: "Birds",
      image: "images/breeds/doghousekenya_golden_retriever_1.webp",
      exploreUrl: "/explore?category=birds",
    },
    {
      name: "Siberian Husky",
      category: "Dogs",
      image: "images/breeds/doghousekenya_siberian_husky_1.jpg",
      exploreUrl: "/explore?category=dogs",
    },
    {
      name: "Maine Coon",
      category: "Cats",
      image: "images/breeds/doghousekenya_golden_retriever_1.webp",
      exploreUrl: "/explore?category=cats",
    },
    {
      name: "Syrian Hamster",
      category: "Rodents",
      image: "images/breeds/doghousekenya_golden_retriever_1.webp",
      exploreUrl: "/explore?category=rodents",
    },
    {
      name: "Cockatiel",
      category: "Birds",
      image: "images/breeds/doghousekenya_golden_retriever_1.webp",
      exploreUrl: "/explore?category=birds",
    },
  ];

  return (
    <Box as="section" w="full" bg="bg-accent">
      <Container>
        <Box mx="auto" py={{ base: "6", md: "8", lg: "12" }}>
          <Stack spacing={{ base: "6", md: "8", lg: "12" }}>
            <Flex
              justify="space-between"
              align={{ base: "center", md: "center" }}
              direction={{ base: "row", md: "row" }}
            >
              <Heading
                size={{ base: "sm", md: "md" }}
                mb={{ base: "3", md: "0" }}
                color="white"
              >
                Our Pets
              </Heading>
              <HStack spacing={{ base: "2", md: "3" }}>
                <Text
                  as={Link}
                  fontWeight="semibold"
                  color={useColorModeValue("brand.100", "brand.300")}
                  href="/breeds"
                >
                  View More
                </Text>
                <Icon
                  as={FaArrowRight}
                  color={useColorModeValue("brand.100", "brand.300")}
                  fontSize={{ base: "sm", md: "md" }}
                />
              </HStack>
            </Flex>
            <SimpleGrid
              columns={{ base: 2, md: 3, lg: 4 }}
              gap={{ base: "4", md: "6", lg: "8" }}
            >
              {pets.map((pet) => (
                <Box
                  position="relative"
                  key={pet.name}
                  borderRadius="xl"
                  overflow="hidden"
                >
                  <Link href={pet.exploreUrl}>
                    <AspectRatio ratio={1}>
                      <Image
                        src={pet.image}
                        alt={pet.name}
                        fallback={<Skeleton />}
                      />
                    </AspectRatio>
                    <Box
                      position="absolute"
                      inset="0"
                      bgGradient="linear(to-b, transparent 40%, gray.900)"
                      boxSize="full"
                    />
                    <Box
                      position="absolute"
                      bottom="6"
                      width="full"
                      textAlign="start"
                      px={4}
                      blur="2px"
                    >
                      <Stack spacing="1">
                        <Text
                          color="white"
                          fontSize="lg"
                          fontWeight="semibold"
                          pb={0}
                        >
                          {pet.name}
                        </Text>

                        <Text
                          color="white"
                          fontSize="sm"
                          fontWeight="light"
                          pt={0}
                        >
                          {pet.category}
                        </Text>
                      </Stack>
                    </Box>
                  </Link>
                </Box>
              ))}
            </SimpleGrid>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
