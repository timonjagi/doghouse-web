import {
  InputGroup,
  InputLeftElement,
  Icon,
  Input,
  Box,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
<<<<<<< HEAD

interface SearchBoxProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBox = ({ searchTerm, onSearchChange }: SearchBoxProps) => {
=======
import { useSearchBox } from "react-instantsearch-hooks-web";

const SearchBox = () => {
  const { refine } = useSearchBox();

>>>>>>> parent of b0357f4 (feat(components): Remove app features)
  return (
    <Box position="sticky" top="4" zIndex={200} w="full">
      <InputGroup>
        <InputLeftElement>
          <Icon as={FiSearch} color="muted" boxSize="5" />
        </InputLeftElement>
        <Input
<<<<<<< HEAD
          placeholder="Search breeds by name, group, or description..."
          type="search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
=======
          placeholder="Search breeds"
          type="search"
          onChange={(e) => refine(e.currentTarget.value)}
>>>>>>> parent of b0357f4 (feat(components): Remove app features)
        />
      </InputGroup>
    </Box>
  );
};

export default SearchBox;
