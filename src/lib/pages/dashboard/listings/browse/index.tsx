import React, { useState, useMemo } from 'react';
import {
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  Image,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  Box,
  useColorModeValue,
  Spinner,
  Center,
  FormControl,
  FormLabel,
  Wrap,
  WrapItem,
  IconButton,
  useToast,
  Stack,
  Divider,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { SettingsIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useUserProfile } from '../../../../hooks/queries';
import { useListings, useIncrementListingViews } from '../../../../hooks/queries/useListings';
import { useBreeds } from '../../../../hooks/queries/useBreeds';
import { NextSeo } from 'next-seo';
import { Loader } from 'lib/components/ui/Loader';
import { MdFilterList } from 'react-icons/md';
import ListingCard from './ListingCard';

interface FilterState {
  search: string;
  breed: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  type: string;
  status: string;
}

const BrowseListingsPage: React.FC = () => {
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const router = useRouter();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');

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

  const [showFilters, setShowFilters] = useState(false);

  // Build query filters for the hook
  const queryFilters = useMemo(() => {
    const queryParams: any = {
      status: 'available',
      owner_type: 'breeder'
    };

    if (filters.breed) queryParams.breed_id = filters.breed;
    if (filters.type) queryParams.type = filters.type;

    return queryParams;
  }, [filters.breed, filters.type]);

  const { data: listings, isLoading: listingsLoading } = useListings(queryFilters);

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

  if (profileLoading) {
    return (
      <Container maxW="7xl" >
        <Center h="full" flex="1">
          <Loader />
        </Center>
      </Container>
    );
  }

  if (profile?.role !== 'seeker') {
    return (
      <Container maxW="7xl" >
        <Center h="400px">
          <VStack spacing={4}>
            <Text fontSize="lg" color="gray.500">Access denied</Text>
            <Text color="gray.400">Only seekers can browse listings</Text>
            <Button onClick={() => router.push('/dashboard/listings')}>
              Back to Dashboard
            </Button>
          </VStack>
        </Center>
      </Container>
    );
  }

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

      <Container maxW="7xl" >
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size={{ base: 'sm', lg: 'md' }} mb={2} color="brand.600">Browse Available Pets</Heading>
            <Text color="gray.600">Find your perfect companion from verified breeders</Text>
          </Box>


          <VStack spacing={4} align="stretch">
            {/* Search Bar */}
            <HStack justify="space-between" align="center">
              <Button
                as={IconButton}
                icon={<MdFilterList />}
                onClick={() => setShowFilters(!showFilters)}

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
                        Breed: {breeds?.find(b => b.id === filters.breed)?.name}
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

              {(filters.breed || filters.location || filters.minPrice || filters.maxPrice || filters.type) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              )}
            </HStack>

          </VStack>
          {/* Results Count */}
          <HStack justify="space-between">
            <Text color="gray.600">
            </Text>
          </HStack>
          {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''} found
        </VStack>

        <HStack align="center">
          {/* Advanced Filters */}
          {showFilters && (
            <Card minW="200px" maxW="300px" bg={bgColor} p={4} mr={4} borderRadius="lg">
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>Breed</FormLabel>
                  <Select
                    placeholder="All breeds"
                    value={filters.breed}
                    onChange={(e) => updateFilter('breed', e.target.value)}
                    disabled={breedsLoading || listingsLoading}
                  >
                    {breeds?.map((breed) => (
                      <option key={breed.id} value={breed.id}>
                        {breed.name}
                      </option>
                    ))}
                  </Select>
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
                  <Select
                    placeholder="All types"
                    value={filters.type}
                    onChange={(e) => updateFilter('type', e.target.value)}
                    disabled={breedsLoading || listingsLoading}
                  >
                    <option value="litter">Litter</option>
                    <option value="single_pet">Single Pet</option>
                  </Select>
                </FormControl>
              </Stack>
            </Card>
          )}

          <Stack>
            {listingsLoading || breedsLoading && <Center flex="1" h="full">
              <Loader />
            </Center>}

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

      </Container >
    </>
  );
};

export default BrowseListingsPage;
