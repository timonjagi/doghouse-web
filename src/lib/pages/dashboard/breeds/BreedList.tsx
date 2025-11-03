import {
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Alert,
  AlertIcon,
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useDisclosure,
  Button,
  IconButton,
  useBreakpointValue,
  Card,
  CardBody,
  CardHeader,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Heading,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useState, useMemo } from "react";
import { BreedCard } from "./BreedCard";
import { SortbySelect } from "lib/pages/breeds/SortBySelect";
import { MdFilterList } from "react-icons/md";

// Local types for now - will fix imports later
interface Breed {
  id: string;
  name: string;
  description?: string;
  group?: string;
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
  const { isOpen, onToggle, onClose, onOpen } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [showFilters, setShowFilters] = useState(isMobile ? false : true);
  const bgColor = useColorModeValue('white', 'gray.800');


  // Filter breeds based on search and group
  const filteredBreeds = useMemo(() => {
    return breeds.filter((userBreed) => {
      const breed = userBreed.breeds;
      if (!breed) return false;

      const matchesSearch = breed.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        breed.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGroup = !selectedGroup || breed.group === selectedGroup;

      return matchesSearch && matchesGroup;
    });
  }, [breeds, searchTerm, selectedGroup]);

  // Get unique breed groups for filter
  const breedGroups = useMemo(() => {
    const groups = new Set();
    breeds.forEach((userBreed) => {
      if (userBreed.breeds?.group) {
        groups.add(userBreed.breeds.group);
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
  const updateFilter = () => {
    // setFilters(prev => ({ ...prev, [key]: value }));
    if (isMobile) onClose();
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
      <HStack spacing={4} >

        {/* */}

        <IconButton
          aria-label="Filter"
          icon={<MdFilterList />}
          onClick={isMobile ? onToggle : () => setShowFilters(!showFilters)}

        />

        <InputGroup flex="1" minW="50vw">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search breeds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        {/* Results count */}

        {/* 
        <HStack
          as="button"
          fontSize="sm"
          type="button"
          px="3"
          py="1"
          onClick={onOpen}
          borderWidth="1px"
          rounded="md"
        >
          <Icon as={MdFilterList} />
          <Text>Filters</Text>
        </HStack> */}


      </HStack>

      <HStack spacing={4} justify="space-between">
        {/* Results count */}
        <Text color="gray.600" fontSize="sm">
          Showing {filteredBreeds.length} of {breeds.length} breeds
        </Text>
        <SortbySelect
          width="120px"
          defaultValue="23"
          placeholder="Sort"
        />

      </HStack>

      <HStack flex={1} align="start">
        {showFilters && !isMobile && (<Filters bgColor={bgColor} selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} breedGroups={breedGroups} isMobile={isMobile} clearFilters={() => setSelectedGroup('')} />)}

        {filteredBreeds.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: showFilters ? 2 : 3 }} spacing={6}>
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
      </HStack>
      {/* Breed Grid */}


      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onClose={onClose}
        preserveScrollBarGap

      >
        <DrawerOverlay />
        <DrawerContent>
          <Filters bgColor={bgColor} selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} breedGroups={breedGroups} isMobile={isMobile} clearFilters={() => { setSelectedGroup(''); onClose() }} onClose={onClose} />
        </DrawerContent>
      </Drawer>
    </VStack>
  );
};

interface FilterProps {
  bgColor: string;
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
  breedGroups: string[];
  isMobile: boolean;
  clearFilters: () => void;
  onClose?: () => void;
}

const Filters = ({ bgColor, selectedGroup, setSelectedGroup, breedGroups, isMobile, clearFilters, onClose }: FilterProps) => {
  return (
    <Card minW="200px" maxW={{ base: '100%', md: '300px' }} bg={bgColor} mr={{ base: 0, md: 4 }} borderRadius="lg" boxShadow="none">
      <CardHeader >
        <HStack justify="space-between" align="center">

          <Text fontSize="lg" fontWeight="semibold">Filters</Text>
          <Button variant="ghost" size="sm" onClick={clearFilters}
          >Clear</Button>
        </HStack>

      </CardHeader>
      <CardBody>

        <Stack spacing={4}>
          <Stack>
            <Text fontWeight="semibold" fontSize="md">Breed Group</Text>

            <Select
              placeholder="All Groups"
              value={selectedGroup}
              onChange={(e) => { setSelectedGroup(e.target.value); if (isMobile) onClose(); }}
            >
              {breedGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </Select>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  )
};

// interface ActiveFiltersProps {
//   filters: FilterState;
//   clearFilters: () => void;
//   breeds: Array<{ id: string; name: string }> | undefined;
//   isMobile?: boolean;
// }

// const ActiveFilters = ({ filters, clearFilters, breeds, isMobile }: ActiveFiltersProps) => {
//   return <HStack justify="space-between" >
//     {/* Active Filters Display */}
//     {
//       (filters.breed || filters.location || filters.minPrice || filters.maxPrice || filters.type) && (
//         <Wrap spacing={2}>
//           <WrapItem>
//             <Text fontSize="sm" color="gray.600">Active filters:</Text>
//           </WrapItem>
//           {filters.breed && (
//             <WrapItem>
//               <Badge colorScheme="blue" variant="subtle">
//                 Breed: {breeds?.find(b => b.id === filters.breed.value)?.name}
//               </Badge>
//             </WrapItem>
//           )}
//           {filters.location && (
//             <WrapItem>
//               <Badge colorScheme="green" variant="subtle">
//                 Location: {filters.location}
//               </Badge>
//             </WrapItem>
//           )}
//           {filters.minPrice && (
//             <WrapItem>
//               <Badge colorScheme="purple" variant="subtle">
//                 Min: KSH {filters.minPrice}
//               </Badge>
//             </WrapItem>
//           )}
//           {filters.maxPrice && (
//             <WrapItem>
//               <Badge colorScheme="purple" variant="subtle">
//                 Max: KSH {filters.maxPrice}
//               </Badge>
//             </WrapItem>
//           )}
//           {filters.type && (
//             <WrapItem>
//               <Badge colorScheme="orange" variant="subtle">
//                 Type: {filters.type === 'litter' ? 'Litter' : 'Single Pet'}
//               </Badge>
//             </WrapItem>
//           )}
//         </Wrap>
//       )
//     }

//     {!isMobile &&
//       (filters.group ) && (
//         <Button variant="ghost" size="sm" onClick={clearFilters}>
//           Clear All Filters
//         </Button>
//       )
//     }
//   </HStack >;
// }