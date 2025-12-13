import React from 'react';
import {
  Box,
  Card,
  CardBody,
  HStack,
  Badge,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { FiBell } from 'react-icons/fi';
import { Notification } from '../../db/schema';

interface NotificationCardProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onClick,
}) => {
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

  return (
    <Card
      cursor="pointer"
      onClick={() => onClick(notification)}
      _hover={{ bg: mode('gray.50', 'gray.700') }}
      borderRadius={0}
      border="none"
      borderBottom="1px solid"
      borderColor={mode('gray.200', 'gray.600')}
      bg={notification.is_read ? mode('white', 'gray.800') : mode('brand.50', 'brand.900')}
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
                <Text fontSize="xs" color={mode('gray.500', 'gray.400')}>
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
              <Text fontSize="sm" color={mode('gray.700', 'gray.300')} noOfLines={2}>
                {notification.body}
              </Text>
            )}
          </Box>
        </HStack>
      </CardBody>
    </Card>
  );
};
