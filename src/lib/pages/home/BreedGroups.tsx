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

import { breedGroups } from "../../data/breed_groups";
import router, { useRouter } from "next/router";
import { useState } from "react";
import { MdOutlineChevronRight } from "react-icons/md";

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

export const BreedGroups = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [selectedGroup, setSelectedGroup] = useState({} as any);
  const router = useRouter();

  const onSelectGroup = (group) => {
    console.log(group);
    setSelectedGroup(group);
    router.push(`?group=${group.name}`);
  };

  return (
    <Box as="section" w="full" bg="brand.100">
      <Container>
        <Box mx="auto" py={{ base: "6", md: "8", lg: "12" }}>
          <Stack spacing={{ base: "6", md: "8", lg: "12" }}>
            <Flex
              justify="space-between"
              align={{ base: "start", md: "center" }}
              direction={{ base: "column", md: "row" }}
            >
              <Heading
                size="lg"
                mb={{ base: "3", md: "0" }}
                color="secondary.100"
              >
                Explore groups
              </Heading>
              {/* <HStack spacing={{ base: "2", md: "3" }}>
                <Link
                  as={NextLink}
                  fontWeight="semibold"
                  color={useColorModeValue("brand.500", "brand.300")}
                  href="/breeds"
                >
                  Explore breeds
                </Link>
                <Icon
                  as={FaArrowRight}
                  color={useColorModeValue("brand.500", "brand.300")}
                  fontSize={{ base: "sm", md: "md" }}
                />
              </HStack> */}
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
                  <Link onClick={() => onSelectGroup(group)}>
                    <AspectRatio
                      // eslint-disable-next-line
                      ratio={1 / 1}
                      p="64px"
                    >
                      <Image
                        src={group.imageUrl}
                        alt={group.name}
                        fallback={<Skeleton />}
                        border="4px solid"
                        borderColor="brand.500"
                        borderRadius="xl"
                      />
                    </AspectRatio>
                    <Box
                      position="absolute"
                      inset="0"
                      boxSize="full"
                      bg="blackAlpha.200"
                      _hover={{ bg: "blackAlpha.400" }}
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
