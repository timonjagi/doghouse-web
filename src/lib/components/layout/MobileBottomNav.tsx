import { Badge, Box, SimpleGrid, useColorModeValue as mode } from '@chakra-ui/react'
import * as React from 'react'
import { useRouter } from 'next/router'
import { NavAction } from './NavAction'
import { items } from './NavItemIcons'
import { useCurrentUser, useUnreadNotificationsCount } from 'lib/hooks/queries'

export const MobileBottomNav = () => {
  const router = useRouter()
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const profile = user ? { id: user.id, role: user.user_metadata?.role } : null;

  // Wait for auth check to complete before deciding which nav items to show
  // This prevents the flash between different role-based nav items
  const isAuthLoading = userLoading;

  const navItems = profile?.role === 'seeker' ?
    items.filter(item => !item.role || item.role === 'seeker') :
    items.filter(item => !item.role || item.role === 'breeder');
  const [currentRoute, setCurrentRoute] = React.useState('');

  React.useEffect(() => {
    setCurrentRoute(router.pathname);
  }, [router.pathname])
  const { data: unreadCount } = useUnreadNotificationsCount(profile?.id);

  // Don't render anything while auth is loading to prevent flash
  if (isAuthLoading) {
    return null;
  }

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
            isActive={currentRoute === item.href}
          >
            {unreadCount > 0 && item.href.includes('inbox') && (
              <Badge
                rounded="full"
                variant="subtle"
                colorScheme="brand"
                size="sm"
                position="absolute"
                top="-3"
                right="-3"
              >
                {unreadCount}
              </Badge>
            )}
          </NavAction.Mobile>
        ))}
      </SimpleGrid>
    </Box>
  )
}

