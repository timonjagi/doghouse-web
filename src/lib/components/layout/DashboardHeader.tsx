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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiBell, FiHelpCircle, FiMenu } from "react-icons/fi";

import { Logo } from "./Logo";
import { NotificationsDrawer } from "./NotificationsDrawer";
import { SearchInput } from "./SearchInput";
import { Sidebar } from "./Sidebar";
import { MdMenu } from "react-icons/md";
import { useEffect, useMemo, useState } from "react";
import { CurrencySelect } from "../ui/CurrencySelect";
import * as searchService from "lib/services/searchService";

const DashboardHeader = () => {
  const isDesktop = useBreakpointValue({
    base: false,
    md: true,
  });
  const { isOpen: isSidebarOpen, onToggle: onToggleSidebar, onClose: onCloseSidebar } = useDisclosure();
  const { isOpen: isNotificationsOpen, onToggle: onToggleNotifications, onClose: onCloseNotifications } = useDisclosure();

  const router = useRouter();
  const { pathname } = router;
  // Show search bar only on Home (/dashboard) and Search (/dashboard/search) pages
  const [showSearchBar, setShowSearchbar] = useState(true);

  //pathname && pathname === '/dashboard' || pathname === '/dashboard/search';
  useEffect(() => {
    setShowSearchbar(pathname === '/dashboard' || pathname === '/dashboard/search')
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


  return (
    <Box
      as="nav"

      zIndex={3}
      position="sticky"
      top="0"
    >
      <Container
        py={{
          base: "4",
          lg: "4",
        }}
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
          {isDesktop && (

            <HStack flex="1" mx={{ base: "8", lg: "0" }}>

              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                searchQuery={searchQuery}
                onClear={() => searchService.clearSearchParams(router, currentFilters)}
              />
            </HStack>
          )}

          {/* Right side - Notifications and Profile */}
          <HStack spacing="1">

            <IconButton
              icon={<FiHelpCircle fontSize="1.25rem" />}
              aria-label="Help & Support"
              variant="ghost-on-accent"
              onClick={() => router.push('/support')}
            />

            <IconButton
              icon={<FiBell fontSize="1.25rem" />}
              aria-label="Notifications"
              variant="ghost-on-accent"
              onClick={onToggleNotifications}
            />



            {/* <Box
              as={FiBell}
              aria-label="Notifications"
              fontSize="2xl"
              onClick={onToggleNotifications}
            /> */}


            {/* {user ? (
              <UserProfileMenu
                name={user?.user_metadata?.display_name || user?.email || ""}
                image={user?.user_metadata?.avatar_url || ""}
                email={user?.email || ""}
              />
            ) : (
              <Button
                variant="secondary-on-accent"
                rounded="full"
                borderColor="white"
                onClick={() => router.push("/login")}
              >
                Log in
              </Button>
            )} */}
          </HStack>
        </Flex>

        {/* Mobile Search Bar */}
        {!isDesktop && (
          <HStack flex="1" >
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              searchQuery={searchQuery}
              onClear={() => searchService.clearSearchParams(router, currentFilters)}
            />
          </HStack>
        )}
      </Container>

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
      >
        <DrawerOverlay />
        <DrawerContent>
          <NotificationsDrawer
            isOpen={isNotificationsOpen}
            onClose={onCloseNotifications}
            notifications={[]}
            isLoading={false}
            error={null}
            unreadCount={0}
          />
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default DashboardHeader;
