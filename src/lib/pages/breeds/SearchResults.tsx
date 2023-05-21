import {
  AspectRatio,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  Icon,
  SimpleGrid,
  Skeleton,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { useHits, useInstantSearch } from "react-instantsearch-hooks-web";

import BreedDetails from "../breed-details";
import type { Breed } from "lib/models/breed";

import { BreedCard } from "./BreedCard";

const SearchResults = () => {
  const { hits } = useHits();
  const { status } = useInstantSearch();
  const [selectedBreed, setSelectedBreed] = useState({} as Breed);
  const [loading, setLoading] = useState(false);
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);

  const router = useRouter();
  // eslint-disable-next-line
  const handleDrawerExpand = () => {
    setIsDrawerExpanded(!isDrawerExpanded);
  };

  return (
    <>
      {status !== "idle" && (
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

      {status === "idle" && (
        <SimpleGrid
          columns={{ base: 2, md: 3, lg: 4 }}
          gap={{ base: "4", md: "6", lg: "8" }}
        >
          {hits.map((hit) => (
            <BreedCard hit={hit} status={status} />
          ))}
        </SimpleGrid>
      )}

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
              h={isDrawerExpanded ? "100vh" : "auto"}
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
                variant="outline"
                fontSize="md"
                width="full"
                leftIcon={<Icon as={FiHeart} boxSize="4" />}
                isDisabled={loading}
              >
                Favorite
              </Button>
              <Button
                isDisabled={loading}
                colorScheme="blue"
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
