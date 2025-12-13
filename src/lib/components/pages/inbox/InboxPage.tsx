import React, { useState } from 'react';
import {
  Container,
  VStack,
  HStack,
  Text,
  Box,
  Badge,
  Avatar,
  Flex,
  Spacer,
  IconButton,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  useColorModeValue,
  Divider,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  useDisclosure
} from '@chakra-ui/react';
import { ChatIcon, BellIcon, TimeIcon, CheckIcon } from '@chakra-ui/icons';
import { useInbox, useUnreadInboxCount, InboxItem } from '../../../hooks/queries/useInbox';
import { useCurrentUser } from '../../../hooks/queries/useAuth';
import { useMarkNotificationAsRead } from '../../../hooks/queries/useNotifications';
import { useMarkConversationAsRead } from '../../../hooks/queries/useConversations';
import { PageHeaderWithTwoButtons } from '../../ui/PageHeaderWithTwoButtons';

interface InboxPageProps {
  children?: React.ReactNode;
}

const InboxPage: React.FC<InboxPageProps> = ({ children }) => {
  const { data: user } = useCurrentUser();
  const { data: inboxItems, isLoading, error } = useInbox(user?.id);
  const { data: unreadCount } = useUnreadInboxCount(user?.id);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (isLoading) {
    return (
      <Container maxW="7xl" py={8}>
        <Center h="400px">
          <VStack spacing={4}>
            <Spinner size="xl" />
            <Text>Loading your inbox...</Text>
          </VStack>
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="7xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          Failed to load inbox. Please try again later.
        </Alert>
      </Container>
    );
  }

  const conversations = inboxItems?.filter(item => item.type === 'conversation') || [];
  const notifications = inboxItems?.filter(item => item.type === 'notification') || [];

  return (
    <Container maxW="7xl" py={{ base: 4, md: 8 }}>
      <VStack spacing={6} align="stretch">
        <PageHeaderWithTwoButtons
          title="Inbox"
          description={`${unreadCount || 0} unread messages`}
        />

        <Tabs variant="soft-rounded" colorScheme="brand">
          <TabList>
            <Tab>
              <HStack>
                <ChatIcon />
                <Text>Conversations</Text>
                {conversations.filter(c => !c.isRead).length > 0 && (
                  <Badge colorScheme="red" borderRadius="full" px={2}>
                    {conversations.filter(c => !c.isRead).length}
                  </Badge>
                )}
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <BellIcon />
                <Text>Notifications</Text>
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <Badge colorScheme="red" borderRadius="full" px={2}>
                    {notifications.filter(n => !n.isRead).length}
                  </Badge>
                )}
              </HStack>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <ConversationsTab conversations={conversations} />
            </TabPanel>
            <TabPanel px={0}>
              <NotificationsTab notifications={notifications} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

interface ConversationsTabProps {
  conversations: InboxItem[];
}

const ConversationsTab: React.FC<ConversationsTabProps> = ({ conversations }) => {
  const markAsReadMutation = useMarkConversationAsRead();

  const handleMarkAsRead = async (conversationId: string) => {
    await markAsReadMutation.mutateAsync({ conversationId, userId: 'current-user-id' });
  };

  if (conversations.length === 0) {
    return (
      <Center py={12}>
        <VStack spacing={4}>
          <ChatIcon boxSize={12} color="gray.400" />
          <Text color="gray.500" textAlign="center">
            No conversations yet.<br />
            Start a conversation by contacting breeders or seekers.
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <VStack spacing={0} align="stretch">
      {conversations.map((conversation, index) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          onMarkAsRead={handleMarkAsRead}
          showDivider={index < conversations.length - 1}
        />
      ))}
    </VStack>
  );
};

interface ConversationItemProps {
  conversation: InboxItem;
  onMarkAsRead: (conversationId: string) => void;
  showDivider: boolean;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  onMarkAsRead,
  showDivider
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const getContextIcon = (contextType?: string) => {
    switch (contextType) {
      case 'adoption':
        return '🏠';
      case 'listing':
        return '🐕';
      case 'support':
        return '🆘';
      default:
        return '💬';
    }
  };

  const getContextColor = (contextType?: string) => {
    switch (contextType) {
      case 'adoption':
        return 'green';
      case 'listing':
        return 'blue';
      case 'support':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <>
      <Box
        p={4}
        bg={bgColor}
        _hover={{ bg: hoverBg }}
        cursor="pointer"
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        transition="all 0.2s"
      >
        <HStack spacing={3} align="start">
          <Box position="relative">
            <Avatar
              size="md"
              name={conversation.title}
              bg={`${getContextColor(conversation.contextType)}.500`}
              color="white"
            >
              {getContextIcon(conversation.contextType)}
            </Avatar>
            {!conversation.isRead && (
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
              <HStack>
                <Text fontWeight="semibold" fontSize="md">
                  {conversation.title}
                </Text>
                {conversation.contextType && (
                  <Badge
                    size="sm"
                    colorScheme={getContextColor(conversation.contextType)}
                    variant="subtle"
                  >
                    {conversation.contextType}
                  </Badge>
                )}
              </HStack>
              <Text fontSize="xs" color="gray.500">
                {new Date(conversation.timestamp).toLocaleDateString()}
              </Text>
            </HStack>

            <Text fontSize="sm" color="gray.600" noOfLines={2}>
              {conversation.preview}
            </Text>

            {conversation.participants && conversation.participants.length > 0 && (
              <Text fontSize="xs" color="gray.500">
                {conversation.participants.length} participants
              </Text>
            )}
          </VStack>

          <VStack spacing={2}>
            {!conversation.isRead && (
              <Button
                size="xs"
                variant="ghost"
                colorScheme="blue"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(conversation.id);
                }}
                isLoading={false} // Add loading state if needed
              >
                <CheckIcon mr={1} />
                Mark Read
              </Button>
            )}
          </VStack>
        </HStack>
      </Box>

      {showDivider && <Divider />}
    </>
  );
};

interface NotificationsTabProps {
  notifications: InboxItem[];
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({ notifications }) => {
  const markAsReadMutation = useMarkNotificationAsRead();

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsReadMutation.mutateAsync(notificationId);
  };

  if (notifications.length === 0) {
    return (
      <Center py={12}>
        <VStack spacing={4}>
          <BellIcon boxSize={12} color="gray.400" />
          <Text color="gray.500" textAlign="center">
            No notifications yet.<br />
            You'll receive notifications for important updates.
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <VStack spacing={0} align="stretch">
      {notifications.map((notification, index) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={handleMarkAsRead}
          showDivider={index < notifications.length - 1}
        />
      ))}
    </VStack>
  );
};

interface NotificationItemProps {
  notification: InboxItem;
  onMarkAsRead: (notificationId: string) => void;
  showDivider: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  showDivider
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

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

  return (
    <>
      <Box
        p={4}
        bg={bgColor}
        _hover={{ bg: hoverBg }}
        cursor="pointer"
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
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
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }}
                isLoading={false} // Add loading state if needed
              >
                <CheckIcon mr={1} />
                Mark Read
              </Button>
            )}
          </VStack>
        </HStack>
      </Box>

      {showDivider && <Divider />}
    </>
  );
};

export default InboxPage;
