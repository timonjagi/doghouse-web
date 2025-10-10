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

export const RecentLitters = () => {
  const breeds = [
    {
      name: "Golden Retriever",
      breedGroup: "sporting",
      image: "images/breeds/doghousekenya_golden_retriever_1.webp",
    },
    {
      name: "Boerboel",
      breedGroup: "working",
      image: "images/breeds/doghousekenya_boerboel_1.jpg",
    },
    {
      name: "Great Dane",
      breedGroup: "working",
      image: "images/breeds/doghousekenya_great_dane_1.jpg",
    },
    {
      name: "Maltese",
      breedGroup: "toy",
      image: "images/breeds/doghousekenya_maltese_1.jpg",
    },
    {
      name: "Siberian Husky",
      breedGroup: "working",
      image: "images/breeds/doghousekenya_siberian_husky_1.jpg",
    },
    {
      name: "Rottweiler",
      breedGroup: "working",
      image: "images/breeds/doghousekenya_rotweiler_1.jpg",
    },
    {
      name: "Cocker Spaniel",
      breedGroup: "sporting",
      image: "images/breeds/doghousekenya_spaniel_1.jpg",
    },
    {
      name: "Saint Bernard",
      breedGroup: "working",
      image: "images/breeds/doghousekenya_st_bernard_1.jpg",
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
                Our Breeds
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
              {breeds.map((breed) => (
                <Box
                  position="relative"
                  key={breed.name}
                  borderRadius="xl"
                  overflow="hidden"
                >
                  <Link
                    href={`/breeds?breedName=${breed.name}`}
                    as={`/breeds/${breed.name.replaceAll(" ", "-")}`}
                  >
                    <AspectRatio ratio={1}>
                      <Image
                        src={breed.image}
                        alt={breed.name}
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
                          {breed.name}
                        </Text>

                        <Text
                          color="white"
                          fontSize="sm"
                          fontWeight="light"
                          pt={0}
                        >
                          {breed.breedGroup} group
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
