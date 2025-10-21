import {
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  IconButton,
  useColorModeValue,
  Alert,
  AlertIcon,
  Spinner,
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { SearchIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { useState, useMemo } from "react";
import { BreedCard } from "./BreedCard";

// Local types for now - will fix imports later
interface Breed {
  id: string;
  name: string;
  description?: string;
  breed_group?: string;
  featured_image_url?: string;
}

interface UserBreed {
  id: string;
  user_id: string;
  breed_id: string;
  is_owner: boolean;
  notes?: string;
  images?: string[];
  created_at: string;
  updated_at: string;
  breeds?: Breed;
  breeder_count: any;
}

interface BreedListProps {
  breeds: UserBreed[];
  userRole: 'breeder' | 'seeker' | 'admin';
  onEditBreed?: () => void;
}

export const BreedList = ({
  breeds,
  userRole,
  onEditBreed
}: BreedListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  // Filter breeds based on search and group
  const filteredBreeds = useMemo(() => {
    return breeds.filter((userBreed) => {
      const breed = userBreed.breeds;
      if (!breed) return false;

      const matchesSearch = breed.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        breed.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGroup = !selectedGroup || breed.breed_group === selectedGroup;

      return matchesSearch && matchesGroup;
    });
  }, [breeds, searchTerm, selectedGroup]);

  // Get unique breed groups for filter
  const breedGroups = useMemo(() => {
    const groups = new Set();
    breeds.forEach((userBreed) => {
      if (userBreed.breeds?.breed_group) {
        groups.add(userBreed.breeds.breed_group);
      }
    });
    return Array.from(groups) as string[];
  }, [breeds]);

  const handleBreedClick = (userBreed: UserBreed) => {
    if (userRole === 'breeder' && onEditBreed) {
      onEditBreed();
    }
    // For seekers, navigation to detail page will be handled by the card component
  };

  if (breeds.length === 0) {
    return (
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        {userRole === 'breeder'
          ? "No breeds added yet. Click 'Add Breed' to start offering breeds."
          : "No breeds available at the moment. Check back later for new listings."
        }
      </Alert>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Filters */}
      <HStack spacing={4} wrap="wrap">
        <InputGroup flex="1">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search breeds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Select
          placeholder="All Groups"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          maxW="200px"
        >
          {breedGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </Select>
      </HStack>

      {/* Results count */}
      <Text color="gray.600" fontSize="sm">
        Showing {filteredBreeds.length} of {breeds.length} breeds
      </Text>

      {/* Breed Grid */}
      {filteredBreeds.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredBreeds.map((userBreed) => (
            <BreedCard
              key={userBreed.id}
              userBreed={userBreed}
              userRole={userRole}
              onClick={() => handleBreedClick(userBreed)}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Center py={12}>
          <Text color="gray.500">
            No breeds found matching your criteria.
          </Text>
        </Center>
      )}
    </VStack>
  );
};
