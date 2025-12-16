import React from 'react';
import {
  VStack,
  HStack,
  Text,
  Box,
  Badge,
  Avatar,
  Button,
  Center,
} from '@chakra-ui/react';
import { BellIcon, CheckIcon } from '@chakra-ui/icons';
import { useMarkNotificationAsRead } from '../../../hooks/queries/useNotifications';
import { InboxItem } from '../../../hooks/queries/useInbox';

interface NotificationListProps {
  notifications: InboxItem[];
  onNotificationClick?: (notification: InboxItem) => void;
  className?: string;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onNotificationClick,
  className
}) => {
  const markAsReadMutation = useMarkNotificationAsRead();

  const handleMarkAsRead = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markAsReadMutation.mutateAsync(notificationId);
  };

  const handleNotificationClick = (notification: InboxItem) => {
    onNotificationClick?.(notification);
  };

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'match':
        return '💕';
      case 'application':
        return '📋';
      case 'payment':
        return '💰';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type?: string) => {
    switch (type) {
      case 'match':
        return 'pink';
      case 'application':
        return 'blue';
      case 'payment':
        return 'green';
      default:
        return 'gray';
    }
  };

  if (notifications.length === 0) {
    return (
      <Box p={4} className={className}>
        <Center py={12}>
          <VStack spacing={4}>
            <BellIcon boxSize={12} color="gray.400" />
            <Text color="gray.500" textAlign="center">
              No notifications yet.<br />
              You'll receive notifications for important updates.
            </Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  return (
    <Box className={className}>
      <VStack spacing={0} align="stretch">
        {notifications.map((notification, index) => (
          <Box
            key={notification.id}
            p={4}
            cursor="pointer"
            _hover={{ bg: 'gray.50' }}
            borderBottom="1px"
            borderColor="gray.100"
            onClick={() => handleNotificationClick(notification)}
            transition="all 0.2s"
          >
            <HStack spacing={3} align="start">
              <Box position="relative">
                <Avatar
                  size="md"
                  name={notification.title}
                  bg={`${getNotificationColor(notification.contextType)}.500`}
                  color="white"
                >
                  {getNotificationIcon(notification.contextType)}
                </Avatar>
                {!notification.isRead && (
                  <Box
                    position="absolute"
                    top={0}
                    right={0}
                    bg="red.500"
                    borderRadius="full"
                    w={3}
                    h={3}
                    border="2px solid white"
                  />
                )}
              </Box>

              <VStack align="start" flex={1} spacing={1}>
                <HStack justify="space-between" w="full">
                  <Text fontWeight="semibold" fontSize="md">
                    {notification.title}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {new Date(notification.timestamp).toLocaleDateString()}
                  </Text>
                </HStack>

                <Text fontSize="sm" color="gray.600" noOfLines={2}>
                  {notification.preview}
                </Text>
              </VStack>

              <VStack spacing={2}>
                {!notification.isRead && (
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="blue"
                    onClick={(e) => handleMarkAsRead(notification.id, e)}
                    isLoading={markAsReadMutation.isPending}
                  >
                    <CheckIcon mr={1} />
                    Mark Read
                  </Button>
                )}
              </VStack>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default NotificationList;
