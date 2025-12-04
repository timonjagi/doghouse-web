import { Box, Flex, HStack, Stack, useBreakpointValue, useColorModeValue as mode, Tab, TabList, TabPanel, TabPanels, Tabs, VisuallyHidden, SimpleGrid, Heading, Icon, Link, useColorModeValue } from '@chakra-ui/react'
import { NavCategorySubmenu } from 'lib/components/layout/NavCategorySubmenu'
import { NavCategorySubmenu as BreedCategorySubmenu } from 'lib/components/ui/NavCategorySubmenu'
import { NavCategoryMenu as BreedCategoryMenu } from 'lib/components/ui/NavCategoryMenu'
import { Loader } from 'lib/components/ui/Loader';
import { useSeekerDashboard } from 'lib/hooks/queries/useSeekerDashboard'
import React, { useEffect } from 'react';
import * as searchService from 'lib/services/searchService'
import router from 'next/router';
import { useIncrementListingViews } from 'lib/hooks/queries/useListings';
import { ShowcaseOnSpanningColumns } from 'lib/components/ui/ShowcaseOnSpanningColumns';
import { CategoryCard } from 'lib/components/ui/CatetgoryCard';
import { DesktopNavItem } from 'lib/components/layout/NavCategoryMenu';
import { FaArrowRight } from 'react-icons/fa';

