import {
  Stack,
  Heading,
  Text,
  Box,
  Container,
  SimpleGrid,
} from "@chakra-ui/react";
// import type { User } from "firebase/auth";
import Head from "next/head";

import { BreedCard } from "./BreedCard";
// import breeds from "../../data/breeds_with_group_and_traits.json";

export default function Breeds() {
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
    <>
      <Head>
        <title>Our breeds - Doghouse</title>
      </Head>
      <Box as="section">
        <Container
          pt={{
            base: "4",
            lg: "8",
          }}
          pb={{
            base: "12",
            lg: "24",
          }}
        >
          <Stack spacing="5">
            <Stack spacing="1">
              <Heading size="md" mb={{ base: "3", md: "0" }}>
                Our Breeds
              </Heading>

              <Text color="muted">
                Explore our list of dog breeds from reputable breeders around
                the country
              </Text>
            </Stack>

            <SimpleGrid
              columns={{ base: 2, md: 3, lg: 4 }}
              gap={{ base: "4", md: "6", lg: "8" }}
            >
              {breeds.map((hit) => (
                <BreedCard hit={hit} />
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
