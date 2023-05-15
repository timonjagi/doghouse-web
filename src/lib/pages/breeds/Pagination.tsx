import {
  Pagination,
  PaginationContainer,
  PaginationNext,
  PaginationPage,
  PaginationPageGroup,
  PaginationPrevious,
  PaginationSeparator,
  usePagination,
} from "@ajna/pagination";
import { Stack, Text } from "@chakra-ui/react";
import { usePagination as useInstantSearchPagination } from "react-instantsearch-hooks-web";

const ListPagination = () => {
  const {
    pages,
    currentRefinement,
    nbHits,
    nbPages,
    isFirstPage,
    isLastPage,
    refine,
  } = useInstantSearchPagination();

  const { setCurrentPage, isDisabled } = usePagination({
    total: nbHits,
    limits: {
      outer: 20,
      inner: 10,
    },
    initialState: {
      pageSize: 3,
      isDisabled: false,
      currentPage: 0,
    },
  });

  return (
    <Stack>
      <Pagination
        pagesCount={nbPages}
        currentPage={currentRefinement}
        isDisabled={isDisabled}
        onPageChange={() => {}}
      >
        <PaginationContainer
          align="center"
          justify="space-between"
          p={4}
          w="full"
        >
          <PaginationPrevious
            _hover={{
              bg: "brand.300",
            }}
            isDisabled={isFirstPage}
            onClick={() => refine(currentRefinement - 1)}
          >
            <Text>Previous</Text>
          </PaginationPrevious>

          <PaginationPageGroup
            isInline
            align="center"
            separator={
              <PaginationSeparator
                onClick={() => setCurrentPage(0)}
                bg="brand.300"
                fontSize="sm"
                w={7}
                jumpSize={11}
              />
            }
          >
            {pages.map((page: number) => (
              <PaginationPage
                w={10}
                key={`pagination_page_${page}`}
                page={page}
                onClick={() => refine(page)}
                fontSize="sm"
                _hover={{
                  bg: "brand.300",
                }}
                _current={{
                  bg: "brand.300",
                  fontSize: "sm",
                  w: 10,
                }}
              />
            ))}
          </PaginationPageGroup>

          <PaginationNext
            _hover={{
              bg: "brand.300",
            }}
            isDisabled={isLastPage}
            onClick={() => refine(currentRefinement + 1)}
          >
            <Text>Next</Text>
          </PaginationNext>
        </PaginationContainer>
      </Pagination>
    </Stack>
  );
};

export default ListPagination;
