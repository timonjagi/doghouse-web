import { AspectRatio, Box, SimpleGrid, Skeleton } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

// import {
//   useInfiniteHits,
//   useInstantSearch,
// } from "react-instantsearch-hooks-web";
import breeds from "../../data/breeds_with_group_and_traits.json";

import { BreedCard } from "./BreedCard";

const SearchResults = () => {
  // const { hits } = useHits();
  // const { status } = useInstantSearch();
  const [loading, setLoading] = useState(false);
  const [, setIsDrawerExpanded] = useState(false);

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

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      {loading && (
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
        {/* {status !== "idle" && breeds.length && (
          <Center>
            <Spinner size="lg" />
          </Center>
        )} */}
      </SimpleGrid>

      {/* {status === "error" && <div>Error Loading Breeds</div>} */}
    </>
  );
};

export default SearchResults;
