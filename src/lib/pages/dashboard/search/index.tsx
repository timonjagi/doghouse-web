import React, { useState, useMemo, useEffect } from 'react'
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
  Spinner,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import ListingCard from 'lib/components/ui/ListingCard'
import { BreedCard } from 'lib/components/ui/BreedCard2'
import { useListings, useIncrementListingViews } from 'lib/hooks/queries/useListings'
import { useAllAvailableUserBreeds } from 'lib/hooks/queries/useUserBreeds'
import { Loader } from 'lib/components/ui/Loader'
import { Filter } from 'lib/components/ui/Filter'
import { DesktopNavItem, NavCategoryMenu } from 'lib/components/layout/NavCategoryMenu'
import { MobileFilterButtons, DesktopFilterButtons } from 'lib/components/ui/FilterButtons'
import { NavCategorySubmenu } from 'lib/components/layout/NavCategorySubmenu'
import { useBreedCategories } from 'lib/hooks/queries/useBreedCategories'
import { useFeaturedBreeders, useAllBreeders } from 'lib/hooks/queries/useBreeders'
import { usePopularListings } from 'lib/hooks/queries/usePopularListings'
import { BreederCard } from 'lib/components/ui/BreederCard'
import * as searchService from 'lib/services/searchService'
import { ListingList } from '../listings/ListingList'
import { BreedList } from '../breeds/BreedList'
import { BreedersList } from '../breeds/BreederList'
import { SortbySelect, } from 'lib/components/ui/SortBySelect'
import { ArrowBackIcon } from '@chakra-ui/icons'

