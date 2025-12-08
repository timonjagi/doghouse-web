import {
  Box,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react'
import * as React from 'react'
import { NavFeaturedImage } from './NavFeaturedImage'
import Link from 'next/link'

const DesktopNavCategorySubmenu = ({ data }: { data: any }) => {
  return (
    <Box bg={mode('white', 'gray.800')} px="8" pt="8" pb="10">
      <Flex justify="space-between" width="full" fontSize="sm" maxW="8xl" mx="auto">
        <Flex width="480px" justify="space-between">
          <Box width="full">
            <Text fontWeight="semibold" mb="6">
              {data.category.label}
            </Text>
            <Stack spacing="4" align="flex-start">
              {data.category.links.map((link, i) => (
                <Link key={i} href={link.href}>{link.label}</Link>
              ))}
            </Stack>
          </Box>
          <Box width="full">
            <Text fontWeight="semibold" mb="6">
              {data.featured.label}
            </Text>
            <Stack spacing="4" align="flex-start">
              {data.featured.links.map((link, i) => (
                <Link key={i} href={link.href}>{link.label}</Link>
              ))}
            </Stack>
          </Box>
        </Flex>
        <Stack direction="row" spacing="8" width="full" maxW="856px">
          <NavFeaturedImage
            label={data.products[0].label}
            imageUrl={data.products[0].imageUrl}
            href={data.products[0].href}
          />
          <NavFeaturedImage
            width=""
            label={data.products[1].label}
            imageUrl={data.products[1].imageUrl}
            href={data.products[1].href}
          />
        </Stack>
      </Flex>
    </Box>
  )
}

const MobileNavCategorySubmenu = ({ data }: { data: any }) => (
  <Box p="5" width="full" height="100%" overflowY="auto">
    <Text fontWeight="bold" mb="4">
      {data.category.label}
    </Text>
    <NavFeaturedImage
      height="32"
      bottomOffset="3"
      label={data.products[0].label}
      imageUrl={data.products[0].imageUrl}
      href={data.products[0].href || '#'}
    />
    <Stack spacing="10" mt="10">
      <Box>
        <Text fontWeight="bold" mb="4">
          {data.category.label}
        </Text>
        <SimpleGrid columns={2} spacing="4">
          {data.category.links.map((link) => (
            <Link key={link.label} href={link.href || '#'}>
              {link.label}
            </Link>
          ))}
        </SimpleGrid>
      </Box>
      <Box>
        <Text fontWeight="bold" mb="4">
          {data.featured.label}
        </Text>
        <SimpleGrid columns={2} spacing="4">
          {data.featured.links.map((link) => (
            <Link key={link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </SimpleGrid>
      </Box>
    </Stack>
  </Box>
)

export const NavCategorySubmenu = {
  Mobile: MobileNavCategorySubmenu,
  Desktop: DesktopNavCategorySubmenu,
}
