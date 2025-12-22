import {
  Box,
  VStack,
  Flex,
  useColorModeValue as mode,
  Text,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { useNotifications } from '@novu/react';
import { NotificationService } from '../../services/notificationService';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { notifications } = useNotifications();

  const handleNotificationClick = async (notification: any) => {
    await NotificationService.markNotificationAsRead(notification);
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
          {notifications?.length === 0 ? (
            <Box p={4} textAlign="center">
              <Text color="gray.500">No notifications</Text>
            </Box>
          ) : (
            <VStack spacing={0} align="stretch">
              {notifications?.map((notification) => (
                <Box
                  key={notification.id}
                  p={4}
                  borderBottom="1px"
                  borderColor={mode('gray.200', 'gray.600')}
                  cursor="pointer"
                  _hover={{ bg: mode('gray.50', 'gray.700') }}
                  onClick={() => handleNotificationClick(notification)}
                  bg={notification.read ? 'transparent' : mode('blue.50', 'blue.900')}
                >
                  <HStack spacing={3} align="start">
                    {!notification.read && (
                      <Badge colorScheme="blue" borderRadius="full" w={2} h={2} flexShrink={0} />
                    )}
                    <Box flex={1}>
                      <Text fontWeight={notification.read ? 'normal' : 'bold'}>
                        {notification.subject || 'Notification'}
                      </Text>
                      <Text fontSize="sm" color="gray.600" mt={1}>
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
