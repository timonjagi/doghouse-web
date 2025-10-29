import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Card,
  CardBody,
  HStack,
  Badge,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Divider,
  useToast,
  Link,
} from '@chakra-ui/react';
import { FiBell, FiCheck } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useUserProfile } from '../../../lib/hooks/queries';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useUnreadNotificationsCount,
} from '../../../lib/hooks/queries/useNotifications';

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message?: string;
  read: boolean;
  data?: Record<string, any>;
  created_at: string;
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const toast = useToast();
  const { data: userProfile } = useUserProfile();

  const { data: notifications, isLoading, error } = useNotifications(userProfile?.id);
  const { data: unreadCount } = useUnreadNotificationsCount(userProfile?.id);

  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.read) {
      await markAsReadMutation.mutateAsync(notification.id);
    }

    // Navigate based on notification type and data
    if (notification.data?.applicationId) {
      router.push(`/dashboard/applications/${notification.data.applicationId}`);
    } else if (notification.data?.listingId) {
      router.push(`/dashboard/listings/${notification.data.listingId}`);
    }

    // Close the drawer
    onClose();
  };

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

  const handleViewAll = () => {
    router.push('/account/notifications');
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application_received':
      case 'application_status_changed':
        return <FiBell />;
      default:
        return <FiBell />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'application_received':
        return 'blue';
      case 'application_status_changed':
        return 'green';
      default:
        return 'gray';
    }
  };

  // Get only the latest 5 notifications for the drawer
  const latestNotifications = notifications?.slice(0, 5) || [];

  return (
    <Box
      position="fixed"
      top="0"
      right="0"
      width="400px"
      height="100vh"
      bg="white"
      boxShadow="xl"
      zIndex={1000}
      transform={isOpen ? 'translateX(0)' : 'translateX(100%)'}
      transition="transform 0.3s ease-in-out"
      borderLeft="1px solid"
      borderColor="gray.200"
    >
      <VStack spacing={0} align="stretch" height="100%">
        {/* Header */}
        <Box p={6} borderBottom="1px solid" borderColor="gray.200">
          <HStack justify="space-between" align="center">
            <HStack>
              <FiBell size={20} />
              <Heading size="md">Notifications</Heading>
              {unreadCount > 0 && (
                <Badge colorScheme="red" borderRadius="full" px={2} fontSize="xs">
                  {unreadCount}
                </Badge>
              )}
            </HStack>

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
          </HStack>
        </Box>

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
              <FiBell size={48} color="gray" />
              <Heading size="sm" color="gray.600" mt={4}>
                No notifications yet
              </Heading>
              <Text color="gray.500" mt={2} fontSize="sm">
                You'll receive notifications about your applications and listings here.
              </Text>
            </Box>
          ) : (
            <VStack spacing={0} align="stretch">
              {latestNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  cursor="pointer"
                  onClick={() => handleNotificationClick(notification)}
                  _hover={{ bg: 'gray.50' }}
                  borderRadius={0}
                  border="none"
                  borderBottom="1px solid"
                  borderColor="gray.100"
                  bg={notification.read ? 'white' : 'blue.50'}
                >
                  <CardBody p={4}>
                    <HStack align="start" spacing={3}>
                      <Box color={getNotificationColor(notification.type)} mt={1}>
                        {getNotificationIcon(notification.type)}
                      </Box>

                      <Box flex={1}>
                        <HStack justify="space-between" align="start" mb={1}>
                          <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>
                            {notification.title}
                          </Text>
                          <HStack spacing={1}>
                            <Text fontSize="xs" color="gray.500">
                              {formatDate(notification.created_at)}
                            </Text>
                            {!notification.read && (
                              <Badge colorScheme="blue" variant="solid" fontSize="xs" px={1}>
                                New
                              </Badge>
                            )}
                          </HStack>
                        </HStack>

                        {notification.message && (
                          <Text fontSize="sm" color="gray.700" noOfLines={2}>
                            {notification.message}
                          </Text>
                        )}
                      </Box>
                    </HStack>
                  </CardBody>
                </Card>
              ))}

              {/* View All Link */}
              {notifications.length > 5 && (
                <Box p={4} borderTop="1px solid" borderColor="gray.200">
                  <Button
                    variant="ghost"
                    size="sm"
                    width="full"
                    onClick={handleViewAll}
                    color="blue.500"
                  >
                    View All Notifications ({notifications.length})
                  </Button>
                </Box>
              )}
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  );
};