const SeekerDashboardOverview: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const isDesktop = useBreakpointValue({ base: false, md: true })

  // Use the unified dashboard hook to fetch data for dynamic navigation
  const { data: dashboardData, isLoading, error } = useSeekerDashboard();

  // refactor to usePopularBreeds hook
  const incrementViewsMutation = useIncrementListingViews()

  // So
  const popularListings = dashboardData?.popularListings || [];
  const featuredBreeders = dashboardData?.featuredBreeders || [];
  const breedCategories = dashboardData?.breedCategories || [];
  const popularBreeds = dashboardData?.popularBreeds || [];

  const getTabIndex = (tabParam: string | string[] | undefined): number => {
    switch (tabParam?.toString()) {
      case 'all': return 0
      case 'listings': return 1
      case 'breeds': return 2
      case 'breeders': return 3
      default: return 0
    }
  }
  const [currentRoute, setCurrentRoute] = React.useState('');

  React.useEffect(() => {
    setCurrentRoute(router.query.category?.toString() || '');
  }, [router.query.category])


  useEffect(() => {
    handleTabChange(getTabIndex(router.query.tab))
  }, [router.query.tab])

  const handleTabChange = (tabIndex: number) => {
    setActiveTab(tabIndex)
  }

  const filters = React.useMemo(() => searchService.parseSearchParams(router.query), [router.query])

  const [activeTab, setActiveTab] = React.useState(getTabIndex(filters.tab))

  console.log('SeekerDashboardOverview render:', { popularListings, featuredBreeders, breedCategories, popularBreeds });
  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return <Box>Error loading dashboard data. {error.message}</Box>
  }

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

  return (
    <Box>

      <CustomTabBar activeTab={activeTab} />

      <Tabs
        index={activeTab}
        onChange={handleTabChange}
        variant="soft-rounded"
        colorScheme="brand"
      >

        <VisuallyHidden>
          <TabList>
            <Tab>All </Tab>
            <Tab>Listings </Tab>
            <Tab>Breeds </Tab>
            <Tab>Breeders </Tab>
          </TabList>
        </VisuallyHidden>

        <Stack
          bg={{ base: '', md: mode('white', 'gray.800') }}
        >
          <TabPanels>

            <TabPanel p={0}>
              <Stack>


                <Flex flex="1" fontSize="sm" overflow="auto">

                  <BreedCategoryMenu.Mobile
                    menus={[
                      {
                        label: 'Dogs',
                        href: '/dashboard?tab=all&category=dogs',
                        isActive: currentRoute.includes('dogs')
                      },
                      {
                        label: 'Cats',
                        href: '/dashboard?tab=all&category=cats',
                        isActive: currentRoute.includes('cats')
                      },
                      {
                        label: 'Rodents',
                        href: '/dashboard?tab=all&category=rodents',
                        isActive: currentRoute.includes('rodents')
                      },
                      {
                        label: 'Fish',
                        href: '/dashboard?tab=all&category=fish',
                        isActive: currentRoute.includes('fish')
                      },
                      {
                        label: 'Birds',
                        href: '/dashboard?tab=all&category=birds',
                        isActive: currentRoute.includes('birds')
                      },
                      {
                        label: 'Reptiles',
                        href: '/dashboard?tab=all&category=reptiles',
                        isActive: currentRoute.includes('reptiles')
                      },
                      {
                        label: 'Amphibians',
                        href: '/dashboard?tab=all&category=amphibians',
                        isActive: currentRoute.includes('amphibians')
                      },
                    ]}
                  />

                  {isDesktop ?
                    <BreedCategorySubmenu.Desktop data={{
                      category: {
                        label: 'Breed Categories',
                        links: breedCategories,
                      },
                      featured: {
                        label: 'Popular Breeds',
                        links: popularBreeds?.map(breed => ({
                          label: breed.name,
                          url: `/dashboard/breeds/${encodeURIComponent(breed.name)}`,
                        }))
                      },
                      products: popularBreeds.map(breed => ({
                        name: breed.name,
                        price: breed.price,
                        currency: 'USD',
                        href: `/dashboard/breeds/${encodeURIComponent(breed.name)}`,
                        imageUrl: breed.featured_image_url,
                      }))
                    }}
                    />
                    :
                    <BreedCategorySubmenu.Mobile data={{
                      category: {
                        label: 'Breed Categories',
                        links: breedCategories,
                      },
                      featured: {
                        label: 'Popular Breeds',
                        links: popularBreeds?.map(breed => ({
                          label: breed.name,
                          url: `/dashboard/breeds/${encodeURIComponent(breed.name)}`,
                        }))
                      },
                      products: popularBreeds.map(breed => ({
                        name: breed.name,
                        price: breed.price,
                        currency: 'USD',
                        href: `/dashboard/breeds/${encodeURIComponent(breed.name)}`,
                        imageUrl: breed.featured_image_url,
                      }))
                    }}
                    />
                  }
                </Flex>
              </Stack>
            </TabPanel>

            {/* Listings Tab */}
            <TabPanel p={0}>
              <Stack>

                <Flex flex="1" fontSize="sm" overflow="auto">

                  <BreedCategoryMenu.Mobile
                    menus={[
                      {
                        label: 'Dogs',
                        href: '/dashboard?category=dogs',
                        isActive: currentRoute.includes('dogs')
                      },
                      {
                        label: 'Cats',
                        href: '/dashboard?category=cats',
                        isActive: currentRoute.includes('cats')
                      },
                      {
                        label: 'Rodents',
                        href: '/dashboard?category=rodents',
                        isActive: currentRoute.includes('rodents')
                      },
                      {
                        label: 'Fish',
                        href: '/dashboard?category=fish',
                        isActive: currentRoute.includes('fish')
                      },
                      {
                        label: 'Birds',
                        href: '/dashboard?category=birds',
                        isActive: currentRoute.includes('birds')
                      },
                      {
                        label: 'Reptiles',
                        href: '/dashboard?category=reptiles',
                        isActive: currentRoute.includes('reptiles')
                      },
                      {
                        label: 'Amphibians',
                        href: '/dashboard?category=amphibians',
                        isActive: currentRoute.includes('amphibians')
                      },
                    ]}
                  />

                  {/* Desktop Layout - Categories and Navigation */}
                  <Box display={{ base: 'none', md: 'block' }}>
                    <NavCategorySubmenu.Desktop
                      breedCategories={breedCategories}
                      popularBreeds={popularBreeds.map(breed => ({
                        name: breed.name,
                        price: breed.price,
                        currency: 'USD',
                        href: `/dashboard/breeds/${encodeURIComponent(breed.name)}`,
                        imageUrl: breed.featured_image_url,
                      }))}
                      popularListings={popularListings}
                    />
                  </Box>

                  {/* Mobile Layout - Categories and Navigation */}
                  <Box display={{ base: 'block', md: 'none' }}>
                    <Flex flex="1" fontSize="sm" overflow="auto">
                      <NavCategorySubmenu.Mobile
                        breedCategories={breedCategories}
                        popularBreeds={popularBreeds.map(breed => ({
                          name: breed.name,
                          price: breed.price,
                          currency: 'USD',
                          href: `/dashboard/breeds/${encodeURIComponent(breed.name)}`,
                          imageUrl: breed.featured_image_url,
                        }))}
                        popularListings={popularListings}
                      />
                    </Flex>
                  </Box>
                </Flex>

              </Stack>
            </TabPanel>

            {/* Breeds Tab */}
            <TabPanel p={0}>
              <Stack spacing={6}>

                <Flex flex="1" fontSize="sm" overflow="auto">
                  <BreedCategoryMenu.Mobile
                    menus={[
                      {
                        label: 'Dogs',
                        href: '/dashboard?tab=breeds&category=dogs',
                        isActive: currentRoute.includes('dogs')
                      },
                      {
                        label: 'Cats',
                        href: '/dashboard?tab=breeds&category=cats',
                        isActive: currentRoute.includes('cats')
                      },
                      {
                        label: 'Rodents',
                        href: '/dashboard?tab=breeds&category=rodents',
                        isActive: currentRoute.includes('rodents')
                      },
                      {
                        label: 'Fish',
                        href: '/dashboard?tab=breeds&category=fish',
                        isActive: currentRoute.includes('fish')
                      },
                      {
                        label: 'Birds',
                        href: '/dashboard?tab=breeds&category=birds',
                        isActive: currentRoute.includes('birds')
                      },
                      {
                        label: 'Reptiles',
                        href: '/dashboard?tab=breeds&category=reptiles',
                        isActive: currentRoute.includes('reptiles')
                      },
                      {
                        label: 'Amphibians',
                        href: '/dashboard?tab=breeds&category=amphibians',
                        isActive: currentRoute.includes('amphibians')
                      },
                    ]}
                  />

                  <Box
                    maxW="7xl"
                    mx="auto"
                    px={{ base: '4', md: '8' }}
                    py="4"
                    width="full"
                  >
                    <Stack spacing="4" width="full">
                      <Flex
                        justify="space-between"
                        align={{ base: 'start', md: 'center' }}
                        direction={{ base: 'column', md: 'row' }}
                      >
                        <Heading size={{ base: 'sm', lg: 'md' }} mb={{ base: '3', md: '0' }}>
                          Popular Breeds
                        </Heading>
                        <HStack spacing={{ base: '2', md: '3' }}>
                          <Link fontWeight="semibold" color={useColorModeValue('brand.500', 'brand.300')}>
                            See all breeds
                          </Link>
                          <Icon
                            as={FaArrowRight}
                            color={useColorModeValue('brand.500', 'brand.300')}
                            fontSize={{ base: 'sm', md: 'md' }}
                          />
                        </HStack>
                      </Flex>


                      <SimpleGrid
                        spacing="6"
                        columns={{
                          base: 1,
                          md: 2,
                          lg: 4,
                        }}
                        alignContent="flex-start"
                        width="full"

                      >
                        {popularBreeds.slice(3, isMobile ? 7 : 12).map((breed) => (
                          <CategoryCard
                            key={breed.id}
                            category={{
                              name: breed.name,
                              description: breed.group,
                              imageUrl: breed.featured_image_url,
                              id: breed.id,
                            }}
                            rootProps={{ onClick: () => handleBreedClick(breed) }}
                          />
                        ))}
                      </SimpleGrid>
                    </Stack>
                  </Box>
                </Flex>
              </Stack>
            </TabPanel>


            {/* Breeders Tab */}
            <TabPanel p={0}>

            </TabPanel>

          </TabPanels>
        </Stack>
      </Tabs>
    </Box>
  )


};