export const UnifiedSearchPage = () => {
  const router = useRouter()

  // Parse filters from URL using search service
  const filters = useMemo(() => searchService.parseSearchParams(router.query), [router.query])

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

  const [activeTab, setActiveTab] = useState(getTabIndex(filters.tab))

  // Pagination state for each tab
  const [listingsPage, setListingsPage] = useState(0)
  const [breedsPage, setBreedsPage] = useState(0)
  const [breedersPage, setBreedersPage] = useState(0)

  const incrementViewsMutation = useIncrementListingViews()

  // Sync tab and reset pagination when tab changes
  useEffect(() => {
    const newTabIndex = getTabIndex(filters.tab)
    if (newTabIndex !== activeTab) {
      setActiveTab(newTabIndex)
      // Reset pagination when tab changes
      setListingsPage(0)
      setBreedsPage(0)
      setBreedersPage(0)
    }
  }, [filters.tab])

  // Reset pagination when filters change
  useEffect(() => {
    setListingsPage(0)
    setBreedsPage(0)
    setBreedersPage(0)
  }, [filters.q, filters.sort, filters.breed, filters.size, filters.price_min, filters.price_max, filters.location, filters.breeds, filters.breed_groups])

  const handleTabChange = (tabIndex: number) => {
    const tabNames = ['all', 'listings', 'breeds', 'breeders']
    setActiveTab(tabIndex)

    // Get relevant filters for the new tab
    const newFilters = searchService.getRelevantFiltersForTab(
      filters,
      tabNames[tabIndex] as searchService.SearchType
    )

    const queryParams = searchService.buildQueryParams(newFilters)

    router.replace({
      pathname: '/dashboard/search',
      query: queryParams
    }, undefined, { shallow: true })
  }

  const handleSearch = (query: string, newFilters: any = {}) => {
    const updatedFilters: searchService.SearchFilters = {
      ...filters,
      q: query,
      ...newFilters
    }

    const queryParams = searchService.buildQueryParams(updatedFilters)

    router.push({
      pathname: '/dashboard/search',
      query: queryParams
    }, undefined, { shallow: true })
  }

  const handleFilterChange = (newFilters: any) => {
    handleSearch(filters.q || '', newFilters)

    const queryParams = searchService.buildQueryParams(newFilters)

    router.push({
      pathname: '/dashboard/search',
      query: queryParams
    }, undefined, { shallow: true })
  }



  // Use search service to map filters to hook parameters
  const listingsParams = useMemo(
    () => searchService.mapFiltersToListingsParams(filters, { page: listingsPage, pageSize: 12 }),
    [filters, listingsPage]
  )

  const breedsParams = useMemo(
    () => searchService.mapFiltersToBreedParams(filters, { page: breedsPage, pageSize: 12 }),
    [filters, breedsPage]
  )

  const breedersParams = useMemo(
    () => searchService.mapFiltersToBreederParams(filters, { page: breedersPage, pageSize: 12 }),
    [filters, breedersPage]
  )

  // Fetch data using mapped parameters
  const {
    data: listings = [],
    isLoading: listingsLoading,
    error: listingsError
  } = useListings(listingsParams)

  const {
    data: availableBreeds = [],
    isLoading: breedsLoading,
    error: breedsError
  } = useAllAvailableUserBreeds(undefined, breedsParams)

  const {
    data: allBreeders = [],
    isLoading: allBreedersLoading,
    error: allBreedersError
  } = useAllBreeders(undefined, breedersParams)


  const { data: popularBreeds = [], isLoading: popularBreedsLoading, error: popularBreedsError } = useAllAvailableUserBreeds(8);
  const { data: popularListings = [], isLoading: popularListingsLoading, error: popularListingsError } = usePopularListings(4);
  const { data: breedCategories = [], isLoading: categoriesLoading, error: categoriesError } = useBreedCategories(8)

  const handleListingClick = async (listingId: string) => {
    try {
      await incrementViewsMutation.mutateAsync(listingId)
    } catch (error) {
      console.error('Failed to increment views:', error)
    }
    router.push(`/dashboard/listings/${listingId}`)
  }

  const handleBreedClick = (breedName: string) => {
    router.push(`/dashboard/breeds/${encodeURIComponent(breedName)}`)
  }



  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const isDesktop = useBreakpointValue({ base: false, md: true })
  const totalResults = listings.length + availableBreeds.length + allBreeders.length
  const isLoading = listingsLoading || breedsLoading || popularBreedsLoading || popularListingsLoading || allBreedersLoading || categoriesLoading

  const error = listingsError || breedsError

  return (
    <Container maxW="7xl" mx="auto" >


      <Box overflowX="hidden" >
        <Tabs
          index={activeTab}
          onChange={handleTabChange}
          variant="soft-rounded"
          colorScheme="brand"
        >

          <HStack
            display={filters.q || searchService.hasActiveFilters(filters) ? 'flex' : 'none'}
          >
            <Button
              leftIcon={<ArrowBackIcon boxSize={6} />}
              variant="ghost"
              onClick={() => searchService.clearSearchParams(router)}
              p={0}
            />
            <TabList>
              <Tab>All ({totalResults})</Tab>
              <Tab>Listings ({listings.length})</Tab>
              <Tab>Breeds ({availableBreeds.length})</Tab>
              <Tab>Breeders ({allBreeders.length})</Tab>
            </TabList>
          </HStack>


          {searchService.hasActiveFilters(filters) && (
            <Box
              display={filters.q || searchService.hasActiveFilters(filters) ? 'flex' : 'none'}
              ps={{ base: 2, md: 4 }}
            >
              {
                isDesktop ? (
                  <DesktopFilterButtons
                    onToggle={onToggle}
                    onFilterChange={handleFilterChange}
                  />
                ) : (
                  <MobileFilterButtons
                    onToggle={onToggle}
                    onFilterChange={handleFilterChange}
                  />
                )}

            </Box>
          )}

          <Stack
            bg={{ base: '', md: mode('white', 'gray.800') }}

          >
            {isDesktop && activeTab > 0 && (filters.q || searchService.hasActiveFilters(filters)) ? (
              <HStack spacing={4} justifyContent="space-between">
                <Text fontSize="sm">
                  {activeTab === 0 && totalResults + ' result' + (totalResults === 1 ? '' : 's')}
                  {activeTab === 1 && listings.length + ' result' + (listings.length === 1 ? '' : 's')}
                  {activeTab === 2 && availableBreeds.length + ' result' + (availableBreeds.length === 1 ? '' : 's')}
                  {activeTab === 3 && allBreeders.length + ' result' + (allBreeders.length === 1 ? '' : 's')}
                </Text>

                <HStack spacing="4" alignItems="center">
                  <Text fontSize="sm">Sort by:</Text>
                  <SortbySelect
                    maxW="140px"
                  />
                </HStack>
              </HStack>
            ) : (
              <CustomTabBar
                tab={filters.tab as string}
                currentFilters={filters}
                onTabClick={(tabName) => {
                  const tabNames = ['all', 'listings', 'breeds', 'breeders']
                  const tabIndex = tabNames.indexOf(tabName)
                  if (tabIndex !== -1) {
                    handleTabChange(tabIndex)
                  }
                }}
              />
            )
            }



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
                    {!filters.q && (
                      <Button variant="outline" onClick={() => handleSearch('golden retriever', {})}>
                        Popular: Golden Retriever
                      </Button>
                    )}
                  </HStack>
                </VStack>
              </Center>
            ) : (
              <TabPanels>

                <TabPanel px={0}>
                  {filters.q ? (
                    <VStack spacing={8} align="stretch">
                      {/* Search Results Summary */}
                      <Box>
                        <Heading size={{ base: 'xs', md: 'sm' }} >Search Results for "{filters.q}"</Heading>
                      </Box>

                      {/* Listings Section */}
                      {listings.length > 0 && (
                        <Box>
                          <Flex justify="space-between" align="center" mb={4}>
                            <Heading size="sm">Listings ({listings.length})</Heading>
                            <Button
                              size="sm"
                              variant="link"
                              colorScheme="brand"
                              onClick={() => handleTabChange(1)}
                            >
                              View All Listings →
                            </Button>
                          </Flex>
                          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
                            {listings.slice(0, 4).map((listing) => (
                              <ListingCard
                                key={listing.id}
                                listing={listing}
                                handleListingClick={handleListingClick}
                              />
                            ))}
                          </SimpleGrid>
                        </Box>
                      )}

                      {/* Breeds Section */}
                      {availableBreeds.length > 0 && (
                        <Box>
                          <Flex justify="space-between" align="center" mb={4}>
                            <Heading size="sm">Breeds ({availableBreeds.length})</Heading>
                            <Button
                              size="sm"
                              variant="link"
                              colorScheme="brand"
                              onClick={() => handleTabChange(2)}
                            >
                              View All Breeds →
                            </Button>
                          </Flex>
                          <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
                            {availableBreeds.slice(0, 4).map((breed) => (
                              <BreedCard
                                key={breed.id}
                                userBreed={breed}
                                userRole="seeker"
                                onClick={() => { console.log(breed); handleBreedClick(breed.breeds?.name) }}
                              />
                            ))}
                          </SimpleGrid>
                        </Box>
                      )}

                      {/* Breeders Section */}
                      {allBreeders.length > 0 && (
                        <Box>
                          <Flex justify="space-between" align="center" mb={4}>
                            <Heading size="sm">Breeders ({allBreeders.length})</Heading>
                            <Button
                              size="sm"
                              variant="link"
                              colorScheme="brand"
                              onClick={() => handleTabChange(3)}
                            >
                              View All Breeders →
                            </Button>
                          </Flex>
                          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
                            {allBreeders.slice(0, 4).map((breeder) => (
                              <BreederCard
                                key={breeder.id}
                                breeder={breeder}
                              />
                            ))}
                          </SimpleGrid>
                        </Box>
                      )}

                      {/* No Results Message */}
                      {listings.length === 0 && availableBreeds.length === 0 && allBreeders.length === 0 && (
                        <Center py={12}>
                          <VStack spacing={4}>
                            <Text fontSize="lg" color="gray.500">No results found for "{filters.q}"</Text>
                            <Text color="gray.400" textAlign="center">
                              Try adjusting your search terms or browse our categories below.
                            </Text>
                          </VStack>
                        </Center>
                      )}
                    </VStack>
                  ) : (
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
                  )}
                </TabPanel>

                {/* Listings Tab */}
                <TabPanel px={0}>
                  <VStack spacing={6} align="stretch">
                    <ListingList
                      listings={listings}
                      isLoading={listingsLoading}
                      showSearch={false}
                      showFilters={false}
                      showResultsCount={false}
                      onListingClick={handleListingClick}
                      emptyMessage="No listings found"
                    />
                    {listings.length === 12 && (
                      <Center py={4}>
                        <Button
                          onClick={() => setListingsPage(prev => prev + 1)}
                          isLoading={listingsLoading}
                          colorScheme="brand"
                        >
                          Load More
                        </Button>
                      </Center>
                    )}
                  </VStack>
                </TabPanel>

                {/* Breeds Tab */}
                <TabPanel px={0}>
                  <VStack spacing={6} align="stretch">
                    <BreedList
                      breeds={availableBreeds}
                      userRole="seeker"
                      showSearch={false}
                      showFilters={false}
                      showResultsCount={false}
                      showSort={false}
                      columns={{ base: 2, md: 3, lg: 4 }}
                      spacing={4}
                      onBreedClick={(breed) => handleBreedClick(breed.breeds?.name)}
                      emptyMessage="No breeds found"
                    />
                    {availableBreeds.length === 12 && (
                      <Center py={4}>
                        <Button
                          onClick={() => setBreedsPage(prev => prev + 1)}
                          isLoading={breedsLoading}
                          colorScheme="brand"
                        >
                          Load More
                        </Button>
                      </Center>
                    )}
                  </VStack>
                </TabPanel>


                {/* Breeders Tab */}
                <TabPanel px={0}>
                  <VStack spacing={6} align="stretch">
                    <BreedersList
                      breeders={allBreeders}
                      isLoading={allBreedersLoading}
                      showLoader={false}
                      columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                      spacing={6}
                      emptyMessage="No breeders found"
                    />
                    {allBreeders.length === 12 && (
                      <Center py={4}>
                        <Button
                          onClick={() => setBreedersPage(prev => prev + 1)}
                          isLoading={allBreedersLoading}
                          colorScheme="brand"
                        >
                          Load More
                        </Button>
                      </Center>
                    )}
                  </VStack>
                </TabPanel>

              </TabPanels>
            )}
          </Stack>
        </Tabs>
      </Box >

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
            onFilterChange={(newFilters) => {
              handleSearch(filters.q || '', { ...newFilters })
              onClose()
            }}
          />
        </DrawerContent>
      </Drawer>
    </Container >
  )
}

