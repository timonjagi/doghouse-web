import {
  AspectRatio,
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Skeleton,
  Stack,
  Image,
  Container,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
// import * as React from "react";
import { FaArrowRight } from "react-icons/fa";

import { breedGroups } from "./_breed_groups";
// import { CategoryCard } from "./CatetgoryCard";

// const breedGroups = [
//   {
//     name: "Working",
//     imageUrl: "images/breed_groups/breed_group_working.jpeg",
//   },
//   {
//     name: "Toy",
//     imageUrl: "images/breed_groups/breed_group_toy.jpeg",
//   },
//   {
//     name: "Pastoral",
//     imageUrl: "images/breed_groups/breed_group_pastoral.jpeg",
//   },
//   {
//     name: "Hound",
//     imageUrl: "images/breed_groups/breed_group_hound.png",
//   },
//   {
//     name: "Terrier",
//     imageUrl: "images/breed_groups/breed_group_terrier.png",
//   },
//   {
//     name: "Utility",
//     imageUrl: "images/breed_groups/breed_group_utility.jpeg",
//   },
//   {
//     name: "Gun Dog",
//     imageUrl: "images/breed_groups/breed_group_gun_dog.png",
//   },
// ];

// const CategoryCard = (props: Props) => {
//   // eslint-disable-next-line
//   const { group, rootProps } = props;
//   return (

//   );
// };

export const PopularBreeds = () => (
  <Box as="section" w="full">
    <Container>
      <Box mx="auto" py={{ base: "6", md: "8", lg: "12" }}>
        <Stack spacing={{ base: "6", md: "8", lg: "12" }}>
          <Flex
            justify="space-between"
            align={{ base: "start", md: "center" }}
            direction={{ base: "column", md: "row" }}
          >
            <Heading size="lg" mb={{ base: "3", md: "0" }}>
              Explore breeds
            </Heading>
            <HStack spacing={{ base: "2", md: "3" }}>
              <Link
                as={NextLink}
                fontWeight="semibold"
                color={useColorModeValue("brand.500", "brand.300")}
                href="/breeds"
              >
                See all breeds
              </Link>
              <Icon
                as={FaArrowRight}
                color={useColorModeValue("brand.500", "brand.300")}
                fontSize={{ base: "sm", md: "md" }}
              />
            </HStack>
          </Flex>
          <SimpleGrid
            columns={{ base: 2, md: 3, lg: 4 }}
            gap={{ base: "4", md: "6", lg: "8" }}
          >
            {breedGroups.map((group) => (
              <Box
                position="relative"
                key={group.name}
                borderRadius="xl"
                overflow="hidden"
              >
                <Link>
                  <AspectRatio
                    // eslint-disable-next-line
                    ratio={1 / 1}
                    p="64px"
                  >
                    <Image
                      src={group.imageUrl}
                      alt={group.name}
                      fallback={<Skeleton />}
                      backgroundColor="brand.100"
                    />
                  </AspectRatio>
                  <Box
                    position="absolute"
                    inset="0"
                    bgGradient="linear(to-b, transparent 60%, gray.900)"
                    boxSize="full"
                  />
                  {/* <Box position="absolute" bottom="6" width="full" textAlign="center">
                      <Text color="white" fontSize="lg" fontWeight="semibold">
                        {group.name}
                      </Text>
                    </Box> */}
                </Link>
              </Box>
              // <CategoryCard key={group.name} group={group} />
            ))}
          </SimpleGrid>
        </Stack>
      </Box>
    </Container>
  </Box>
);
