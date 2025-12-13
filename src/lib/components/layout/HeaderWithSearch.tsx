import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
  Flex,
  HStack,
  useBreakpointValue,
  IconButton,
  Button,
  Circle,
  Badge,
  DrawerCloseButton,
  DrawerHeader,
  useToast,
  Spacer,
} from "@chakra-ui/react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiBell, FiCheck, FiMenu } from "react-icons/fi";

import { Logo } from "./Logo";
import { NotificationsDrawer } from "./NotificationsDrawer";
import { SearchInput } from "./SearchInput";
import { Sidebar } from "./Sidebar";
import { useEffect, useMemo, useState } from "react";
import * as searchService from "lib/services/searchService";
import { useCurrentUser, useUserProfileById, useUnreadNotificationsCount, useNotifications, useMarkAllNotificationsAsRead } from "lib/hooks/queries";

const HeaderWithSearch = ({ rightElement }) => {
  const isDesktop = useBreakpointValue({
    base: false,
    md: true,
  });
  const { isOpen: isSidebarOpen, onToggle: onToggleSidebar, onClose: onCloseSidebar } = useDisclosure();
  const toast = useToast();

  const { data: user } = useCurrentUser();
  const { data: userProfile, isLoading: profileLoading } = useUserProfileById(user?.id as string);


  const router = useRouter();
  const { pathname } = router;
  // Show search bar only on Home (/dashboard) and Search (/dashboard/search) pages
  const [showSearchBar, setShowSearchbar] = useState(true);

  //pathname && pathname === '/dashboard' || pathname === '/dashboard/search';
  useEffect(() => {
    const isSearchPage = pathname === '/dashboard/search';
    const isSeeker = userProfile?.role === 'seeker';
    setShowSearchbar(isSearchPage || isSeeker)
    setSearchQuery(router.query?.q as string || '');
  }, [pathname, router]);

  const [searchQuery, setSearchQuery] = useState(router.query?.q as string || '');
  const currentFilters = useMemo(() => searchService.parseSearchParams(router.query), [router.query])

  const handleSearch = () => {
    // Parse existing filters from URL if on search page
    const currentFilters = pathname === '/dashboard/search'
      ? searchService.parseSearchParams(router.query)
      : searchService.getDefaultFilters();

    // Update search query while preserving other filters
    const updatedFilters: searchService.SearchFilters = {
      ...currentFilters,
      q: searchQuery,
      tab: currentFilters.tab || 'all', // Default to all tab to show summary
    };

    // Build query params using search service
    const params = searchService.buildQueryParams(updatedFilters);

    router.push({
      pathname: '/dashboard/search',
      query: params
    });
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const { data: unreadCount } = useUnreadNotificationsCount(userProfile?.id);

  const { data: notifications, isLoading, error } = useNotifications(userProfile?.id);
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const handleMarkAllAsRead = async () => {
    if (!userProfile?.id) return;

    try {
      await markAllAsReadMutation.mutateAsync(userProfile.id);
      toast({
        title: 'All notifications marked as read',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error updating notifications',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };


  return (
    <Box
      as="nav"
      zIndex={3}
      position="sticky"
      top="0"
      bg="g-surface"
    >
      <Flex justify="space-between" align="center">
        {/* Left side - Logo and Menu Button */}


        {!isDesktop && <HStack spacing="0" align="center">
          <IconButton
            icon={<FiMenu fontSize="1.25rem" />}
            aria-label="Open Menu"
            variant="ghost"
            onClick={onToggleSidebar}
          />

          {/* <Box as={MdMenu} fontSize="3xl" onClick={onToggleSidebar} */}


          <Logo color="on-brand" />

        </HStack>}

        {/* Center - Conditional Search Bar */}
        {isDesktop && showSearchBar && (

          <HStack
            flex="1"
            mx={{ base: "8", lg: "4" }}
            my={{ base: "2", lg: "4" }}
          >

            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              searchQuery={searchQuery}
              onClear={() => searchService.clearSearchParams(currentFilters)}
            />
          </HStack>
        )}

        {!showSearchBar && <Spacer />}

        {rightElement}
      </Flex>



      {/* Mobile Search Bar */}
      {!isDesktop && showSearchBar && (
        <HStack flex="1"

          mx={{ base: "4", lg: "4" }}
          mb={{ base: "4", lg: "4" }}
        >
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            searchQuery={searchQuery}
            onClear={() => searchService.clearSearchParams(currentFilters)}
            variant="subtle"
            placeholder="Search for pets, breeds, or locations..."
            colorScheme="gray"
          />
        </HStack>
      )}

      {/* Sidebar Drawer */}
      <Drawer
        isOpen={isSidebarOpen}
        placement="left"
        onClose={onCloseSidebar}
        isFullHeight
        preserveScrollBarGap
        trapFocus={false}
      >
        <DrawerOverlay />
        <DrawerContent>
          {/* Sidebar content would go here */}
          <Sidebar onClose={onCloseSidebar} />
        </DrawerContent>
      </Drawer>

    </Box>
  );
};

export default HeaderWithSearch;
