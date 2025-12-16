import React, { useState, useEffect, useMemo } from 'react';
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
  Button,
} from '@chakra-ui/react';
import { ChatIcon, BellIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import { useInbox, useUnreadInboxCount } from '../../../hooks/queries/useInbox';
import { useCurrentUser } from '../../../hooks/queries/useAuth';
import ConversationList from './ConversationList';
import ConversationView from './ConversationView';
import { PageHeaderWithTwoButtons } from '../../ui/PageHeaderWithTwoButtons';
import { useRouter } from 'next/router';
import { InboxItem } from '../../../hooks/queries/useInbox';

interface InboxPageProps {
  children?: React.ReactNode;
  defaultSelectedConversationId?: string;
}

const InboxPage: React.FC<InboxPageProps> = ({ children, defaultSelectedConversationId }) => {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { data: inboxItems = [], isLoading, error } = useInbox(user?.id);
  const { data: unreadCount } = useUnreadInboxCount(user?.id);

  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState(0);

  // Search filter from URL
  const searchQuery = (router.query.q as string || '').toLowerCase();

  // Check if we're on desktop (sidebar layout) or mobile (full screen)
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  // Initialize selected conversation from URL parameter
  useEffect(() => {
    if (defaultSelectedConversationId) {
      setSelectedConversationId(defaultSelectedConversationId);
    }
  }, [defaultSelectedConversationId]);

  // Handle Tab Change
  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setSelectedConversationId(undefined); // Deselect on tab change to show list on mobile? Or keep selection?
    // Maintaining selection might be better if the item exists in the new tab, but safer to clear for now or simple ignore.
  };

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    // Update URL for deep linking (only on desktop where we have sidebar)
    if (isDesktop) {
      window.history.replaceState({}, '', `/dashboard/inbox/${conversationId}`);
    }
  };


  // Filter Items based on Tabs and Search
  const filteredItems = useMemo(() => {
    let items = inboxItems;

    // Search Filter
    if (searchQuery) {
      items = items.filter(item =>
        item.title.toLowerCase().includes(searchQuery) ||
        item.preview.toLowerCase().includes(searchQuery)
      );
    }

    // Tab Filter
    switch (activeTab) {
      case 0: // All
        return items;
      case 1: // Adoptions
        return items.filter(item => item.contextType === 'adoption');
      case 2: // Enquiries (Listings)
        return items.filter(item => item.contextType === 'listing');
      case 3: // Support
        return items.filter(item => item.contextType === 'support');
      default:
        return items;
    }
  }, [inboxItems, searchQuery, activeTab]);

  // Tab Counts
  const getTabCount = (tabIndex: number) => {
    // Logic mirrors filteredItems switch but global search might confuse counts. 
    // Usually counts ignore search, but respect context.
    const items = inboxItems;
    switch (tabIndex) {
      case 0: return items.length;
      case 1: return items.filter(item => item.contextType === 'adoption').length;
      case 2: return items.filter(item => item.contextType === 'listing').length;
      case 3: return items.filter(item => item.contextType === 'support').length;
      default: return 0;
    }
  };


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

  // Desktop layout with sidebar
  if (isDesktop) {
    return (
      <Container maxW="7xl" py={{ base: 4, md: 8 }}>
        <VStack spacing={6} align="stretch">
          {/* <PageHeaderWithTwoButtons
            title="Inbox"
            description={`${unreadCount || 0} unread messages`}
          /> */}

          <Box
            h="calc(100vh - 200px)" // Adjusted height
            border="1px"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            borderRadius="lg"
            overflow="hidden"
            bg={useColorModeValue('white', 'gray.800')}
          >
            <HStack h="full" spacing={0} align="stretch">
              {/* Sidebar */}
              <VStack w="320px" spacing={0} borderRight="1px" borderColor={useColorModeValue('gray.200', 'gray.600')}>
                {/* Tabs Config */}
                <Box borderBottom="1px" borderColor={useColorModeValue('gray.200', 'gray.600')} w="full">
                  <Tabs
                    index={activeTab}
                    onChange={handleTabChange}
                    variant="soft-rounded"
                    colorScheme="brand"
                    size="sm"
                    p={2}
                  >
                    <TabList overflowX="auto" pb={1} css={{
                      '&::-webkit-scrollbar': { display: 'none' },
                      scrollbarWidth: 'none',
                    }}>
                      <Tab flexShrink={0}>All ({getTabCount(0)})</Tab>
                      <Tab flexShrink={0}>Adoptions ({getTabCount(1)})</Tab>
                      <Tab flexShrink={0}>Enquiries ({getTabCount(2)})</Tab>
                      <Tab flexShrink={0}>Support ({getTabCount(3)})</Tab>
                    </TabList>
                  </Tabs>
                </Box>

                {/* List */}
                <Box flex={1} w="full" overflow="hidden">
                  <ConversationList
                    conversations={filteredItems}
                    selectedConversationId={selectedConversationId}
                    onConversationSelect={handleConversationSelect}
                  />
                </Box>
              </VStack>

              {/* Main Content */}
              <Box flex={1} bg={useColorModeValue('gray.50', 'gray.900')}>
                {selectedConversationId ? (
                  <ConversationView conversationId={selectedConversationId} />
                ) : (
                  <Center h="full">
                    <VStack spacing={4}>
                      <ChatIcon boxSize={16} color="gray.400" />
                      <Text color="gray.500" textAlign="center" fontSize="lg">
                        Select a conversation to start messaging
                      </Text>
                    </VStack>
                  </Center>
                )}
              </Box>
            </HStack>
          </Box>
        </VStack>
      </Container>
    );
  }

  // Mobile Layout
  // If a conversation is selected, show it full screen? 
  // Standard pattern: List view -> click -> Detail view.
  // InboxPage handles list view. If `selectedConversationId` is present, render View?
  // But routing handles `/dashboard/inbox/[id]`. This component is likely rendered for `/dashboard/inbox`.
  // If `defaultSelectedConversationId` is present, it means we are at `[id]`.

  if (defaultSelectedConversationId) {
    // Mobile Detail View
    return (
      <Box h="100vh">
        <ConversationView conversationId={defaultSelectedConversationId} />
      </Box>
    );
  }

  // Mobile List View
  return (
    <Container maxW="7xl" py={{ base: 4, md: 8 }}>
      <VStack spacing={4} align="stretch">
        <PageHeaderWithTwoButtons
          title="Inbox"
          description={`${unreadCount || 0} unread messages`}
        />

        <Tabs
          index={activeTab}
          onChange={handleTabChange}
          variant="soft-rounded"
          colorScheme="brand"
        >
          <TabList
            overflowX="auto"
            py={2}
            css={{
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            <Tab flexShrink={0}>All</Tab>
            <Tab flexShrink={0}>Adoptions</Tab>
            <Tab flexShrink={0}>Enquiries</Tab>
            <Tab flexShrink={0}>Support</Tab>
          </TabList>
        </Tabs>

        {/* Search status if filtered */}
        {searchQuery && (
          <Text fontSize="sm" color="gray.500">
            Searching for "{searchQuery}"
          </Text>
        )}

        <ConversationList
          conversations={filteredItems}
          onConversationSelect={(id) => router.push(`/dashboard/inbox/${id}`)}
        />
      </VStack>
    </Container>
  );
};

export default InboxPage;
