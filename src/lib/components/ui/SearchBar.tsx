import React, { useState } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  Button,
  useColorModeValue,
  VStack,
  Text,
  Badge,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useBreeds } from '../../hooks/queries';

interface SearchBarProps {
  onSearch?: (query: string, filters: SearchFilters) => void;
  showFilters?: boolean;
  placeholder?: string;
}

interface SearchFilters {
  breed?: string;
  location?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  showFilters = true,
  placeholder = "Search for dogs, breeds, or locations..."
}) => {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const { data: breeds } = useBreeds();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('');
  const [location, setLocation] = useState('');

  const popularBreeds = breeds?.slice(0, 6) || [];

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery, {
        breed: selectedBreed,
        location,
      });
    } else {
      // Default behavior: navigate to listings page with search params
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (selectedBreed) params.set('breed', selectedBreed);
      if (location) params.set('location', location);

      router.push(`/dashboard/listings?${params.toString()}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const quickSearchBreeds = (breedId: string, breedName: string) => {
    setSelectedBreed(breedId);
    setSearchQuery(breedName);
    handleSearch();
  };

  return (
    <Box bg={bgColor} p={6} borderRadius="lg" border="1px" borderColor={borderColor}>
      <VStack spacing={4} align="stretch">
        {/* Main Search Input */}
        <HStack spacing={3}>
          <InputGroup size="lg" flex={1}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              borderRadius="md"
            />
          </InputGroup>

          {showFilters && (
            <>
              <Input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                size="lg"
                w="200px"
              />
              <Button
                colorScheme="brand"
                size="lg"
                onClick={handleSearch}
                px={8}
              >
                Search
              </Button>
            </>
          )}
        </HStack>

        {/* Popular Breeds Quick Search */}
        {showFilters && popularBreeds.length > 0 && (
          <Box>
            <Text fontSize="sm" color="gray.600" mb={2}>
              Popular breeds:
            </Text>
            <Wrap spacing={2}>
              {popularBreeds.map((breed) => (
                <WrapItem key={breed.id}>
                  <Badge
                    as="button"
                    onClick={() => quickSearchBreeds(breed.id, breed.name)}
                    cursor="pointer"
                    colorScheme="blue"
                    variant="subtle"
                    px={3}
                    py={1}
                    borderRadius="full"
                    _hover={{ bg: 'blue.100' }}
                    transition="all 0.2s"
                  >
                    {breed.name}
                  </Badge>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        )}
      </VStack>
    </Box>
  );
};
