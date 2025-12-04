import {
  Box,
  Flex,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react'
import * as React from 'react'
import NextLink from 'next/link'
import { NavProductItem } from './NavProductItem'
import { Listing } from '../../../../db/schema'

interface NavCategorySubmenuProps {
  breedCategories?: any[]
  popularBreeds?: any[]
  popularListings?: any[]
}

// Helper function to get data for components that need it
// Takes breedCategories and popularBreeds (sorted by breeder_count field)
const getNavData = (breedCategories: any[] = [], popularBreeds: any[] = []) => ({
  category: {
    label: 'Categories',
    // Use breedCategories for categories (breeds grouped by name/listing count)
    links: breedCategories
  },
  featured: {
    label: 'Popular Breeds',
    // Use popularBreeds, already sorted by breeder_count field
    links: popularBreeds
      .map((breed: any) => ({
        label: breed.breeds?.name.charAt(0).toUpperCase() + breed.breeds?.name.slice(1) || 'Unknown Breed',
        url: `/dashboard/search?tab=listings&q=${encodeURIComponent(breed.breeds?.name || '')}`
      }))
  },
})

export const DesktopNavCategorySubmenu: React.FC<NavCategorySubmenuProps> = ({
  breedCategories,
  popularBreeds,
  popularListings,
}) => {
  // Get dynamic nav data
  const navData = getNavData(breedCategories, popularBreeds)

  return (
    <Box bg={mode('white', 'gray.800')} px="8" pt="8" pb="10" >
      <Flex justify="space-between" width="full" fontSize="sm" maxW="8xl" mx="auto">
        <Flex width="480px" justify="space-between">
          <Box width="full">
            <Text fontWeight="semibold" mb="6">
              {navData.category.label}
            </Text>
            <Stack spacing="4" align="flex-start">
              {navData.category.links.map((link, i) => (
                <Link as={NextLink} key={i} href={link.url}>{link.label}</Link>
              ))}
            </Stack>
          </Box>
          <Box width="full">
            <Text fontWeight="semibold" mb="6">
              {navData.featured.label}
            </Text>
            <Stack spacing="4" align="flex-start">
              {navData.featured.links.map((breed: any) => (
                <Link as={NextLink} key={breed.id} href={breed.url}>
                  {breed.label}
                </Link>
              ))}

            </Stack>
          </Box>
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
          maxW={{
            base: '400px',
            lg: '780px',
          }}
        >
          {popularListings?.map((listing: Listing) => (
            <NavProductItem
              key={listing.id}
              href={`/dashboard/listings/${listing.id}`}
              imageUrl={listing.photos[0]}
              name={listing.title}
              price={listing.price}
              currency={'KES'}
            />
          ))}
        </SimpleGrid>
      </Flex>
    </Box>
  )
}

const MobileNavCategorySubmenu: React.FC<NavCategorySubmenuProps> = ({ breedCategories, popularBreeds, popularListings }) => {
  // Get dynamic nav data with breed categories
  const navData = getNavData(breedCategories, popularBreeds)
  return (
    <Box width="full" height="100%" overflowY="auto" p={5}>
      <Stack spacing="2">
        <Text fontWeight="bold" mb="4">
          Discover
        </Text>

        <SimpleGrid
          spacing="6"
          columns={{
            base: 2,
            md: 3,
            lg: 4,
          }}
          alignContent="flex-start"
          width="full"
          maxW={{
            base: '400px',
            lg: '780px',
          }}
        >
          {popularListings?.map((listing) => (
            <NavProductItem
              key={listing.id}
              href={`/dashboard/listings/${listing.id}`}
              imageUrl={listing.photos[0]}
              name={listing.title}
              price={listing.price}
              currency={'KES'}
            />
          ))}
        </SimpleGrid>

        <Stack spacing="10" mt="10">
          <Box width="full">
            <Text fontWeight="bold" mb="4">
              {navData.category.label}
            </Text>
            <SimpleGrid columns={2} spacing="4">
              {navData.category.links.map((link) => (
                <NextLink key={link.label} href={link.url}>
                  {link.label}
                </NextLink>
              ))}
            </SimpleGrid>
          </Box>

          <Box width="full">
            <Text fontWeight="bold" mb="4">
              {navData.featured.label}
            </Text>
            <SimpleGrid columns={2} spacing="4">
              {navData.featured.links.map((link, i) => (
                <NextLink key={i} href={link.url}>
                  {link.label}
                </NextLink>
              ))}

            </SimpleGrid>
          </Box>
        </Stack>
      </Stack>
    </Box>
  )
}

export const NavCategorySubmenu = {
  Mobile: MobileNavCategorySubmenu,
  Desktop: DesktopNavCategorySubmenu,
}
