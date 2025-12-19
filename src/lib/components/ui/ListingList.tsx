import React, { useState, useMemo } from 'react';
import {
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Center,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select as ChakraSelect,
  NumberInput,
  NumberInputField,
  FormControl,
  FormLabel,
  Wrap,
  WrapItem,
  Badge,
  Stack,
  useBreakpointValue,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
  Card,
  CardBody,
  CardHeader,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { MdFilterList } from 'react-icons/md';
import ListingCard from 'lib/components/ui/ListingCard';
import { Select } from 'chakra-react-select';
import { EmptyView } from './EmptyView';
import * as searchService from 'lib/services/searchService';

interface FilterState {
  search: string;
  breed: any;
  location: string;
  minPrice: string;
  maxPrice: string;
  type: string;
}

interface ListingListProps {
  // Data
  listings: any[];

  // Loading/Error states
  isLoading?: boolean;
  error?: any;

  // Display options
  columns?: { base?: number; md?: number; lg?: number; xl?: number };
  spacing?: number;

  // Feature toggles
  showSearch?: boolean;
  showFilters?: boolean;
  showResultsCount?: boolean;

  // Filter options (for when filters are shown)
  breeds?: Array<{ id: string; name: string }>;
  breedsLoading?: boolean;

  // Custom handlers
  onListingClick?: (listingId: string) => void;

  // Empty state
  emptyMessage?: string;
  emptyDescription?: string;
  showEmptyAction?: boolean;
  onEmptyAction?: () => void;
  emptyActionComponent?: React.ReactNode;
  emptyActionLabel?: string;
  emptyActionIcon?: any;
}

export const ListingList: React.FC<ListingListProps> = ({
  listings,
  isLoading = false,
  error,
  columns = { base: 1, md: 2, lg: 3, xl: 4 },
  spacing = 6,
  showSearch = true,
  showFilters = true,
  showResultsCount = true,
  breeds,
  breedsLoading = false,
  onListingClick,
  emptyMessage = "No listings found.",
  emptyDescription = "Clear your search criteria to find listings.",
  showEmptyAction = false,
  onEmptyAction,
  emptyActionComponent = null,
  emptyActionLabel = "Clear Filters",
  emptyActionIcon = null
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    breed: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    type: '',
  });

  const { isOpen, onToggle, onClose } = useDisclosure();

  // Filter listings client-side
  const filteredListings = useMemo(() => {
    if (!listings) return [];

    return listings.filter(listing => {
      // Search filter
      if (showSearch && filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          listing.title?.toLowerCase().includes(searchTerm) ||
          listing.description?.toLowerCase().includes(searchTerm);

        if (!matchesSearch) return false;
      }

      // Location filter
      if (showFilters && filters.location) {
        const locationTerm = filters.location.toLowerCase();
        if (!listing.location_text?.toLowerCase().includes(locationTerm)) {
          return false;
        }
      }

      // Price range filter
      if (showFilters && filters.minPrice && listing.price && listing.price < parseInt(filters.minPrice)) {
        return false;
      }
      if (showFilters && filters.maxPrice && listing.price && listing.price > parseInt(filters.maxPrice)) {
        return false;
      }

      // Breed filter
      if (showFilters && filters.breed && listing.breed_id !== filters.breed.value) {
        return false;
      }

      // Type filter
      if (showFilters && filters.type && listing.type !== filters.type) {
        return false;
      }

      return true;
    });
  }, [listings, filters, showSearch, showFilters]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (isMobile) onClose();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      breed: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      type: '',
    });
    if (isMobile) onClose();
  };

  const handleListingClick = (listingId: string) => {
    if (onListingClick) {
      onListingClick(listingId);
    }
  };

  const hasActiveFilters = filters.breed || filters.location || filters.minPrice || filters.maxPrice || filters.type;

  if (!listings || listings.length === 0) {
    return (
      <EmptyView
        title={emptyMessage}
        description={emptyDescription}
        ctaText={emptyActionLabel}
        ctaAction={onEmptyAction}
        ctaIcon={emptyActionIcon}
        ctaComponent={emptyActionComponent}
      />
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Search Bar */}
      {(showSearch || showFilters) && (
        <HStack justify="space-between" align="center">
          {showFilters && isMobile && (
            <IconButton
              aria-label="Filter"
              icon={<MdFilterList />}
              onClick={onToggle}
            />
          )}

          {showSearch && (
            <InputGroup size="md" flex="1">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search listings..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                disabled={isLoading || breedsLoading}
              />
            </InputGroup>
          )}
        </HStack>
      )}

      {/* Desktop Filters */}
      {!isMobile && showFilters && (
        <Filters
          bgColor={bgColor}
          filters={filters}
          updateFilter={updateFilter}
          breeds={breeds}
          breedsLoading={breedsLoading}
          listingsLoading={isLoading}
        />
      )}

      {/* Active Filters Display */}
      {showFilters && hasActiveFilters && (
        <ActiveFilters filters={filters} clearFilters={clearFilters} breeds={breeds} />
      )}

      {/* Results Count */}
      {showResultsCount && (
        <Text color="gray.600">
          {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''} found
        </Text>
      )}

      {/* Listings Grid */}
      {filteredListings.length > 0 ? (
        <SimpleGrid columns={columns} spacing={spacing}>
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              handleListingClick={handleListingClick}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Center py={12}>
          <VStack spacing={4}>
            <Text fontSize="lg" color="gray.500">No listings found</Text>
            <Text color="gray.400" textAlign="center" maxW="md">
              Try adjusting your filters or search terms to find more results.
            </Text>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </VStack>
        </Center>
      )}

      {/* Mobile Filter Drawer */}
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
              filters={filters}
              updateFilter={updateFilter}
              breeds={breeds}
              breedsLoading={breedsLoading}
              listingsLoading={isLoading}
              isMobile={isMobile}
              clearFilters={clearFilters}
            />
          </DrawerContent>
        </Drawer>
      )}
    </VStack>
  );
};

