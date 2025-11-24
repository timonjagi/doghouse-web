import { Box, SimpleGrid, useColorModeValue as mode } from '@chakra-ui/react'
import * as React from 'react'
import { useRouter } from 'next/router'
import { NavAction } from './NavAction'
import { items } from './NavItemIcons'

export const MobileBottomNav = () => {
  const router = useRouter()

  const navItems = [
    {
      label: items.home.label,
      icon: items.home.icon,
      href: items.home.href,
      isActive: router.pathname === '/dashboard'
    },
    {
      label: items.search.label,
      icon: items.search.icon,
      href: items.search.href,
      isActive: router.pathname.includes('/dashboard/search')
    },
    {
      label: items.wishlist.label,
      icon: items.wishlist.icon,
      href: items.wishlist.href,
      isActive: router.pathname.includes('/dashboard/wishlist')
    },
    {
      label: items.inbox.label,
      icon: items.inbox.icon,
      href: items.inbox.href,
      isActive: router.pathname.includes('/dashboard/inbox')
    },
    {
      label: items.account.label,
      icon: items.account.icon,
      href: items.account.href,
      isActive: router.pathname.includes('/dashboard/account')
    }
  ]

  return (
    <Box
      bg={mode('white', 'gray.800')}
      pos="fixed"
      width="full"
      bottom="env(safe-area-inset-bottom)"
      borderTopWidth="1px"
      display={{ lg: 'none' }}
      zIndex={10}
    >
      <SimpleGrid columns={5} padding="2">
        {navItems.map((item, index) => (
          <NavAction.Mobile
            key={index}
            label={item.label}
            icon={item.icon}
            href={item.href}
            isActive={item.isActive}
          />
        ))}
      </SimpleGrid>
    </Box>
  )
}
