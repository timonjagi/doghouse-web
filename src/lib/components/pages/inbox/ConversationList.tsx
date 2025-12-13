import React, { useState, useMemo } from 'react';
import {
  VStack,
  HStack,
  Text,
  Box,
  Badge,
  Avatar,
  Button,
  Divider,
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon, ChatIcon, CheckIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useMarkConversationAsRead } from '../../../hooks/queries/useConversations';
import { InboxItem } from '../../../hooks/queries/useInbox';

interface ConversationListProps {
  conversations: InboxItem[];
  selectedConversationId?: string;
  onConversationSelect: (conversationId: string) => void;
  className?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onConversationSelect,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const markAsReadMutation = useMarkConversationAsRead();
  const router = useRouter();

  const handleMarkAsRead = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markAsReadMutation.mutateAsync({ conversationId, userId: 'current-user-id' });
  };

  // Filter and search conversations
  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(conv => conv.contextType === filterType);
    }

    // Search by title or preview
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(conv =>
        conv.title.toLowerCase().includes(query) ||
        conv.preview.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [conversations, searchQuery, filterType]);

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

  if (conversations.length === 0) {
    return (
      <Box p={4} className={className}>
        <Center py={12}>
          <VStack spacing={4}>
            <ChatIcon boxSize={12} color="gray.400" />
            <Text color="gray.500" textAlign="center">
              No conversations yet.<br />
              Start a conversation by contacting breeders or seekers.
            </Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  return (
    <Box
      h="full"
      display="flex"
      flexDirection="column"
      className={className}
    >
      {/* Header */}
      <Box p={4} borderBottom="1px" borderColor={useColorModeValue('gray.200', 'gray.600')}>
        <VStack spacing={4} align="stretch">
          <Text fontSize="lg" fontWeight="semibold">Conversations</Text>

          {/* Search and Filter Controls */}
          <SimpleGrid columns={1} spacing={3}>
            <InputGroup size="sm">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg={useColorModeValue('white', 'gray.700')}
              />
            </InputGroup>

            <Select
              size="sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              bg={useColorModeValue('white', 'gray.700')}
            >
              <option value="all">All Conversations</option>
              <option value="adoption">Adoption Related</option>
              <option value="listing">Listing Related</option>
              <option value="support">Support</option>
              <option value="general">General</option>
            </Select>
          </SimpleGrid>
        </VStack>
      </Box>

      {/* Conversation List */}
      <Box flex={1} overflowY="auto">
        {filteredConversations.length === 0 ? (
          <Center py={8}>
            <Text color="gray.500" fontSize="sm">
              No conversations match your search.
            </Text>
          </Center>
        ) : (
          <VStack spacing={0} align="stretch">
            {filteredConversations.map((conversation, index) => {
              const isSelected = conversation.id === selectedConversationId;

              return (
                <Box
                  key={conversation.id}
                  p={3}
                  cursor="pointer"
                  bg={isSelected
                    ? useColorModeValue('blue.50', 'blue.900')
                    : useColorModeValue('white', 'gray.800')
                  }
                  _hover={{
                    bg: isSelected
                      ? useColorModeValue('blue.100', 'blue.800')
                      : useColorModeValue('gray.50', 'gray.700')
                  }}
                  borderBottom="1px"
                  borderColor={useColorModeValue('gray.100', 'gray.700')}
                  onClick={() => onConversationSelect(conversation.id)}
                  transition="all 0.2s"
                >
                  <HStack spacing={3} align="start">
                    <Box position="relative">
                      <Avatar
                        size="sm"
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
                          w={2}
                          h={2}
                          border="1px solid white"
                        />
                      )}
                    </Box>

                    <VStack align="start" flex={1} spacing={1} minW={0}>
                      <HStack justify="space-between" w="full">
                        <HStack spacing={1} minW={0} flex={1}>
                          <Text
                            fontWeight={isSelected ? "semibold" : "medium"}
                            fontSize="sm"
                            noOfLines={1}
                            color={isSelected ? "blue.600" : "inherit"}
                          >
                            {conversation.title}
                          </Text>
                          {conversation.contextType && (
                            <Badge
                              size="xs"
                              colorScheme={getContextColor(conversation.contextType)}
                              variant="subtle"
                              fontSize="xs"
                            >
                              {conversation.contextType}
                            </Badge>
                          )}
                        </HStack>
                        <Text fontSize="xs" color="gray.500" flexShrink={0}>
                          {new Date(conversation.timestamp).toLocaleDateString()}
                        </Text>
                      </HStack>

                      <Text fontSize="xs" color="gray.600" noOfLines={1}>
                        {conversation.preview}
                      </Text>

                      {conversation.participants && conversation.participants.length > 1 && (
                        <Text fontSize="xs" color="gray.500">
                          {conversation.participants.length} participants
                        </Text>
                      )}
                    </VStack>

                    {!conversation.isRead && (
                      <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={(e) => handleMarkAsRead(conversation.id, e)}
                        isLoading={markAsReadMutation.isPending}
                        h={6}
                        w={6}
                        p={0}
                      >
                        <CheckIcon fontSize="xs" />
                      </Button>
                    )}
                  </HStack>
                </Box>
              );
            })}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default ConversationList;
