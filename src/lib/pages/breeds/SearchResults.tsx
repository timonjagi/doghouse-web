import {
  AspectRatio,
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  SimpleGrid,
  Skeleton,
  Spinner,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
// import {
//   useInfiniteHits,
//   useInstantSearch,
// } from "react-instantsearch-hooks-web";

import BreedDetails from "./breed-details";
import type { Breed } from "lib/models/breed";

import { BreedCard } from "./BreedCard";

const SearchResults = () => {
  // const { hits } = useHits();
  // const { status } = useInstantSearch();
  const [selectedBreed, setSelectedBreed] = useState({} as Breed);
  const [loading, setLoading] = useState(false);
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);

  const router = useRouter();
  // eslint-disable-next-line
  const handleDrawerExpand = () => {
    setIsDrawerExpanded(!isDrawerExpanded);
  };

  // const { hits, isLastPage, showMore } = useInfiniteHits();
  const sentinelRef = useRef(null);

  // eslint-disable-next-line
  // useEffect(() => {
  //   if (sentinelRef.current !== null) {
  //     const observer = new IntersectionObserver((entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting && !isLastPage) {
  //           // Load more hits
  //           showMore();
  //         }
  //       });
  //     });

  //     observer.observe(sentinelRef.current);

  //     return () => {
  //       observer.disconnect();
  //     };
  //   }
  // }, [hits, isLastPage, showMore]);


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
      {status !== "idle" && !breeds.length && (
        <SimpleGrid
          columns={{ base: 2, md: 3, lg: 4 }}
          gap={{ base: "4", md: "6", lg: "8" }}
        >
          {[...Array(20)].map((item, index) => (
            <Box
              position="relative"
              // eslint-disable-next-line
              key={index}
              borderRadius="xl"
              overflow="hidden"
            >
              <AspectRatio ratio={1}>
                <Skeleton bg="brand.500" color="white" fadeDuration={2} />
              </AspectRatio>
            </Box>
          ))}
        </SimpleGrid>
      )}

      <SimpleGrid
        columns={{ base: 2, md: 3, lg: 4 }}
        gap={{ base: "4", md: "6", lg: "8" }}
      >
        {breeds.map((hit) => (
          <BreedCard hit={hit} />
        ))}

        <div ref={sentinelRef} aria-hidden="true" />
        {status !== "idle" && breeds.length && (
          <Center>
            <Spinner size="lg" />
          </Center>
        )}
      </SimpleGrid>

      {status === "error" && <div>Error Loading Breeds</div>}

      <Drawer
        isOpen={!!router.query.breedName}
        onClose={() => router.push("/breeds")}
        placement={isMobile ? "bottom" : "right"}
        size={isMobile ? "md" : "sm"}
      >
        <DrawerOverlay />
        <DrawerContent>
          {/* {isMobile && (
            <Button onClick={handleDrawerExpand}>
              <Icon as={isDrawerExpanded ? BsCaretDown : BsCaretUp} />
            </Button>
          )} */}
          <Box>
            <DrawerCloseButton colorScheme="brand" />
          </Box>

          <DrawerBody>
            <Box
              h={isMobile ? "auto" : "100vh"}
              maxH="70vh"
              transition="height 0.3s, width 0.3s"
            >
              <BreedDetails
                breedName={router.query.breedName as string}
                pathname={router.pathname}
                selectedBreed={selectedBreed}
                setSelectedBreed={setSelectedBreed}
                loading={loading}
                setLoading={setLoading}
                isDrawer
                isMobile
              />
            </Box>
          </DrawerBody>
          <DrawerFooter>
            {/* <Button variant="outline" mr={3} onClick={() => {}}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button> */}

            <Stack
              spacing="4"
              align="flex-end"
              justify="space-evenly"
              width="full"
            >
              <Button
                isDisabled={loading}
                color="on-accent-subtle"
                size="lg"
                width="full"
                as={Link}
                href={`/breeds/${selectedBreed?.name?.replaceAll(" ", "-")}`}
              >
                View More
              </Button>
            </Stack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SearchResults;
