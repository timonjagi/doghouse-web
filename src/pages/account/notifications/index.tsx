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
  Container,
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
import { Notification } from '../../../../db/schema';

export default function NotificationsPage() {
  const router = useRouter();
  const toast = useToast();
  const { data: userProfile } = useUserProfile();

  const { data: notifications, isLoading, error } = useNotifications(userProfile?.id);
  const { data: unreadCount } = useUnreadNotificationsCount(userProfile?.id);

  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.is_read) {
      await markAsReadMutation.mutateAsync(notification.id);
    }

    // Navigate based on notification type and meta data
    if ((notification.meta as any)?.applicationId) {
      router.push(`/dashboard/applications/${(notification.meta as any).applicationId}`);
    } else if ((notification.meta as any)?.listingId) {
      router.push(`/dashboard/listings/${(notification.meta as any).listingId}`);
    }
    // Add more navigation logic for other types as needed
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

  if (isLoading) {
    return (
      <Box p={8} textAlign="center">
        <Spinner size="lg" color="blue.500" />
        <Text mt={4}>Loading notifications...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <Box>
          <Text fontWeight="bold">Error loading notifications</Text>
          <Text fontSize="sm">{error.message}</Text>
        </Box>
      </Alert>
    );
  }

  return (
    <Container maxW="4xl" mx="auto" py={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <HStack>
            <FiBell size={24} />
            <Heading size={{ base: 'xs', md: 'sm' }}>Notifications</Heading>
            {unreadCount > 0 && (
              <Badge colorScheme="red" borderRadius="full" px={2}>
                {unreadCount}
              </Badge>
            )}
          </HStack>

          {notifications && notifications.length > 0 && unreadCount > 0 && (
            <Button
              leftIcon={<FiCheck />}
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              isLoading={markAllAsReadMutation.isPending}
            >
              Mark All Read
            </Button>
          )}
        </HStack>

        <Divider />

        {/* Notifications List */}
        {!notifications || notifications.length === 0 ? (
          <Box textAlign="center" py={12}>
            <FiBell size={48} color="gray" />
            <Heading size="md" color="gray.600" mt={4}>
              No notifications yet
            </Heading>
            <Text color="gray.500" mt={2}>
              You'll receive notifications about your applications and listings here.
            </Text>
          </Box>
        ) : (
          <VStack spacing={3} align="stretch">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                cursor="pointer"
                onClick={() => handleNotificationClick(notification)}
                _hover={{ shadow: 'md' }}
                bg={notification.is_read ? 'white' : 'blue.50'}
                borderLeft={notification.is_read ? 'none' : '4px solid'}
                borderLeftColor={notification.is_read ? 'none' : 'blue.400'}
              >
                <CardBody p={4}>
                  <HStack align="start" spacing={3}>
                    <Box color={getNotificationColor(notification.type)}>
                      {getNotificationIcon(notification.type)}
                    </Box>

                    <Box flex={1}>
                      <HStack justify="space-between" align="start" mb={1}>
                        <Text fontWeight="semibold" fontSize="sm">
                          {notification.title}
                        </Text>
                        <HStack spacing={2}>
                          <Text fontSize="xs" color="gray.500">
                            {formatDate(notification.created_at.toString())}
                          </Text>
                          {!notification.is_read && (
                            <Badge colorScheme="blue" variant="solid" fontSize="xs">
                              New
                            </Badge>
                          )}
                        </HStack>
                      </HStack>

                      {notification.body && (
                        <Text fontSize="sm" color="gray.700">
                          {notification.body}
                        </Text>
                      )}
                    </Box>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        )}
      </VStack>
    </Container>
  );
}
