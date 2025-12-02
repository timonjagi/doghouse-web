import React, { useState, useMemo } from 'react'
import {
  Box,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  useColorModeValue as mode,
  Alert,
  AlertIcon,
  Center,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Container,
  useColorModeValue,
  VisuallyHidden,
  useBreakpointValue,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  DrawerCloseButton,
  Stack,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import ListingCard from 'lib/components/ui/ListingCard'
import { BreedCard } from 'lib/components/ui/BreedCard2'
import { useListings, useIncrementListingViews } from 'lib/hooks/queries/useListings'
import { useAllAvailableUserBreeds } from 'lib/hooks/queries/useUserBreeds'
import { Loader } from 'lib/components/ui/Loader'
import { Filter } from 'lib/components/ui/Filter'
import { DesktopNavItem, NavCategoryMenu } from 'lib/components/layout/NavCategoryMenu'
import { MobileFilter } from 'lib/components/ui/MobileFilter'
import { NavCategorySubmenu } from 'lib/components/layout/NavCategorySubmenu'
import { useBreedCategories } from 'lib/hooks/queries/useBreedCategories'
import { useFeaturedBreeders, useAllBreeders } from 'lib/hooks/queries/useBreeders'
import { usePopularListings } from 'lib/hooks/queries/usePopularListings'
import { BreederCard } from 'lib/components/ui/BreederCard'

export const UnifiedSearchPage = () => {
  const router = useRouter()
  const {
    q: searchQuery,
    tab,
    sort,
    breed,
    featured,
    rescue,
    training,
    care,
    ...otherQueries
  } = router.query

  // Map tab parameter to tab index
  const getTabIndex = (tabParam: string | string[] | undefined): number => {
    switch (tabParam?.toString()) {
      case 'all': return 0
      case 'listings': return 1
      case 'breeds': return 2
      case 'breeders': return 3
      default: return 0
    }
  }

  const { isOpen, onOpen, onToggle, onClose } = useDisclosure()

  const [activeTab, setActiveTab] = useState(getTabIndex(tab))
  const [filters, setFilters] = useState(() => ({
    q: searchQuery?.toString() || '',
    tab: tab?.toString() || '',
    sort: sort?.toString() || '',
    breed: breed?.toString() || '',
    featured: featured?.toString() || '',
    rescue: rescue?.toString() || '',
    training: training?.toString() || '',
    care: care?.toString() || '',
    size: otherQueries.size?.toString() || '',
    price_min: otherQueries.price_min?.toString() || '',
    price_max: otherQueries.price_max?.toString() || '',
    breeds: typeof otherQueries.breeds === 'string' ? otherQueries.breeds.split(',') : [],
    location: otherQueries.location?.toString() || '',
  }))

  const incrementViewsMutation = useIncrementListingViews()

  // Sync tab with URL when component mounts or URL changes
  React.useEffect(() => {
    const newTabIndex = getTabIndex(tab)
    setActiveTab(newTabIndex)
  }, [tab])

  const handleTabChange = (tabIndex: number) => {
    const tabNames = ['listings', 'breeds', 'breeders', 'services']
    setActiveTab(tabIndex)

    // Update URL with new tab, preserving other params
    const newQuery = { ...router.query, tab: tabNames[tabIndex] }
    if (newQuery.tab === 'all') delete newQuery.tab

    router.replace({
      pathname: '/dashboard/search',
      query: newQuery
    }, undefined, { shallow: true })
  }

  const handleSearch = (query: string, newFilters: any = {}) => {
    setFilters(prev => ({ ...prev, q: query, ...newFilters }))

    const queryParams: any = {}
    if (query) queryParams.q = query
    if (activeTab > 0) queryParams.tab = ['all', 'listings', 'breeds', 'breeders',][activeTab]

    // Add all filter parameters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          queryParams[key] = value.join(',')
        } else {
          queryParams[key] = value
        }
      }
    })

    router.push({
      pathname: '/dashboard/search',
      query: queryParams
    }, undefined, { shallow: true })
  }

  const listingsSearchFilters = useMemo(() => {
    const searchFilters: any = {
      status: 'available',
      owner_type: 'breeder'
    }

    if (searchQuery) searchFilters.search = searchQuery
    if (filters.sort) searchFilters.sort = filters.sort
    if (filters.breed) searchFilters.breed_id = filters.breed
    if (filters.size) searchFilters.size = filters.size
    if (filters.price_min) searchFilters.price_min = filters.price_min
    if (filters.price_max) searchFilters.price_max = filters.price_max
    if (filters.location) searchFilters.location = filters.location
    if (filters.breeds?.length > 0) searchFilters.breed_ids = filters.breeds

    return searchFilters
  }, [searchQuery, filters])

  const {
    data: listings = [],
    isLoading: listingsLoading,
    error: listingsError
  } = useListings(listingsSearchFilters)

  const {
    data: availableBreeds = [],
    isLoading: breedsLoading,
    error: breedsError
  } = useAllAvailableUserBreeds()

  const { data: allBreeders = [], isLoading: allBreedersLoading, error: allBreedersError } = useAllBreeders(8);


  const { data: popularBreeds = [], isLoading: popularBreedsLoading, error: popularBreedsError } = useAllAvailableUserBreeds(8);
  const { data: popularListings = [], isLoading: popularListingsLoading, error: popularListingsError } = usePopularListings(4);
  const { data: featuredBreeders = [], isLoading: featuredBreedersLoading, error: featuredBreedersError } = useFeaturedBreeders(4);
  const { data: breedCategories = [], isLoading: categoriesLoading, error: categoriesError } = useBreedCategories(8);


  const filteredBreeds = useMemo(() => {
    if (!availableBreeds) return []

    let results = availableBreeds

    if (searchQuery) {
      const query = (searchQuery as string).toLowerCase()
      results = results.filter(breed =>
        breed.breeds?.name?.toLowerCase().includes(query) ||
        breed.breeds?.description?.toLowerCase().includes(query) ||
        breed.breeds?.group?.toLowerCase().includes(query)
      )
    }

    if (filters.breeds?.length > 0) {
      results = results.filter(breed => filters.breeds.includes(breed.breed_id))
    }

    return results
  }, [availableBreeds, searchQuery, filters.breeds])

  const handleListingClick = async (listingId: string) => {
    try {
      await incrementViewsMutation.mutateAsync(listingId)
    } catch (error) {
      console.error('Failed to increment views:', error)
    }
    router.push(`/dashboard/listings/${listingId}`)
  }

  const handleBreedClick = (breedId: string) => {
    router.push(`/dashboard/breeds/${breedId}`)
  }

  const formatPrice = (price?: number) => {
    if (!price) return 'Price not set'
    return `KSH ${price.toLocaleString()}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'green'
      case 'reserved': return 'yellow'
      case 'sold': return 'red'
      default: return 'gray'
    }
  }

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const isDesktop = useBreakpointValue({ base: false, md: true })
  const totalResults = listings.length + filteredBreeds.length
  const isLoading = breedsLoading || popularBreedsLoading || popularListingsLoading || featuredBreedersLoading || allBreedersLoading || categoriesLoading

  const error = listingsError || breedsError

  return (
    <Container maxW="7xl" mx="auto" >


      <Box >

        <CustomTabBar tab={tab as string} />

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            Error searching. Please try again.
          </Alert>
        ) : totalResults === 0 ? (
          <Center py={12}>
            <VStack spacing={4}>
              <Text fontSize="lg" color="gray.500">No results found</Text>
              <Text color="gray.400" textAlign="center">
                Try adjusting your search terms or filters.
              </Text>
              <HStack spacing={4}>
                <Button colorScheme="blue" onClick={() => router.push('/dashboard')}>
                  Browse Home
                </Button>
                {!searchQuery && (
                  <Button variant="outline" onClick={() => handleSearch('golden retriever', {})}>
                    Popular: Golden Retriever
                  </Button>
                )}
              </HStack>
            </VStack>
          </Center>
        ) : (

          <Tabs index={activeTab} onChange={handleTabChange} variant="soft-rounded" colorScheme="brand">

            <VisuallyHidden>
              <TabList>
                <Tab>All ({totalResults})</Tab>
                <Tab>Listings ({listings.length})</Tab>
                <Tab>Breeds ({filteredBreeds.length})</Tab>
                <Tab>Breeders (0)</Tab>
                <Tab>Services (0)</Tab>
              </TabList>

            </VisuallyHidden>



            <MobileFilter
              onToggle={onToggle}
            />

            <Box bg={{ base: '', md: mode('white', 'gray.800') }}
              px={{ base: 2, md: 8 }}

            >
              {isDesktop && activeTab > 0 && (
                <Filter
                  onFilterChange={(filters) => handleSearch(searchQuery as string, { ...filters })}
                />
              )}

              <TabPanels>

                <TabPanel px={0}>
                  <Stack>
                    {/* Desktop Layout - Categories and Navigation */}
                    <Box display={{ base: 'none', md: 'block' }}>
                      <NavCategorySubmenu.Desktop breedCategories={breedCategories} popularBreeds={popularBreeds} popularListings={popularListings} />
                    </Box>

                    {/* Mobile Layout - Categories and Navigation */}
                    <Box display={{ base: 'block', md: 'none' }}>
                      <Flex flex="1" fontSize="sm" overflow="auto">
                        <NavCategorySubmenu.Mobile breedCategories={breedCategories} popularBreeds={popularBreeds} popularListings={popularListings} />
                      </Flex>
                    </Box>
                  </Stack>
                </TabPanel>

                {/* Listings Tab */}
                <TabPanel px={0}>
                  {listings.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
                      {listings.map((listing) => (
                        <ListingCard
                          key={listing.id}
                          listing={listing}
                          handleListingClick={handleListingClick}
                          formatPrice={formatPrice}
                          getStatusColor={getStatusColor}
                        />
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Center py={12}>
                      <Text fontSize="lg" color="gray.500">No listings found</Text>
                    </Center>
                  )}
                </TabPanel>

                {/* Breeds Tab */}
                <TabPanel px={0}>
                  {filteredBreeds.length > 0 ? (
                    <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
                      {filteredBreeds.map((breed) => (
                        <BreedCard
                          key={breed.id}
                          userBreed={{
                            id: breed.id,
                            breeds: {
                              name: breed.breeds?.name || '',
                              breed_group: breed.breeds?.group || '',
                              description: breed.breeds?.description || '',
                              images: breed.breeds?.images || [],
                              featured_image_url: breed.breeds?.featured_image_url,
                            },
                            breeder_count: breed.breeder_count,
                          }}
                          userRole="seeker"
                          onClick={() => handleBreedClick(breed.id)}
                        />
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Center py={12}>
                      <Text fontSize="lg" color="gray.500">No breeds found</Text>
                    </Center>
                  )}
                </TabPanel>


                {/* Breeders Tab */}
                <TabPanel px={0}>
                  {allBreeders.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
                      {allBreeders.map((breeder) => (
                        <BreederCard
                          key={breeder.id}
                          breeder={breeder}
                        />
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Center py={12}>
                      <Text fontSize="lg" color="gray.500">No breeders found</Text>
                    </Center>
                  )}
                </TabPanel>

              </TabPanels>
            </Box>
          </Tabs>
        )}
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onClose={onClose}

      >

        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>

            Filters

            {/* {unreadCount > 0 && (
              <Badge colorScheme="red" borderRadius="full" px={2} fontSize="xs">
                {unreadCount}
              </Badge>
            )}
 */}

            {/* {notifications && notifications.length > 0 && unreadCount > 0 && (
              <Button
                leftIcon={<FiCheck />}
                variant="outline"
                size="xs"
                onClick={handleMarkAllAsRead}
                isLoading={markAllAsReadMutation.isPending}
              >
                Mark All Read
              </Button>
            )} */}

          </DrawerHeader>
          <Filter
            onFilterChange={(filters) => {
              handleSearch(searchQuery as string, { ...filters })
              onClose()
            }}
          />
        </DrawerContent>
      </Drawer>
    </Container>
  )
}

const CustomTabBar = ({ tab }: { tab: string }) => {
  const isMobile = useBreakpointValue({ base: true, md: false })

  const menuItems = isMobile ? [
    { label: 'All', href: '/dashboard/search?tab=all' },
    { label: 'Pets', href: '/dashboard/search?tab=listings' },
    { label: 'Breeds', href: '/dashboard/search?tab=breeds' },
    { label: 'Breeders', href: '/dashboard/search?tab=breeders' },
  ] : [
    { label: 'All Categories', href: '/dashboard/search?tab=all' },
    { label: 'Available Pets', href: '/dashboard/search?tab=listings' },
    { label: 'Popular Breeds', href: '/dashboard/search?tab=breeds' },
    { label: 'Breeders Near You', href: '/dashboard/search?tab=breeders' },
  ];

  return (
    <Box
      borderTopWidth="1px"
      borderBottomWidth="1px"
      borderColor={mode('gray.200', 'gray.700')}
      bg={mode('white', 'gray.800')}
      px="8"
    >
      <Box maxW="8xl" mx="auto">
        <HStack spacing="8">
          {menuItems.map((link) => (
            <DesktopNavItem key={link.label} {...link} isActive={link.href.includes(tab)} />
          ))}
        </HStack>
      </Box>
    </Box>
  )
}
export default UnifiedSearchPage
