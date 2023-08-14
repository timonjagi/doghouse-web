import {
  InputGroup,
  InputLeftElement,
  Icon,
  Input,
  Box,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { useSearchBox } from "react-instantsearch-hooks-web";

const SearchBox = () => {
  const { refine } = useSearchBox();

  return (
    <Box position="sticky" top="4" zIndex={200} w="full">
      <InputGroup>
        <InputLeftElement>
          <Icon as={FiSearch} color="muted" boxSize="5" />
        </InputLeftElement>
        <Input
          placeholder="Search breeds"
          type="search"
          onChange={(e) => refine(e.currentTarget.value)}
        />
      </InputGroup>
    </Box>
  );
};

export default SearchBox;
