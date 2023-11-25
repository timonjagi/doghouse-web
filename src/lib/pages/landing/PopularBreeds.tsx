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
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useBreakpointValue,
  DrawerBody,
  DrawerCloseButton,
  Text,
  Button,
  DrawerFooter,
  DrawerHeader,
} from "@chakra-ui/react";
import NextLink from "next/link";
// import * as React from "react";
import { FaArrowRight } from "react-icons/fa";

// @ts-ignore
import breedGroups from "../../data/breed-groups_2.json";
import router, { useRouter } from "next/router";
import { useState } from "react";
import { MdOutlineChevronRight } from "react-icons/md";
import breeds from "../../data/breeds_with_group.json";
import { BreedCard } from "../breeds/BreedCard";

export const PopularBreeds = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [selectedGroup, setSelectedGroup] = useState({} as any);
  const router = useRouter();
  const popularBreeds = breeds.filter((breed) =>
    [
      "german shepherd dog",
      "japanese spitz",
      "golden retriever",
      "labrador retreiver",
      "maltese",
      "siberian husky",
      "rottweiler",
      "boerboel",
      "beagle",
    ].includes(breed.name)
  );
  console.log(popularBreeds);
  const onSelectGroup = (group) => {
    console.log(group);
    setSelectedGroup(group);
    router.push(`?group=${group.name}`);
  };

  return (
    <Box as="section" w="full" bg="bg-accent">
      <Container>
        <Box mx="auto" py={{ base: "6", md: "8", lg: "12" }}>
          <Stack spacing={{ base: "6", md: "8", lg: "12" }}>
            <Flex
              justify="space-between"
              align={{ base: "start", md: "center" }}
              direction={{ base: "column", md: "row" }}
            >
              <Heading size="lg" mb={{ base: "3", md: "0" }} color="white">
                Popular breeds
              </Heading>
              <HStack spacing={{ base: "2", md: "3" }}>
                <Link
                  as={NextLink}
                  fontWeight="semibold"
                  color={useColorModeValue("brand.100", "brand.300")}
                  href="/breeds"
                >
                  More breeds
                </Link>
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
              {popularBreeds.map((breed) => (
                <BreedCard hit={breed} />
              ))}
            </SimpleGrid>
          </Stack>
        </Box>

        <Drawer
          isOpen={!!router.query.group}
          onClose={() => router.push("/")}
          placement={isMobile ? "bottom" : "right"}
          size={isMobile ? "md" : "sm"}
        >
          <DrawerOverlay />

          <Box
            h={isMobile ? "auto" : "100%"}
            transition="height 0.3s, width 0.3s"
          >
            <DrawerContent>
              <DrawerCloseButton></DrawerCloseButton>
              <DrawerHeader>
                <Heading size="sm">{selectedGroup.name} Group</Heading>
              </DrawerHeader>
              <DrawerBody>
                <Flex width="full">
                  <Stack spacing="6">
                    <Image
                      height={isMobile ? "auto" : "auto"}
                      width="100%"
                      objectFit="cover"
                      src={selectedGroup.imageUrl}
                      alt={selectedGroup.name}
                      fallback={<Skeleton />}
                    />

                    <Text
                      size="2rem"
                      color="brand.600"
                      noOfLines={isMobile ? [6, 10] : []}
                    >
                      {selectedGroup.short_desc}
                    </Text>
                  </Stack>
                </Flex>
              </DrawerBody>

              <DrawerFooter>
                <Button colorScheme="brand" size="lg" w="full">
                  View Group
                  <Icon as={MdOutlineChevronRight} w="4" h="4" />
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Box>
        </Drawer>
      </Container>
    </Box>
  );
};
