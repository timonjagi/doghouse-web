import {
  Box,
  Button,
  Container,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
  Flex,
  HStack,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiBell, FiHelpCircle, FiMenu } from "react-icons/fi";

import { Logo } from "./Logo";
import UserProfileMenu from "lib/components/layout/UserProfileMenu";
import { NotificationsDrawer } from "./NotificationsDrawer";
import { SearchInput } from "./SearchInput";
import { useUserProfile } from "lib/stores/useAppStore";
import { Sidebar } from "./Sidebar";
import { useSupabaseAuth } from "lib/hooks/useSupabaseAuth";
import { MdMenu } from "react-icons/md";
import { useEffect, useState } from "react";

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
  }, [pathname, router]);


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
          <HStack spacing="4">
            {/* <IconButton
              icon={<FiMenu fontSize="1.25rem" />}
              aria-label="Open Menu"
              variant="ghost-on-accent"
              onClick={onToggleSidebar}
            /> */}

            <Box as={MdMenu} fontSize="3xl" onClick={onToggleSidebar}
            />

            <Logo color="on-brand" />

          </HStack>

          {/* Center - Conditional Search Bar */}
          {isDesktop && showSearchBar && (
            <Box flex="1" mx="8">
              <SearchInput />
            </Box>
          )}

          {/* Right side - Notifications and Profile */}
          <HStack spacing="4">
            {/* {user && (
              <IconButton
                icon={<FiBell fontSize="1.25rem" />}
                aria-label="Notifications"
                variant="ghost-on-accent"
                onClick={onToggleNotifications}
              />
            )} */}

            <Box
              as={FiHelpCircle}
              fontSize="2xl"
              onClick={() => router.push("/help")}
              color="subtle"
            />
            <Box
              as={FiBell}
              aria-label="Notifications"
              fontSize="2xl"
              onClick={onToggleNotifications}
            />


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
        {!isDesktop && showSearchBar && (
          <Box mt="4">
            <SearchInput />
          </Box>
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
