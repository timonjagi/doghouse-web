import { Box, Flex, HStack, Stack, useBreakpointValue, useColorModeValue as mode, Tab, TabList, TabPanel, TabPanels, Tabs, VisuallyHidden, SimpleGrid, Heading, Icon, Link, useColorModeValue, Alert, AlertIcon } from '@chakra-ui/react'
import { NavCategorySubmenu } from 'lib/components/ui/NavCategorySubmenu'
import { NavCategoryMenu } from 'lib/components/ui/NavCategoryMenu'
import { Loader } from 'lib/components/ui/Loader';
import { useSeekerDashboard } from 'lib/hooks/queries/useSeekerDashboard'
import React, { useEffect } from 'react';
import * as searchService from 'lib/services/searchService'
import { useRouter } from 'next/router';
import { useIncrementListingViews } from 'lib/hooks/queries/useListings';
import { ShowcaseOnSpanningColumns } from 'lib/components/ui/ShowcaseOnSpanningColumns';
import { CategoryCard } from 'lib/components/ui/CatetgoryCard';
import { DesktopNavItem } from 'lib/components/ui/NavCategory/NavCategoryMenu';
import { FaArrowRight } from 'react-icons/fa';
import { useCategories } from 'lib/hooks/queries/useCategories';
import { NavMenu } from 'lib/components/ui/NavMenu';
import { BreedersList } from 'lib/components/ui/BreederList';

const SeekerDashboardOverview: React.FC = () => {
  const router = useRouter();
  const isDesktop = useBreakpointValue({ base: false, md: true })

  // Use the unified dashboard hook to fetch data for dynamic navigation
  const { data: dashboardData, isLoading, error } = useSeekerDashboard();
  // refactor to usePopularBreeds hook
  const incrementViewsMutation = useIncrementListingViews()

  const popularListings = dashboardData?.popularListings || [];
  const newListings = dashboardData?.newListings || [];
  const featuredBreeders = dashboardData?.featuredBreeders || [];
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

  useEffect(() => {
    handleTabChange(getTabIndex(router.query.tab))
  }, [router.query.tab])

  const handleTabChange = (tabIndex: number) => {
    setActiveTab(tabIndex)
  }

  const filters = React.useMemo(() => searchService.parseSearchParams(router.query), [router.query])

  const [activeTab, setActiveTab] = React.useState(getTabIndex(filters.tab))

  const { data: categories } = useCategories('dashboard', filters.tab);

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return <Alert status="error">
      <AlertIcon />
      Error loading dashboard data. {error.message}
    </Alert>
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
              <Flex flex="1" fontSize="sm" overflow="auto" gap="4" align="top">


                <NavCategoryMenu.Mobile
                  menus={categories.petTypes}
                />

                <SimpleGrid
                  spacing="6"
                  columns={{
                    base: 2,
                    sm: 3,
                    lg: 4
                  }}
                  alignContent="flex-start"
                  width="full"

                >
                  {categories.breedGroups.map((group, index) => (
                    <CategoryCard
                      key={index}
                      category={{
                        name: group.label,
                        description: group.description,
                        imageUrl: group.featuredImage,
                        id: index.toString(),
                        href: group.href
                      }}
                      rootProps={{ onClick: () => router.push(group.href) }}
                    />
                  ))}
                </SimpleGrid>
              </Flex>
            </TabPanel>

            {/* Listings Tab */}
            <TabPanel p={0}>
              <Stack>

                <Flex flex="1" fontSize="sm" overflow="auto">

                  {isDesktop && <NavCategoryMenu.Mobile
                    menus={categories.petTypes}
                  />}

                  {isDesktop && (
                    <NavMenu.Desktop
                      data={{
                        category: {
                          label: 'Categories',
                          links: categories.listings,
                        },
                        featured: {
                          label: 'Popular Breeds',
                          links: popularBreeds?.map(breed => ({
                            label: breed.name,
                            url: `/dashboard/breeds/${encodeURIComponent(breed.name)}`,
                          }))
                        },
                        products: popularListings.map(listing => ({
                          name: listing.title,
                          price: listing.price,
                          currency: 'KES',
                          href: `/dashboard/listings/${listing.id}`,
                          imageUrl: listing.photos[0],
                        }))
                      }}
                    />
                  )}

                  {/* Mobile Layout - Categories and Navigation */}
                  {!isDesktop && <NavMenu.Mobile
                    data={{
                      category: {
                        label: '',
                        links: [],
                      },
                      featured: {
                        label: 'Popular Breeds',
                        links: popularBreeds?.map(breed => ({
                          label: breed.name,
                          url: `/dashboard/breeds/${encodeURIComponent(breed.name)}`,
                        }))
                      },
                      products: [
                        {
                          label: 'Dogs',
                          products: popularListings.map(listing => ({
                            name: listing.title,
                            price: listing.price,
                            currency: 'KES',
                            href: `/dashboard/listings/${listing.id}`,
                            imageUrl: listing.photos[0],
                          }))
                        },
                        {
                          label: 'Cats',
                          products: newListings.map(listing => ({
                            name: listing.title,
                            price: listing.price,
                            currency: 'KES',
                            href: `/dashboard/listings/${listing.id}`,
                            imageUrl: listing.photos[0],
                          }))
                        },
                      ]
                    }}
                  />
                  }
                </Flex>

              </Stack>
            </TabPanel>

            {/* Breeds Tab */}
            <TabPanel p={0}>
              <Stack spacing={6}>

                <Flex flex="1" fontSize="sm" overflow="auto">
                  <NavCategoryMenu.Mobile
                    menus={categories.petTypes}
                  />

                  {isDesktop ?
                    <NavCategorySubmenu.Desktop
                      data={{
                        category: {
                          label: 'Categories',
                          links: categories.breeds,
                        },
                        featured: {
                          label: 'Breed Groups',
                          links: categories.breedGroups
                        },
                        products: popularBreeds.map(breed => ({
                          label: breed.name,
                          href: `/dashboard/breeds/${encodeURIComponent(breed.name)}`,
                          imageUrl: breed.featured_image_url,
                        }))
                      }}
                    />
                    :
                    <NavCategorySubmenu.Mobile
                      data={{
                        category: {
                          label: 'Categories',
                          links: categories.breeds,
                        },
                        featured: {
                          label: 'Popular',
                          links: popularBreeds?.map(breed => ({
                            label: breed.name,
                            href: `/dashboard/breeds/${encodeURIComponent(breed.name)}`,
                          }))
                        },
                        products: popularBreeds.map(breed => ({
                          label: breed.name,
                          href: `/dashboard/breeds/${encodeURIComponent(breed.name)}`,
                          imageUrl: breed.featured_image_url,
                        }))
                      }}
                    />
                  }
                </Flex>
              </Stack>
            </TabPanel>


            {/* Breeders Tab */}
            <TabPanel p={0}>
              <BreedersList
                breeders={featuredBreeders}
                isLoading={isLoading}
                showLoader={false}
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={4}
                emptyMessage="No breeders found"
              />
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