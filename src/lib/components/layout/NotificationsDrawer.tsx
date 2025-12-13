import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  Link,
  Flex,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { FiBell, FiCheck } from 'react-icons/fi';
import { useRouter } from 'next/router';

import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useUnreadNotificationsCount,
} from '../../../lib/hooks/queries/useNotifications';
import { Notification, User } from '../../db/schema';
import { NotificationCard } from '../ui/NotificationCard';
interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  isLoading: boolean;
  error: any;
  unreadCount: number;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  isLoading,
  error,
  unreadCount,
}) => {
  const router = useRouter();

  const markAsReadMutation = useMarkNotificationAsRead();


  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.is_read) {
      await markAsReadMutation.mutateAsync(notification.id);
    }

    // Navigate based on notification type and data
    if (notification.type === 'payment_completed' || notification.type === 'payment_received') {
      // For payment notifications, navigate to transactions page
      router.push('/dashboard/account/billing');
    } else if ((notification.meta as any)?.applicationId) {
      // For application status changes, navigate to applications page
      router.push(`/dashboard/adoptions/${(notification.meta as any).applicationId}`);
    } else if ((notification.meta as any)?.listingId) {
      router.push(`/dashboard/listings/${(notification.meta as any).listingId}`);
    }

    // Close the drawer
    onClose();
  };


  const handleViewAll = () => {
    router.push('/dashboard/account/notifications');
    onClose();
  };



  // Get only the latest 5 notifications for the drawer
  const latestNotifications = notifications?.slice(0, 5) || [];

  return (
    <Flex
      flex="1"
      maxW={{ base: "full", sm: "md" }}
      justify="space-between"
      width="full"
      h={{ base: "calc(100vh - 64px)", md: "full" }}
      as="nav"
      direction="column"
      overflowY="auto"
    >
      <VStack spacing={0} align="stretch" height="100%">
        {/* Content */}
        <Box flex={1} overflowY="auto">
          {isLoading ? (
            <Box p={8} textAlign="center">
              <Spinner size="lg" color="blue.500" />
              <Text mt={4}>Loading notifications...</Text>
            </Box>
          ) : error ? (
            <Alert status="error" m={4}>
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">Error loading notifications</Text>
                <Text fontSize="sm">{error.message}</Text>
              </Box>
            </Alert>
          ) : !notifications || notifications.length === 0 ? (
            <Box textAlign="center" py={12} px={6}>
              <FiBell size={48} color={mode('gray', 'gray')} />
              <Heading size="sm" color={mode('gray.600', 'gray.400')} mt={4}>
                No notifications yet
              </Heading>
              <Text color={mode('gray.500', 'gray.500')} mt={2} fontSize="sm">
                You'll receive notifications about your applications and listings here.
              </Text>
            </Box>
          ) : (
            <VStack spacing={0} align="stretch" p={4}>
              {latestNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onClick={handleNotificationClick}
                />
              ))}

              {/* View All Link */}
              {notifications.length > 5 && (
                <Box p={4} borderTop="1px solid" borderColor={mode('gray.200', 'gray.600')}>
                  <Button
                    variant="ghost"
                    size="sm"
                    width="full"
                    onClick={handleViewAll}
                    color="brand.500"
                  >
                    View All Notifications ({notifications.length})
                  </Button>
                </Box>
              )}
            </VStack>
          )}
        </Box>
      </VStack>
    </Flex>
  );
};
