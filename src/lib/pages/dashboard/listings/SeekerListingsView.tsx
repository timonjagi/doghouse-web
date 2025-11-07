import React, { useState, useMemo } from 'react';
import {
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Select as ChakraSelect,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  Box,
  useColorModeValue,
  Center,
  FormControl,
  FormLabel,
  Wrap,
  WrapItem,
  IconButton,
  useToast,
  Stack,
  useBreakpointValue,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
  CardBody,
  CardHeader,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useUserProfile } from '../../../hooks/queries';
import { useListings, useIncrementListingViews } from '../../../hooks/queries/useListings';
import { useBreeds } from '../../../hooks/queries/useBreeds';
import { NextSeo } from 'next-seo';
import { Loader } from 'lib/components/ui/Loader';
import { MdFilterList } from 'react-icons/md';
import ListingCard from './ListingCard';
import { Select } from 'chakra-react-select';
import { User } from '../../../../../db/schema';

interface FilterState {
  search: string;
  breed: any;
  location: string;
  minPrice: string;
  maxPrice: string;
  type: string;
  status: string;
}

const BrowseListingsPage: React.FC<{ userProfile: User }> = ({ userProfile }) => {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const isMobile = useBreakpointValue({ base: true, md: false });

  const { data: breeds, isLoading: breedsLoading } = useBreeds();
  const incrementViewsMutation = useIncrementListingViews();

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    breed: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    type: '',
    status: 'available',
  });

  const [showFilters, setShowFilters] = useState(isMobile ? false : true);

  // Build query filters for the hook
  const queryFilters = useMemo(() => {
    const queryParams: any = {
      status: 'available',
      owner_type: 'breeder'
    };

    if (filters.breed) queryParams.breed_id = filters.breed.value;
    if (filters.type) queryParams.type = filters.type;

    return queryParams;
  }, [filters.breed, filters.type]);

  const { data: listings, isLoading: listingsLoading } = useListings(queryFilters);
  const { isOpen, onToggle, onClose } = useDisclosure();

  // Filter listings client-side for search, location, and price
  const filteredListings = useMemo(() => {
    if (!listings) return [];

    return listings.filter(listing => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          listing.title.toLowerCase().includes(searchTerm) ||
          listing.description?.toLowerCase().includes(searchTerm);

        if (!matchesSearch) return false;
      }

      // Location filter
      if (filters.location) {
        const locationTerm = filters.location.toLowerCase();
        if (!listing.location_text?.toLowerCase().includes(locationTerm)) {
          return false;
        }
      }

      // Price range filter
      if (filters.minPrice && listing.price && listing.price < parseInt(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && listing.price && listing.price > parseInt(filters.maxPrice)) {
        return false;
      }

      return true;
    });
  }, [listings, filters]);


  const handleListingClick = async (listingId: string) => {
    // Increment view count
    try {
      await incrementViewsMutation.mutateAsync(listingId);
    } catch (error) {
      console.error('Failed to increment views:', error);
    }

    // Navigate to detail page
    router.push(`/dashboard/listings/${listingId}`);
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
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
      status: 'available',
    });
    if (isMobile) onClose();
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Price not set';
    return `KSH ${price.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'green';
      case 'reserved': return 'yellow';
      case 'sold': return 'red';
      default: return 'gray';
    }
  };


  return (
    <>
      <NextSeo title="Browse Listings | DogHouse" />

      <Container maxW="7xl" py={4}>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size={{ base: 'sm', lg: 'md' }} mb={2} >Browse Available Pets</Heading>
            <Text color="gray.600">Find your perfect companion from verified breeders</Text>
          </Box>


          <VStack spacing={4} align="stretch">
            {/* Search Bar */}
            <HStack justify="space-between" align="center">
              <Button
                as={IconButton}
                icon={<MdFilterList />}
                onClick={isMobile ? onToggle : () => setShowFilters(!showFilters)}

              >
              </Button>
              <InputGroup size="md">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search listings..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  disabled={listingsLoading || breedsLoading}
                />
              </InputGroup>
            </HStack>

            <ActiveFilters filters={filters} clearFilters={clearFilters!} breeds={breeds!} />
          </VStack>
          {/* Results Count */}
          <HStack justify="space-between">
            <Text color="gray.600">
            </Text>
          </HStack>
          {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''} found
        </VStack>

        <HStack align="start">
          {/* Advanced Filters */}
          {showFilters && !isMobile && (
            <Filters bgColor={bgColor} filters={filters} updateFilter={updateFilter} breeds={breeds} breedsLoading={breedsLoading} listingsLoading={listingsLoading} />
          )}

          <Stack flex={1} >
            {listingsLoading || breedsLoading && (
              <Center h="400px">
                <Loader />
              </Center>
            )}


            {/* Listings Grid */}
            {!listingsLoading && !breedsLoading && filteredListings.length === 0 ? (
              <Center h="300px" bg={bgColor} borderRadius="lg" border="2px dashed" borderColor="gray.300" p={8}>
                <VStack spacing={4}>
                  <Text fontSize="lg" color="gray.500">No listings found</Text>
                  <Text color="gray.400" textAlign="center" maxW="md">
                    Try adjusting your filters or search terms to find more results.
                  </Text>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </VStack>
              </Center>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: showFilters ? 2 : 3 }} spacing={4}>
                {!listingsLoading && !breedsLoading && filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    handleListingClick={handleListingClick}
                    formatPrice={formatPrice}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </SimpleGrid>
            )}
          </Stack>
        </HStack>

        <Drawer
          isOpen={isOpen}
          placement="bottom"
          onClose={onClose}
          preserveScrollBarGap

        >
          <DrawerOverlay />
          <DrawerContent>
            <Filters bgColor={bgColor} filters={filters} updateFilter={updateFilter} breeds={breeds} breedsLoading={breedsLoading} listingsLoading={listingsLoading} isMobile={isMobile} clearFilters={clearFilters} />
          </DrawerContent>
        </Drawer>
      </Container >
    </>
  );
};

export default BrowseListingsPage;

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

const Filters = ({ bgColor, filters, updateFilter, breedsLoading, listingsLoading, breeds, isMobile, clearFilters }: FilterProps) => {
  return (
    <Card minW="200px" maxW="300px" bg={bgColor} mr={{ base: 0, md: 4 }} borderRadius="lg">
      {isMobile && <CardHeader >
        <HStack justify="space-between" align="center">

          <Heading size="xs">Filters</Heading>
          <Button variant="ghost" size="sm" onClick={clearFilters}
          >Clear</Button>
        </HStack>

      </CardHeader>}
      <CardBody>

        <Stack spacing={4}>
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
  )
};

interface ActiveFiltersProps {
  filters: FilterState;
  clearFilters: () => void;
  breeds: Array<{ id: string; name: string }> | undefined;
  isMobile?: boolean;
}

const ActiveFilters = ({ filters, clearFilters, breeds, isMobile }: ActiveFiltersProps) => {
  return <HStack justify="space-between" >
    {/* Active Filters Display */}
    {
      (filters.breed || filters.location || filters.minPrice || filters.maxPrice || filters.type) && (
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
      )
    }

    {!isMobile &&
      (filters.breed || filters.location || filters.minPrice || filters.maxPrice || filters.type) && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear All Filters
        </Button>
      )
    }
  </HStack >;
}