interface CustomTabBarProps {
  tab: string
  currentFilters: searchService.SearchFilters
  onTabClick: (tabName: string) => void
}

const CustomTabBar = ({ tab, currentFilters, onTabClick }: CustomTabBarProps) => {
  // Build URLs that preserve current query parameters
  const buildTabUrl = (tabName: string) => {
    const updatedFilters = searchService.getRelevantFiltersForTab(
      currentFilters,
      tabName as searchService.SearchType
    )
    const params = searchService.buildQueryParams(updatedFilters)

    // Convert to URL string for href
    const queryString = new URLSearchParams(params as any).toString()
    return `/dashboard/search${queryString ? `?${queryString}` : ''}`
  }

  const handleTabClick = (tabName: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    onTabClick(tabName)
  }

  const menuItems = [
    { label: 'All Categories', href: buildTabUrl('all'), onClick: handleTabClick('all'), tab: 'all' },
    { label: 'Available Pets', href: buildTabUrl('listings'), onClick: handleTabClick('listings'), tab: 'listings' },
    { label: 'Popular Breeds', href: buildTabUrl('breeds'), onClick: handleTabClick('breeds'), tab: 'breeds' },
    { label: 'Breeders Near You', href: buildTabUrl('breeders'), onClick: handleTabClick('breeders'), tab: 'breeders' },
  ]

  return (
    <Box
      borderTopWidth="1px"
      borderBottomWidth="1px"
      borderColor={mode('gray.200', 'gray.700')}
      bg={mode('white', 'gray.800')}
      display={(currentFilters.q || searchService.hasActiveFilters(currentFilters)) ? 'none' : 'block'}
      px={{ base: 2, md: 4 }}

    >
      <Box maxW="8xl" mx="auto">
        <HStack spacing="8">
          {menuItems.map((link) => (
            <DesktopNavItem
              key={link.label}
              label={link.label}
              href={link.href}
              onClick={link.onClick}
              isActive={tab === link.tab || (tab === 'all' && link.tab === 'all')}
            />
          ))}
        </HStack>
      </Box>
    </Box>
  )
}
export default UnifiedSearchPage
