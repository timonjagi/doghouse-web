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
  Flex,
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
import { Notification, User } from '../../../../db/schema';
interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: User;
  notifications: Notification[];
  isLoading: boolean;
  error: any;
  unreadCount: number;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  userProfile,
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
      router.push(`/dashboard/applications/${(notification.meta as any).applicationId}`);
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
      case 'payment_completed':
      case 'payment_received':
        return <FiBell />; // Could use a payment icon like FiCreditCard
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
      case 'payment_completed':
        return 'green';
      case 'payment_received':
        return 'purple';
      default:
        return 'gray';
    }
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
              <FiBell size={48} color="gray" />
              <Heading size="sm" color="gray.600" mt={4}>
                No notifications yet
              </Heading>
              <Text color="gray.500" mt={2} fontSize="sm">
                You'll receive notifications about your applications and listings here.
              </Text>
            </Box>
          ) : (
            <VStack spacing={0} align="stretch" p={4}>
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
                  bg={notification.is_read ? 'white' : 'brand.50'}
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
                              {formatDate(notification.created_at.toString())}
                            </Text>
                            {!notification.is_read && (
                              <Badge colorScheme="brand" variant="solid" fontSize="xs" px={1}>
                                New
                              </Badge>
                            )}
                          </HStack>
                        </HStack>

                        {notification.body && (
                          <Text fontSize="sm" color="gray.700" noOfLines={2}>
                            {notification.body}
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
