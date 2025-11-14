import {
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  ButtonGroup,
  Circle,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  IconButton,
  Spacer,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import * as React from "react";
import { Logo } from "./Logo";

import { FiBell, FiCheck } from "react-icons/fi";
import { useRouter } from "next/router";
import { useUserProfileById } from "lib/hooks/queries/useUserProfile";
import { NotificationsDrawer } from "./NotificationsDrawer";
import Link from "next/link";
import { useMarkAllNotificationsAsRead, useNotifications, useUnreadNotificationsCount } from "lib/hooks/queries/useNotifications";
import UserProfileMenu from "./UserProfileMenu";
import { useCurrentUser } from "lib/hooks/queries";

export const Navbar = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const router = useRouter();

  const toast = useToast();

  const { data: user } = useCurrentUser();
  const { data: userProfile, isLoading: profileLoading } = useUserProfileById(user?.id as string);
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
    <>
      {isMobile ? (
        <Box width="full" px={{ base: "4", md: "8" }} py="4" bg="bg-accent">
          <Flex justify="space-between">
            <Logo />

            <HStack >
              <ButtonGroup variant="ghost-on-accent" spacing="1">

                <Button
                  variant="ghost-on-accent"
                  onClick={onToggle}
                  m={0}
                  p={0}
                  aria-label="Open Notifications Drawer"
                >
                  <Icon as={FiBell} boxSize="6" color="on-accent-subtle" />

                </Button>

                <UserProfileMenu
                  name={userProfile?.display_name || ""}
                  image={userProfile?.profile_photo_url || ""}
                  email={userProfile?.email || ""}
                />
              </ButtonGroup>
            </HStack>
          </Flex>
        </Box>
      ) : (
        <HStack spacing="1" flex="1" p={8}>
          <Breadcrumb>
            {router.pathname.split("/").map((item, index) => (
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} href={`/${router.pathname.split("/").slice(1, index + 1).join("/")
                  }`}>{
                    router.pathname.split("/")[router.pathname.split("/").length - 1] === item && index !== 0
                      ? item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, " ")
                      : item === "[id]" ? "Detail"
                        : item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, " ")
                  }</BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
          <Spacer />
          <ButtonGroup variant="ghost-on-accent" spacing="2">

            <Box >
              <IconButton
                icon={<FiBell />}
                aria-label="Notifications"
                onClick={onToggle}
              />
              {unreadCount && unreadCount > 0 && <Circle size="2" bg="blue.400" display="relative" position="absolute" top={8} right={8} zIndex={1} />}
            </Box>

            <UserProfileMenu
              name={userProfile?.display_name || ""}
              image={userProfile?.profile_photo_url || ""}
              email={userProfile?.email || ""}
            />
          </ButtonGroup>
        </HStack>
      )}


      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
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

            {unreadCount && unreadCount > 0 && (
              <Badge colorScheme="red" borderRadius="full" px={2} fontSize="xs">
                {unreadCount}
              </Badge>
            )}


            {notifications && notifications.length > 0 && unreadCount && unreadCount > 0 && (
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
            isOpen={isOpen}
            onClose={onClose}
            userProfile={userProfile!}
            notifications={notifications!}
            isLoading={isLoading}
            error={error}
            unreadCount={unreadCount!}
          />
        </DrawerContent>
      </Drawer>

    </>)

};
