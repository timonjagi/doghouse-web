import { SimpleGrid } from "@chakra-ui/react";
import { useHits, useInstantSearch } from "react-instantsearch-hooks-web";

import { BreedCard } from "./BreedCard";

const SearchResults = () => {
  const { hits } = useHits();
  const { status } = useInstantSearch();

  return (
    <SimpleGrid
      columns={{ base: 2, md: 3, lg: 4 }}
      gap={{ base: "4", md: "6", lg: "8" }}
    >
      {hits.map((hit) => (
        <BreedCard hit={hit} status={status} />
      ))}
    </SimpleGrid>
  );
};

export default SearchResults;
