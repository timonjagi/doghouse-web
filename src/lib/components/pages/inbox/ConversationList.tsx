import React, { useMemo } from 'react';
import {
  VStack,
  HStack,
  Text,
  Box,
  Badge,
  Avatar,
  Button,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChatIcon, CheckIcon } from '@chakra-ui/icons';
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
  const markAsReadMutation = useMarkConversationAsRead();

  const handleMarkAsRead = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markAsReadMutation.mutateAsync({ conversationId, userId: 'current-user-id' });
  };

  const getContextIcon = (contextType?: string) => {
    switch (contextType) {
      case 'adoption': return '🏠';
      case 'listing': return '🐕';
      case 'support': return '🆘';
      case 'match': return '💕';
      case 'application': return '📋';
      case 'payment': return '💰';
      default: return '💬';
    }
  };

  const getContextColor = (contextType?: string) => {
    switch (contextType) {
      case 'adoption': return 'green';
      case 'listing': return 'blue';
      case 'support': return 'red';
      case 'match': return 'pink';
      case 'payment': return 'green';
      default: return 'gray';
    }
  };

  if (conversations.length === 0) {
    return (
      <Box p={4} className={className}>
        <Center py={12}>
          <VStack spacing={4}>
            <ChatIcon boxSize={12} color="gray.400" />
            <Text color="gray.500" textAlign="center">
              No conversations found.
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
      <Box flex={1} overflowY="auto">
        <VStack spacing={0} align="stretch">
          {conversations.map((conversation) => {
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
                      {/* {getContextIcon(conversation.contextType)} */}
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

                      </HStack>
                      <Text fontSize="xs" color="gray.500" flexShrink={0}>
                        {new Date(conversation.timestamp).toLocaleDateString()}
                      </Text>
                    </HStack>

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
                    <Text fontSize="xs" color="gray.600" noOfLines={1}>
                      {conversation.preview}
                    </Text>

                    {conversation.participants && conversation.participants.length > 1 && (
                      <Text fontSize="xs" color="gray.500">
                        {conversation.participants.length} participants
                      </Text>
                    )}
                  </VStack>

                  {!conversation.isRead && conversation.type === 'conversation' && (
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
      </Box>
    </Box>
  );
};

export default ConversationList;