export default SeekerDashboardOverview;

interface CustomTabBarProps {
  activeTab: number
}

const CustomTabBar = ({ activeTab }: CustomTabBarProps) => {
  // Build URLs that preserve current query parameters
  const isMobile = useBreakpointValue({ base: true, md: false })

  const menuItems = isMobile ? [
    { label: 'All Categories', href: '/dashboard?tab=all&category=dogs', tab: 0 },
    { label: 'Pet Listings', href: '/dashboard?tab=listings&category=dogs', tab: 1 },
    { label: 'Breeds', href: '/dashboard?tab=breeds&category=dogs', tab: 2 },
    { label: 'Breeders', href: '/dashboard?tab=breeders&category=dogs', tab: 3 },

  ] :

    [
      { label: 'All Categories', href: '/dashboard?tab=all&category=dogs', tab: 0 },
      { label: 'Available Pets', href: '/dashboard?tab=listings&category=dogs', tab: 1 },
      { label: 'Popular Breeds', href: '/dashboard?tab=breeds&category=dogs', tab: 2 },
      { label: 'Breeders Near You', href: '/dashboard?tab=breeders&category=dogs', tab: 3 },
    ]

  return (
    <Box
      borderTopWidth="1px"
      borderBottomWidth="1px"
      borderColor={mode('gray.200', 'gray.700')}
      bg={mode('white', 'gray.800')}
      px={{ base: 2, md: 4 }}
    >
      <Box maxW="8xl" mx="auto">
        <HStack spacing="8">
          {menuItems.map((link) => (
            <DesktopNavItem
              key={link.label}
              label={link.label}
              href={link.href}
              isActive={activeTab === link.tab}
            />
          ))}
        </HStack>
      </Box>
    </Box>
  )
}