import {
  Box,
  Container,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
  Flex,
  HStack,
  useBreakpointValue,
  IconButton,
  Select,
  useColorModeValue,
  Button,
  ButtonGroup,
  Circle,
  Icon,
  Badge,
  DrawerCloseButton,
  DrawerHeader,
  useToast,
  Spacer,
} from "@chakra-ui/react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiBell, FiCheck, FiHelpCircle, FiMenu } from "react-icons/fi";

import { Logo } from "./Logo";
import { NotificationsDrawer } from "./NotificationsDrawer";
import { SearchInput } from "./SearchInput";
import { Sidebar } from "./Sidebar";
import { MdMenu } from "react-icons/md";
import { useEffect, useMemo, useState } from "react";
import { CurrencySelect } from "../ui/CurrencySelect";
import * as searchService from "lib/services/searchService";
import { useCurrentUser, useUserProfileById, useUnreadNotificationsCount, useNotifications, useMarkAllNotificationsAsRead } from "lib/hooks/queries";

const HeaderWithSearch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDesktop = useBreakpointValue({
    base: false,
    md: true,
  });
  const { isOpen: isSidebarOpen, onToggle: onToggleSidebar, onClose: onCloseSidebar } = useDisclosure();
  const { isOpen: isNotificationsOpen, onToggle: onToggleNotifications, onClose: onCloseNotifications } = useDisclosure();
  const toast = useToast();

  const { data: user } = useCurrentUser();
  const { data: userProfile, isLoading: profileLoading } = useUserProfileById(user?.id as string);
  const { data: unreadCount } = useUnreadNotificationsCount(userProfile?.id);

  const { data: notifications, isLoading, error } = useNotifications(userProfile?.id);
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

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
              onKeyPress={handleKeyPress}
              searchQuery={searchQuery}
              onClear={() => searchService.clearSearchParams(currentFilters)}
            />
          </HStack>
        )}

        {!showSearchBar && <Spacer />}

        <HStack spacing="1">

          <IconButton
            icon={colorMode === 'light' ? <MdDarkMode fontSize="1.25rem" /> : <MdLightMode fontSize="1.25rem" />}
            aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
            variant="ghost"
            onClick={toggleColorMode}
          />

          <Box position="relative">

            {unreadCount > 0 && <Circle size="2" bg="brand.500" position="absolute" top={0} right={1} zIndex={1} />}

            <IconButton
              icon={<FiBell fontSize="1.25rem" />}
              aria-label="Notifications"
              variant="ghost"
              onClick={onToggleNotifications}
            />

          </Box>

        </HStack>
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
            onKeyPress={handleKeyPress}
            searchQuery={searchQuery}
            onClear={() => searchService.clearSearchParams(currentFilters)}
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

      {/* Notifications Drawer */}
      <Drawer
        isOpen={isNotificationsOpen}
        placement="right"
        onClose={onCloseNotifications}
        isFullHeight
        preserveScrollBarGap
        trapFocus={false}
        size={{ base: 'xs', md: 'sm' }}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>

            Notifications

            {unreadCount > 0 && (
              <Badge colorScheme="red" borderRadius="full" px={2} fontSize="xs">
                {unreadCount}
              </Badge>
            )}


            {notifications && notifications.length > 0 && unreadCount > 0 && (
              <Button
                leftIcon={<FiCheck />}
                variant="outline"
                size="xs"
                onClick={handleMarkAllAsRead}
                isLoading={markAllAsReadMutation.isPending}
              >
                Mark All Read
              </Button>
            )}

          </DrawerHeader>

          <NotificationsDrawer
            isOpen={isNotificationsOpen}
            onClose={onCloseNotifications}
            notifications={notifications!}
            isLoading={isLoading}
            error={error}
            unreadCount={unreadCount!}
          />
        </DrawerContent>
      </Drawer>

    </Box>
  );
};

export default HeaderWithSearch;
