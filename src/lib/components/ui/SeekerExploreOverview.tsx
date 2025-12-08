import { Box, Flex, Stack, useBreakpointValue, useColorModeValue as mode, Tab, TabList, TabPanel, TabPanels, Tabs, VisuallyHidden, SimpleGrid, Alert, AlertIcon, HStack } from '@chakra-ui/react'
import { NavCategorySubmenu } from 'lib/components/ui/NavCategorySubmenu'
import { NavCategoryMenu } from 'lib/components/ui/NavCategoryMenu'
import { NavMenu } from 'lib/components/ui/NavMenu';

import { Loader } from 'lib/components/ui/Loader';
import { useSeekerDashboard } from 'lib/hooks/queries/useSeekerDashboard'
import React, { useEffect, useState } from 'react';
import * as searchService from 'lib/services/searchService'
import { useRouter } from 'next/router';
import { useIncrementListingViews } from 'lib/hooks/queries/useListings';
import { CategoryCard } from 'lib/components/ui/CatetgoryCard';
import { TabBar } from 'lib/components/ui/TabBar';
import { Category, useCategories } from 'lib/hooks/queries/useCategories';
import { BreedersList } from 'lib/components/ui/BreederList';

const SeekerExploreOverview: React.FC = () => {
  const router = useRouter();
  const isDesktop = useBreakpointValue({ base: false, md: true })

  // Use the unified dashboard hook to fetch data for dynamic navigation
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useSeekerDashboard();

  const popularListings = dashboardData?.popularListings || [];
  const newListings = dashboardData?.newListings || [];
  // const saleListings = dashboardData?.saleListings || [];
  const popularBreeds = dashboardData?.popularBreeds || [];
  const featuredBreeders = dashboardData?.featuredBreeders || [];

  const filters = React.useMemo(() => searchService.parseSearchParams(router.query), [router.query])

  const [activeTab, setActiveTab] = useState(filters.tab)

  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories(
    {
      page: router.pathname.includes('explore') ? 'explore' : 'dashboard',
      tab: activeTab, isDesktop
    });


  const getTabIndex = (tabParam: string | string[] | undefined): number => {
    const index = categories?.tabMenuItems.findIndex((item: Category) => item.tab === tabParam);

    if (index === -1) {
      return 0;
    }
    return index;
  }

  const [activeTabIndex, setActiveTabIndex] = useState(getTabIndex(filters.tab))


  useEffect(() => {
    setActiveTab(router.query.tab as string)
    setActiveTabIndex(getTabIndex(router.query.tab as string))
    handleTabChange(getTabIndex(router.query.tab as string))
  }, [router.query.tab])

  const handleTabChange = (tabIndex: number) => {
    setActiveTabIndex(tabIndex)
    window.scrollTo(0, 0)
  }

  const isLoading = dashboardLoading || categoriesLoading
  const error = dashboardError || categoriesError

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
    <Box w="full" h="full" bg="bg-surface">

      <TabBar menuItems={categories.tabMenuItems} activeTab={activeTab} />

      <Tabs
        index={activeTabIndex}
        onChange={handleTabChange}
        variant="soft-rounded"
        colorScheme="brand"
      >

        <VisuallyHidden>
          <TabList>
            {categories.tabMenuItems.map((item, index) => (
              <Tab key={index}>{item.label}</Tab>
            ))}
          </TabList>
        </VisuallyHidden>

        <Stack
          bg={{ base: '', md: mode('white', 'gray.800') }}
        >
          <TabPanels>

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
                          href: `/dashboard/search?q={encodeURIComponent(breed.name)}`,
                          imageUrl: breed.featured_image_url,
                        }))
                      }}
                    />
                    :
                    <NavCategorySubmenu.Mobile
                      data={{
                        category: {
                          label: 'Popular Breeds',
                          links: categories.breeds,
                        },
                        featured: {
                          label: 'Popular Breeds',
                          links: popularBreeds?.map(breed => ({
                            label: breed.name,
                            href: `/dashboard/search?q=${encodeURIComponent(breed.name)}`,
                          }))
                        },
                        products: popularBreeds.map(breed => ({
                          label: breed.name,
                          href: `/dashboard/search?q=${encodeURIComponent(breed.name)}`,
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
                            href: `/dashboard/breeds/${encodeURIComponent(breed.name)}`,
                          }))
                        },
                        products: popularListings.map(listing => ({
                          id: listing.id,
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
                      products: [
                        {
                          label: 'Dogs',
                          products: popularListings.map(listing => ({
                            id: listing.id,
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
                            id: listing.id,
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

            <TabPanel p={0}>
              <Stack spacing={6}>

              </Stack>
            </TabPanel>

          </TabPanels>
        </Stack>
      </Tabs>
    </Box >
  )


};

export default SeekerExploreOverview;

