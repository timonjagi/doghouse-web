import {
  Box,
  BoxProps,
  Flex,
  FlexProps,
  HStack,
  Stack,
  useColorModeValue as mode,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'

type NavItemProps = {
  isActive?: boolean
  href?: string
  label?: string
}

export const DesktopNavItem = (props: FlexProps & NavItemProps) => {
  const { isActive, label, href = '#', ...rest } = props
  return (
    <Flex
      as={Link}
      href={href}
      direction="column"
      justify="center"
      minH="10"
      fontSize="sm"
      fontWeight="medium"
      position="relative"
      aria-current={isActive ? 'page' : undefined}
      color={mode('gray.600', 'gray.400')}
      _activeLink={{
        borderBottomWidth: '2px',
        borderColor: 'currentColor',
        color: mode('brand.500', 'brand.300'),
      }}
      _hover={{
        color: mode('brand.500', 'brand.300'),
      }}
      {...rest}
    >
      {label}
    </Flex>
  )
}

const MobileNavItem = (props: BoxProps & NavItemProps) => {
  const { label, href, isActive, ...rest } = props
  return (
    <Box
      as={Link}
      href={href}
      aria-current={isActive ? 'page' : undefined}
      py="2"
      px="3"
      _activeLink={{
        bg: mode('white', 'gray.600'),
        shadow: 'base',
      }}
      {...rest}
    >
      {label}
    </Box>
  )
}

const NavItem = {
  Desktop: DesktopNavItem,
  Mobile: MobileNavItem,
}

interface NavCategoryMenuProps {
  listings?: any[]
  breeders?: any[]
  breeds?: any[]
}

export const DesktopNavCategoryMenu: React.FC<NavCategoryMenuProps> = ({
  listings = [],
  breeders = [],
  breeds = []
}) => {
  const router = useRouter();


  React.useEffect(() => {

  }, [router.pathname]);
  // Generate dynamic menu items based on data, all linking to unified search
  const menuItems =
    [
      {
        label: 'All Categories',
        href: '/dashboard',
      },
      ...(listings.length > 0 ? [{ label: 'Available Pets', href: '/dashboard/search?tab=listings' }] : []),
      ...(breeds.length > 0 ? [{ label: 'Popular Breeds', href: '/dashboard/search?tab=breeds' }] : []),

      ...(breeders.length > 0 ? [{ label: 'Breeders Near You', href: '/dashboard/search?tab=breeders' }] : []),
      { label: 'Pet Care Services', href: '/dashboard/search?tab=services' },

    ]

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
            <NavItem.Desktop key={link.label} {...link} isActive={link.label === 'Breeds'} />
          ))}
        </HStack>
      </Box>
    </Box>
  )
}

export const MobileNavCategoryMenu: React.FC<NavCategoryMenuProps> = ({
  listings = [],
  breeders = [],
  breeds = []
}) => {

  const router = useRouter();
  // Generate dynamic menu items based on data, all linking to unified search
  const menuItems = [
    { label: 'All Categories', href: '/dashboard/search' },
    ...(listings.length > 0 ? [{ label: 'Popular Listings', href: '/dashboard/search?tab=listings' }] : []),
    ...(breeds.length > 0 ? [{ label: 'Popular Breeds', href: '/dashboard/search?tab=breeds' }] : []),
    ...(breeders.length > 0 ? [{ label: 'Breeders', href: '/dashboard/search?tab=breeders' }] : []),
    { label: 'New Arrivals', href: '/dashboard/search?tab=listings&sort=newest' },
  ];

  const searchMenuItems = [
    { label: 'All Categories', href: '/dashboard/search' },
    ...(listings.length > 0 ? [{ label: 'Listings', href: '/dashboard/search?tab=listings' }] : []),
    ...(breeds.length > 0 ? [{ label: 'Breeds', href: '/dashboard/search?tab=breeds' }] : []),
    ...(breeders.length > 0 ? [{ label: 'Breeders', href: '/dashboard/search?tab=breeders' }] : []),
    { label: 'New Arrivals', href: '/dashboard/search?tab=listings&sort=newest' },
  ];

  return (
    <Box
      width="32%"
      minW="100px"
      bg={mode('gray.50', 'gray.700')}
      color={mode('gray.600', 'gray.100')}
      borderEndWidth="1px"
      py="6"
    >
      {router.pathname === '/dashboard' && <Stack spacing="1">
        {menuItems.map((link) => (
          <NavItem.Mobile key={link.label} {...link} isActive={link.label === 'Breeds'} />
        ))}
      </Stack>}
      {router.pathname === '/dashboard/search' && <Stack spacing="1">
        {searchMenuItems.map((link) => (
          <NavItem.Mobile key={link.label} {...link} isActive={link.label === 'Breeds'} />
        ))}
      </Stack>}


    </Box>
  )
}

export const NavCategoryMenu = {
  Mobile: MobileNavCategoryMenu,
  Desktop: DesktopNavCategoryMenu,
}