interface FilterProps {
  bgColor: string;
  filters: FilterState;
  updateFilter: (key: keyof FilterState, value: any) => void;
  breedsLoading: boolean;
  listingsLoading: boolean;
  breeds: Array<{ id: string; name: string }> | undefined;
  isMobile?: boolean;
  clearFilters?: () => void;
}

const Filters = ({
  bgColor,
  filters,
  updateFilter,
  breedsLoading,
  listingsLoading,
  breeds,
  isMobile,
  clearFilters
}: FilterProps) => {
  return (
    <Card bg={bgColor} borderRadius="lg" boxShadow="none">
      {isMobile && (
        <CardHeader>
          <HStack justify="space-between" align="center">
            <Text fontSize="lg" fontWeight="semibold">Filters</Text>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear
            </Button>
          </HStack>
        </CardHeader>
      )}
      <CardBody>
        <Stack spacing={4} direction={{ base: 'column', md: 'row' }}>
          {isMobile && <ActiveFilters filters={filters} clearFilters={clearFilters!} breeds={breeds!} isMobile={isMobile} />}

          <FormControl>
            <FormLabel>Breed</FormLabel>
            <Select
              placeholder="All breeds"
              value={filters.breed}
              onChange={(e) => updateFilter('breed', e)}
              isDisabled={breedsLoading || listingsLoading}
              //@ts-ignore
              options={breeds?.map(breed => ({ label: breed.name, value: breed.id }))}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Location</FormLabel>
            <Input
              placeholder="e.g., Nairobi"
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Min Price (KSH)</FormLabel>
            <NumberInput
              value={filters.minPrice}
              onChange={(value) => updateFilter('minPrice', value)}
            >
              <NumberInputField placeholder="0" />
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Max Price (KSH)</FormLabel>
            <NumberInput
              value={filters.maxPrice}
              onChange={(value) => updateFilter('maxPrice', value)}
            >
              <NumberInputField placeholder="No limit" />
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Type</FormLabel>
            <ChakraSelect
              placeholder="All types"
              value={filters.type}
              onChange={(e) => updateFilter('type', e.target.value)}
              disabled={breedsLoading || listingsLoading}
            >
              <option value="litter">Litter</option>
              <option value="single_pet">Single Pet</option>
            </ChakraSelect>
          </FormControl>
        </Stack>
      </CardBody>
    </Card>
  );
};

interface ActiveFiltersProps {
  filters: FilterState;
  clearFilters: () => void;
  breeds: Array<{ id: string; name: string }> | undefined;
  isMobile?: boolean;
}

const ActiveFilters = ({ filters, clearFilters, breeds, isMobile }: ActiveFiltersProps) => {
  return (
    <HStack justify="space-between">
      {/* Active Filters Display */}
      {(filters.breed || filters.location || filters.minPrice || filters.maxPrice || filters.type) && (
        <Wrap spacing={2}>
          <WrapItem>
            <Text fontSize="sm" color="gray.600">Active filters:</Text>
          </WrapItem>
          {filters.breed && (
            <WrapItem>
              <Badge colorScheme="blue" variant="subtle">
                Breed: {breeds?.find(b => b.id === filters.breed.value)?.name}
              </Badge>
            </WrapItem>
          )}
          {filters.location && (
            <WrapItem>
              <Badge colorScheme="green" variant="subtle">
                Location: {filters.location}
              </Badge>
            </WrapItem>
          )}
          {filters.minPrice && (
            <WrapItem>
              <Badge colorScheme="purple" variant="subtle">
                Min: KSH {filters.minPrice}
              </Badge>
            </WrapItem>
          )}
          {filters.maxPrice && (
            <WrapItem>
              <Badge colorScheme="purple" variant="subtle">
                Max: KSH {filters.maxPrice}
              </Badge>
            </WrapItem>
          )}
          {filters.type && (
            <WrapItem>
              <Badge colorScheme="orange" variant="subtle">
                Type: {filters.type === 'litter' ? 'Litter' : 'Single Pet'}
              </Badge>
            </WrapItem>
          )}
        </Wrap>
      )}

      {!isMobile &&
        (filters.breed || filters.location || filters.minPrice || filters.maxPrice || filters.type) && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All Filters
          </Button>
        )
      }
    </HStack>
  );
};

export default ListingList;
