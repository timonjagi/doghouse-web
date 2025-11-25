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
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import ListingCard from '../../../lib/components/ui/ListingCard'
import { BreedCard } from '../../../lib/components/ui/BreedCard2'
import { useListings, useIncrementListingViews } from '../../../lib/hooks/queries/useListings'
import { useAllAvailableUserBreeds } from '../../../lib/hooks/queries/useUserBreeds'
import { Loader } from 'lib/components/ui/Loader'
import { Filter } from 'lib/components/ui/Filter'
import { DesktopNavItem, NavCategoryMenu } from 'lib/components/layout/NavCategoryMenu'
import { MobileFilter } from 'lib/components/ui/MobileFilter'

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
      case 'listings': return 0
      case 'breeds': return 1
      case 'breeders': return 2
      case 'services': return 3
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
    if (activeTab > 0) queryParams.tab = ['all', 'listings', 'breeds', 'breeders', 'services'][activeTab]

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
  const isLoading = listingsLoading || breedsLoading
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
              {isDesktop && (
                <Filter
                  onFilterChange={(filters) => handleSearch(searchQuery as string, { ...filters })}
                />
              )}

              <TabPanels>

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

                {/* Breeders Tab - Coming Soon */}
                <TabPanel px={0}>
                  <Center py={12}>
                    <VStack spacing={4}>
                      <Text fontSize="lg" color="gray.500">Breeders Search Coming Soon</Text>
                      <Text color="gray.400" textAlign="center">
                        We're working on advanced breeder search and filtering features.
                      </Text>
                    </VStack>
                  </Center>
                </TabPanel>

                {/* Services Tab - Coming Soon */}
                <TabPanel px={0}>
                  <Center py={12}>
                    <VStack spacing={4}>
                      <Text fontSize="lg" color="gray.500">Services Search Coming Soon</Text>
                      <Text color="gray.400" textAlign="center">
                        Dog training, grooming, and pet care services will be available here.
                      </Text>
                    </VStack>
                  </Center>
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

  const menuItems = [
    { label: 'All Categories', href: '/dashboard' },
    { label: 'Available Pets', href: '/dashboard/search?tab=listings' },
    { label: 'Popular Breeds', href: '/dashboard/search?tab=breeds' },
    { label: 'Breeders Near You', href: '/dashboard/search?tab=breeders' },
    { label: 'Pet Care Services', href: '/dashboard/search?tab=services' },
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
