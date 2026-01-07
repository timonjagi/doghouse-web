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
import { SortbySelect } from "lib/components/ui/SortBySelect";
import { MdFilterList } from "react-icons/md";
import { useRouter } from "next/router";
import { BreedCard } from "lib/components/ui/BreedCard2";
import { EmptyView } from "./EmptyView";
import * as searchService from "lib/services/searchService";
import { UserBreed, Breed } from "lib/db/schema";

// Extended type for UserBreed with joined breeds data
export type UserBreedWithBreed = UserBreed & {
  breeds?: Breed | null;
};

interface BreedListProps {
  breeds: UserBreedWithBreed[];
  userRole?: "breeder" | "seeker" | "admin";
  onEditBreed?: () => void;

  // Display options
  columns?: { base?: number; md?: number; lg?: number };
  spacing?: number;

  // Feature toggles
  showSearch?: boolean;
  showFilters?: boolean;
  showResultsCount?: boolean;
  showSort?: boolean;

  // Custom handlers
  onBreedClick?: (userBreed: UserBreedWithBreed) => void;
  onAdd?: () => void;

  // Empty state
  emptyMessage?: string;
}

export const BreedList = ({
  breeds,
  userRole = "seeker",
  onEditBreed,
  columns = { base: 1, md: 2, lg: 4 },
  spacing = 6,
  showSearch = true,
  showFilters = true,
  showResultsCount = true,
  showSort = true,
  onBreedClick,
  onAdd,
  emptyMessage,
}: BreedListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const { isOpen, onToggle, onClose, onOpen } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [showFiltersPanel, setShowFiltersPanel] = useState(
    isMobile ? false : true
  );
  const bgColor = useColorModeValue("white", "gray.800");

  const router = useRouter();

  // Filter breeds based on search and group
  const filteredBreeds = useMemo(() => {
    return breeds.filter((userBreed) => {
      const breed = userBreed.breeds;
      if (!breed) return false;

      const matchesSearch =
        !showSearch ||
        !searchTerm ||
        breed.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        breed.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGroup =
        !showFilters || !selectedGroup || breed.group === selectedGroup;

      return matchesSearch && matchesGroup;
    });
  }, [breeds, searchTerm, selectedGroup, showSearch, showFilters]);

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

  const handleBreedClick = (userBreed: UserBreedWithBreed) => {
    if (onBreedClick) {
      onBreedClick(userBreed);
    } else if (userRole === "seeker") {
      router.push(
        `/dashboard/breeds/${userBreed.breeds?.name
          ?.replace(/\s+/g, "-")
          .toLowerCase()}`
      );
    } else if (userRole === "breeder") {
      router.push(`/dashboard/breeds/${userBreed.id}`);
    }
  };

  const updateFilter = () => {
    if (isMobile) onClose();
  };

  if (breeds.length === 0) {
    return (
      <EmptyView
        title={
          userRole === "seeker" ? "No breeds found" : "No breeds available"
        }
        description={
          userRole === "seeker"
            ? "Clear your search criteria to find breeds."
            : "Check back later for new listings."
        }
        ctaText={userRole === "seeker" ? "Clear Search" : "Add Breed"}
        ctaAction={
          userRole === "seeker"
            ? () => searchService.resetSearchAndFilters()
            : () => router.push("/dashboard/breeds/add")
        }
      />
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Filters */}
      {(showSearch || showFilters) && (
        <HStack spacing={4}>
          {showFilters && isMobile ? (
            <IconButton
              aria-label="Filter"
              icon={<MdFilterList />}
              onClick={onToggle}
            />
          ) : showFilters ? (
            <Select
              placeholder="All Groups"
              value={selectedGroup}
              onChange={(e) => {
                setSelectedGroup(e.target.value);
              }}
              maxW="200px"
            >
              {breedGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </Select>
          ) : null}

          {showSearch && (
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
          )}
        </HStack>
      )}

      {(showResultsCount || showSort) && (
        <HStack spacing={4} justify="space-between">
          {showResultsCount && (
            <Text color="gray.600" fontSize="sm">
              Showing {filteredBreeds.length} of {breeds.length} breeds
            </Text>
          )}
          {showSort && (
            <SortbySelect width="120px" defaultValue="23" placeholder="Sort" />
          )}
        </HStack>
      )}

      {filteredBreeds.length > 0 || (onAdd && !searchTerm && !selectedGroup) ? (
        <SimpleGrid columns={columns} spacing={spacing}>
          {filteredBreeds.map((userBreed) => (
            <BreedCard
              key={userBreed.id}
              userBreed={userBreed}
              onClick={() => handleBreedClick(userBreed)}
            />
          ))}

          {onAdd && (
            <Card
              height="100%"
              minH="300px"
              cursor="pointer"
              onClick={onAdd}
              borderStyle="dashed"
              borderWidth="2px"
              borderColor="gray.300"
              _hover={{ borderColor: "brand.500", shadow: "md" }}
              bg="transparent"
            >
              <CardBody
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <IconButton
                  aria-label="Add breed"
                  icon={<SearchIcon transform="rotate(45deg)" />} // Using SearchIcon rotated as plus for now, or fetch FiPlus
                  fontSize="3xl"
                  variant="ghost"
                  colorScheme="brand"
                  isRound
                  onClick={onAdd}
                  mb={4}
                />
                <Text fontWeight="bold" fontSize="lg" color="gray.600">
                  Add New Breed
                </Text>
              </CardBody>
            </Card>
          )}
        </SimpleGrid>
      ) : (
        <Center py={12}>
          <Text color="gray.500">No breeds found matching your criteria.</Text>
        </Center>
      )}

      {showFilters && (
        <Drawer
          isOpen={isOpen}
          placement="bottom"
          onClose={onClose}
          preserveScrollBarGap
        >
          <DrawerOverlay />
          <DrawerContent>
            <Filters
              bgColor={bgColor}
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              breedGroups={breedGroups}
              isMobile={isMobile}
              clearFilters={() => {
                setSelectedGroup("");
                onClose();
              }}
              onClose={onClose}
            />
          </DrawerContent>
        </Drawer>
      )}
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

const Filters = ({
  bgColor,
  selectedGroup,
  setSelectedGroup,
  breedGroups,
  isMobile,
  clearFilters,
  onClose,
}: FilterProps) => {
  return (
    <Card
      minW="200px"
      maxW={{ base: "100%", md: "300px" }}
      bg={bgColor}
      mr={{ base: 0, md: 4 }}
      borderRadius="lg"
      boxShadow="none"
    >
      <CardHeader>
        <HStack justify="space-between" align="center">
          <Text fontSize="lg" fontWeight="semibold">
            Filters
          </Text>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear
          </Button>
        </HStack>
      </CardHeader>
      <CardBody>
        <Stack spacing={4}>
          <Stack>
            <Text fontWeight="semibold" fontSize="md">
              Breed Group
            </Text>
            <Select
              placeholder="All Groups"
              value={selectedGroup}
              onChange={(e) => {
                setSelectedGroup(e.target.value);
                if (isMobile) onClose();
              }}
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
  );
};
