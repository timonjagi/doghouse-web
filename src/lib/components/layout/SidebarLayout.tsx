import {
  useBreakpointValue,
  Flex,
  Box,
  Circle,
  HStack,
  IconButton,
  useColorMode,
  Badge,
  Button,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import RouteGuard from "../auth/RouteGuard";
import { TopBanner } from "../ui/TopBanner";
import HeaderWithSearch from "./HeaderWithSearch";
import { HeaderWithTitle } from "./HeaderWithTitle";
import { MobileBottomNav } from "./MobileBottomNav";
import { Sidebar } from "./Sidebar";
import { ReactNode } from "react";
import { useCurrentUser, useMarkAllNotificationsAsRead, useNotifications, useUnreadNotificationsCount, useUserProfileById } from "lib/hooks/queries";
import { FiBell, FiCheck, FiMoon, FiSun } from "react-icons/fi";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { notifications } from "lib/db/schema";
import error from "next/error";
import { NotificationsDrawer } from "./NotificationsDrawer";
import { NotificationBadge } from "./NotificationBadge";

type LayoutProps = {
  children: ReactNode;
};

// Detail page routes contain dynamic segments like [id], [chatId], [slug]
const DETAIL_PAGE_PATTERNS = [
  "/dashboard/inbox/[conversationId]",
  "/dashboard/breeds/[breedName]",
  "/dashboard/breeds/[id]",
  "/dashboard/breeders/[id]",
  "/dashboard/listings/[id]",
  "/dashboard/adoptions/[id]",
  "/dashboard/breeders/[id]/breeds/[userBreedId]",
];

export const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const toast = useToast();

  const { isOpen: isNotificationsOpen, onToggle: onToggleNotifications, onClose: onCloseNotifications } = useDisclosure();

  const { data: user } = useCurrentUser();
  const { data: userProfile } = useUserProfileById(user?.id as string);
  const profile = userProfile || (user ? { role: user.user_metadata?.role } : null);
  const [mainIsScrolled, setMainIsScrolled] = useState(false);


  const { data: unreadCount } = useUnreadNotificationsCount(user?.id);

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

  const breedName = router.query.breedName;
  const showTopBanner = false;

  // Check if current route is a detail page
  const isDetailPage = DETAIL_PAGE_PATTERNS.some(
    (pattern) => router.pathname === pattern
  );

  const searchHeaderHeight = 64;
  const detailHeaderHeight = isMobile ? 40 : 48;
  const headerHeight = isDetailPage
    ? detailHeaderHeight
    : searchHeaderHeight;
  const bannerHeight = 21;
  const footerHeight = 64;
  const detailPageContainerHeight = isDetailPage
    ? detailHeaderHeight
    : searchHeaderHeight;



  return (
    <RouteGuard>
      {/* {isMobile && showTopBanner && (
        <TopBanner label="Welcome to Pethouse! Find your perfect furry friend today." />
      )} */}

      {isMobile && !isDetailPage && <HeaderWithSearch rightElement={
        <HeaderButtons unreadCount={unreadCount} onToggleNotifications={onToggleNotifications} />}
      />}
      {isMobile && isDetailPage && (
        <HeaderWithTitle
          title={breedName as string ||
            router.pathname.includes('breeds') ? 'Breed Details' :
            router.pathname.includes('breeders') ? 'Breeder Details' :
              router.pathname.includes('listings') ? 'Listing Details' :
                router.pathname.includes('adoptions') ? 'Adoption Details' :
                  router.pathname.includes('inbox') ? 'Inbox Chat' :
                    'Details'
          }
          isScrolled={mainIsScrolled}
          rightElement={
            <HeaderButtons unreadCount={unreadCount} onToggleNotifications={onToggleNotifications} />}
        />
      )}
      <Flex height={{ base: "100dvh", lg: "100vh" }}>
        {/* Primary Navigation Sidebar - Desktop only */}
        <Box
          h={{
            base: showTopBanner
              ? `calc(100dvh - ${headerHeight + bannerHeight})px`
              : `calc(100dvh - ${headerHeight}px)`,
            lg: "full"
          }}
          width={{
            lg: "14rem",
            xl: "18rem",
          }}
          display={{
            base: "none",
            lg: "initial",
          }}
          overflowY="auto"
          borderRightWidth="1px"
        >
          <Sidebar onClose={() => { }} />
        </Box>

        {/* Main Content Area - Children control inner sidebar + main */}
        <Box
          flex="1"
          h={{
            base: profile?.role === "seeker" && !isDetailPage
              ? `calc(100dvh - ${searchHeaderHeight + footerHeight + (showTopBanner ? bannerHeight : 0)}px)`
              : `calc(100dvh - ${detailHeaderHeight + footerHeight + (showTopBanner ? bannerHeight : 0)}px)`,
            lg: "full"
          }}
          overflowY="auto"
          display="flex"
          flexDirection="column"
          onScroll={(e) => setMainIsScrolled(e.currentTarget.scrollTop > 32)}
        >
          {/* Conditionally render header based on page type */}
          {isDesktop && !isDetailPage && <HeaderWithSearch
            rightElement={
              <HeaderButtons unreadCount={unreadCount} onToggleNotifications={onToggleNotifications} />}
          />}
          {isDesktop && isDetailPage && (
            <HeaderWithTitle
              title={breedName as string ||
                router.pathname.includes('breeds') ? 'Breed Details' :
                router.pathname.includes('breeders') ? 'Breeder Details' :
                  router.pathname.includes('listings') ? 'Listing Details' :
                    router.pathname.includes('adoptions') ? 'Adoption Details' :
                      router.pathname.includes('inbox') ? 'Inbox Chat' :
                        'Details'
              }

              isScrolled={mainIsScrolled}
              rightElement={
                <HeaderButtons unreadCount={unreadCount} onToggleNotifications={onToggleNotifications} />
              }

            />
          )}
          {children}
        </Box>
      </Flex>

      {isMobile && <MobileBottomNav />}


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
          />
        </DrawerContent>
      </Drawer>

    </RouteGuard>
  );
};

const HeaderButtons = ({ unreadCount, onToggleNotifications }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <HStack spacing="1">

      <IconButton
        icon={colorMode === 'light' ? <FiMoon fontSize="1.25rem" /> : <FiSun fontSize="1.25rem" />}
        aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
        variant="ghost"
        onClick={toggleColorMode}
      />

      <Box position="relative">

        <NotificationBadge />

        <IconButton
          icon={<FiBell fontSize="1.25rem" />}
          aria-label="Notifications"
          variant="ghost"
          onClick={onToggleNotifications}
        />

      </Box>

    </HStack>
  )
}
