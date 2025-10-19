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
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { SettingsIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useUserProfile } from '../../../../hooks/queries';
import { useListings, useIncrementListingViews } from '../../../../hooks/queries/useListings';
import { useBreeds } from '../../../../hooks/queries/useBreeds';
import { NextSeo } from 'next-seo';

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
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (profile?.role !== 'seeker') {
    return (
      <Container maxW="7xl" py={8}>
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

  if (listingsLoading || breedsLoading) {
    return (
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <>
      <NextSeo title="Browse Listings - DogHouse Kenya" />

      <Container maxW="7xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="lg" mb={2}>Browse Available Pets</Heading>
            <Text color="gray.600">Find your perfect companion from verified breeders</Text>
          </Box>

          {/* Search and Filter Controls */}
          <Card bg={bgColor}>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {/* Search Bar */}
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search listings..."
                    value={filters.search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                  />
                </InputGroup>

                {/* Filter Toggle */}
                <HStack justify="space-between">
                  <Button
                    leftIcon={<SettingsIcon />}
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </Button>

                  {(filters.breed || filters.location || filters.minPrice || filters.maxPrice || filters.type) && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  )}
                </HStack>

                {/* Advanced Filters */}
                {showFilters && (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                    <FormControl>
                      <FormLabel>Breed</FormLabel>
                      <Select
                        placeholder="All breeds"
                        value={filters.breed}
                        onChange={(e) => updateFilter('breed', e.target.value)}
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
                      >
                        <option value="litter">Litter</option>
                        <option value="single_pet">Single Pet</option>
                      </Select>
                    </FormControl>
                  </SimpleGrid>
                )}

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
              </VStack>
            </CardBody>
          </Card>

          {/* Results Count */}
          <HStack justify="space-between">
            <Text color="gray.600">
              {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''} found
            </Text>
          </HStack>

          {/* Listings Grid */}
          {filteredListings.length === 0 ? (
            <Center h="300px" bg={bgColor} borderRadius="lg" border="2px dashed" borderColor="gray.300">
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
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
              {filteredListings.map((listing) => (
                <Card
                  key={listing.id}
                  bg={bgColor}
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
                  onClick={() => handleListingClick(listing.id)}
                >
                  <CardBody>
                    {/* Main Photo */}
                    {listing.photos && listing.photos.length > 0 && (
                      <Image
                        src={listing.photos[0]}
                        alt={listing.title}
                        objectFit="cover"
                        w="full"
                        h="200px"
                        borderRadius="md"
                        mb={4}
                      />
                    )}

                    <VStack spacing={3} align="stretch">
                      <Box>
                        <Heading size="md" noOfLines={2} mb={2}>
                          {listing.title}
                        </Heading>
                        <HStack>
                          <Badge colorScheme={listing.type === 'litter' ? 'blue' : 'green'}>
                            {listing.type === 'litter' ? 'Litter' : 'Single Pet'}
                          </Badge>
                          <Badge colorScheme={getStatusColor(listing.status)}>
                            {listing.status}
                          </Badge>
                        </HStack>
                      </Box>

                      <Text fontSize="sm" color="gray.600" noOfLines={2}>
                        {listing.description}
                      </Text>

                      <Text fontSize="lg" fontWeight="semibold" color="green.600">
                        {formatPrice(listing.price)}
                      </Text>

                      {listing.location_text && (
                        <Text fontSize="xs" color="gray.500">
                          📍 {listing.location_text}
                        </Text>
                      )}

                      <Text fontSize="xs" color="gray.500">
                        👁️ {listing.view_count || 0} views
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </>
  );
};

export default BrowseListingsPage;
