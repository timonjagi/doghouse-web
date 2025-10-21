import {
  InputGroup,
  InputLeftElement,
  Icon,
  Input,
  Box,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";

interface SearchBoxProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBox = ({ searchTerm, onSearchChange }: SearchBoxProps) => {
  return (
    <Box position="sticky" top="4" zIndex={200} w="full">
      <InputGroup>
        <InputLeftElement>
          <Icon as={FiSearch} color="muted" boxSize="5" />
        </InputLeftElement>
        <Input
          placeholder="Search breeds by name, group, or description..."
          type="search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </InputGroup>
    </Box>
  );
};

export default SearchBox;
