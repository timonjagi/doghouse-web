import {
  Box,
  VStack,
  Flex,
  useColorModeValue as mode,
  Text,
  Badge,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Notification } from '../../db/schema';
import { useMarkNotificationAsRead } from '../../hooks/queries';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: Notification[];
  isLoading?: boolean;
  error?: any;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications = [],
  isLoading = false,
  error,
}) => {
  const router = useRouter();
  const markAsReadMutation = useMarkNotificationAsRead();

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.is_read) {
      await markAsReadMutation.mutateAsync(notification.id);
    }

    // Navigate to target if available
    if (notification.target_type && notification.target_id) {
      let path = '';
      switch (notification.target_type) {
        case 'adoption':
        case 'application':
          path = `/dashboard/adoptions/${notification.target_id}`;
          break;
        case 'listing':
          path = `/listings/${notification.target_id}`;
          break;
        case 'conversation':
          path = `/dashboard/inbox/${notification.target_id}`;
          break;
        case 'user':
          path = `/dashboard/profile`;
          break;
        default:
          path = '/dashboard/notifications';
      }

      if (path) {
        router.push(path);
        onClose();
      }
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

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
              <Spinner size="lg" />
              <Text mt={4} color="gray.500">Loading notifications...</Text>
            </Box>
          ) : error ? (
            <Box p={4}>
              <Alert status="error">
                <AlertIcon />
                Failed to load notifications
              </Alert>
            </Box>
          ) : notifications.length === 0 ? (
            <Box p={4} textAlign="center">
              <Text color="gray.500">No notifications</Text>
            </Box>
          ) : (
            <VStack spacing={0} align="stretch">
              {notifications.map((notification) => (
                <Box
                  key={notification.id}
                  p={4}
                  borderBottom="1px"
                  borderColor={mode('gray.200', 'gray.600')}
                  cursor="pointer"
                  _hover={{ bg: mode('gray.50', 'gray.700') }}
                  onClick={() => handleNotificationClick(notification)}
                  bg={notification.is_read ? 'transparent' : mode('blue.50', 'blue.900')}
                >
                  <HStack spacing={3} align="start">
                    {!notification.is_read && (
                      <Badge colorScheme="blue" borderRadius="full" w={2} h={2} flexShrink={0} />
                    )}
                    <Box flex={1}>
                      <HStack justify="space-between" mb={1}>
                        <Text fontWeight={notification.is_read ? 'normal' : 'bold'} fontSize="sm">
                          {notification.title || 'Notification'}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {formatTime(notification.created_at.toString())}
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color={mode('gray.600', 'gray.400')}>
                        {notification.body || 'Notification content'}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </VStack>
    </Flex>
  );
};
