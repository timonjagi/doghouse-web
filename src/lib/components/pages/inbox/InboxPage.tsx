import React, { useState, useEffect } from 'react';
import {
  Container,
  VStack,
  HStack,
  Text,
  Box,
  Badge,
  useColorModeValue,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  useBreakpointValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { ChatIcon, BellIcon } from '@chakra-ui/icons';
import { useInbox, useUnreadInboxCount } from '../../../hooks/queries/useInbox';
import { useCurrentUser } from '../../../hooks/queries/useAuth';
import ConversationList from './ConversationList';
import NotificationList from './NotificationList';
import ConversationView from './ConversationView';
import { PageHeaderWithTwoButtons } from '../../ui/PageHeaderWithTwoButtons';

interface InboxPageProps {
  children?: React.ReactNode;
  defaultSelectedConversationId?: string;
}

const InboxPage: React.FC<InboxPageProps> = ({ children, defaultSelectedConversationId }) => {
  const { data: user } = useCurrentUser();
  const { data: inboxItems, isLoading, error } = useInbox(user?.id);
  const { data: unreadCount } = useUnreadInboxCount(user?.id);

  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<'conversations' | 'notifications'>('conversations');

  // Check if we're on desktop (sidebar layout) or mobile (full screen)
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  // Initialize selected conversation from URL parameter
  useEffect(() => {
    if (defaultSelectedConversationId) {
      setSelectedConversationId(defaultSelectedConversationId);
      setActiveTab('conversations');
    }
  }, [defaultSelectedConversationId]);

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

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setActiveTab('conversations');
    // Update URL for deep linking (only on desktop where we have sidebar)
    if (isDesktop) {
      window.history.replaceState({}, '', `/dashboard/inbox/${conversationId}`);
    }
  };

  // Desktop layout with sidebar
  if (isDesktop) {
    return (
      <Container maxW="7xl" py={{ base: 4, md: 8 }}>
        <VStack spacing={6} align="stretch">
          <PageHeaderWithTwoButtons
            title="Inbox"
            description={`${unreadCount || 0} unread messages`}
          />

          <Box
            h="80vh"
            border="1px"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            borderRadius="lg"
            overflow="hidden"
            bg={useColorModeValue('white', 'gray.800')}
          >
            <Tabs
              variant="soft-rounded"
              colorScheme="brand"
              orientation="vertical"
              h="full"
              display="flex"
            >
              {/* Sidebar */}
              <VStack w="320px" spacing={0} borderRight="1px" borderColor={useColorModeValue('gray.200', 'gray.600')}>
                <Box p={4} borderBottom="1px" borderColor={useColorModeValue('gray.200', 'gray.600')} w="full">
                  <Tabs variant="soft-rounded" colorScheme="brand" size="sm">
                    <TabList>
                      <Tab onClick={() => setActiveTab('conversations')}>
                        <HStack>
                          <ChatIcon />
                          <Text>Conversations</Text>
                          {conversations.filter(c => !c.isRead).length > 0 && (
                            <Badge colorScheme="red" borderRadius="full" px={2} fontSize="xs">
                              {conversations.filter(c => !c.isRead).length}
                            </Badge>
                          )}
                        </HStack>
                      </Tab>
                      <Tab onClick={() => setActiveTab('notifications')}>
                        <HStack>
                          <BellIcon />
                          <Text>Notifications</Text>
                          {notifications.filter(n => !n.isRead).length > 0 && (
                            <Badge colorScheme="red" borderRadius="full" px={2} fontSize="xs">
                              {notifications.filter(n => !n.isRead).length}
                            </Badge>
                          )}
                        </HStack>
                      </Tab>
                    </TabList>
                  </Tabs>
                </Box>

                <Box flex={1} w="full">
                  {activeTab === 'conversations' ? (
                    <ConversationList
                      conversations={conversations}
                      selectedConversationId={selectedConversationId}
                      onConversationSelect={handleConversationSelect}
                    />
                  ) : (
                    <NotificationList notifications={notifications} />
                  )}
                </Box>
              </VStack>

              {/* Main Content Area */}
              <Box flex={1}>
                {selectedConversationId && activeTab === 'conversations' ? (
                  <ConversationView conversationId={selectedConversationId} />
                ) : (
                  <Center h="full">
                    <VStack spacing={4}>
                      <ChatIcon boxSize={16} color="gray.400" />
                      <Text color="gray.500" textAlign="center" fontSize="lg">
                        {activeTab === 'conversations'
                          ? 'Select a conversation to start messaging'
                          : 'Your notifications will appear here'
                        }
                      </Text>
                    </VStack>
                  </Center>
                )}
              </Box>
            </Tabs>
          </Box>
        </VStack>
      </Container>
    );
  }

  // Mobile layout - full screen tabs
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
              <ConversationList
                conversations={conversations}
                selectedConversationId={selectedConversationId}
                onConversationSelect={handleConversationSelect}
              />
            </TabPanel>
            <TabPanel px={0}>
              <NotificationList notifications={notifications} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default InboxPage;
