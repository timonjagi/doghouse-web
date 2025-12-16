import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../queryKeys';
import { useConversations, useUnreadConversationsCount } from './useConversations';

// Conversation-only inbox item type
export interface InboxItem {
  id: string;
  type: 'conversation';
  title: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  contextType?: string;
  contextId?: string;
  contextData?: any;
  participants?: string[];
  unreadCount?: number;
}

// Unified inbox hook for conversations only
export const useInbox = (userId?: string) => {
  const conversationsQuery = useConversations(userId);

  return useQuery({
    queryKey: ['inbox', userId],
    queryFn: async (): Promise<InboxItem[]> => {
      if (!userId) return [];

      const conversations = await conversationsQuery.refetch().then(result => result.data || []);

      // Transform conversations to inbox items
      const conversationItems: InboxItem[] = conversations.map(conv => ({
        id: conv.id,
        type: 'conversation' as const,
        title: conv.title || getConversationTitle(conv),
        preview: conv.last_message_preview || 'No messages yet',
        timestamp: (conv.last_message_at || conv.created_at).toString(),
        isRead: getConversationUnreadCount(conv, userId) === 0,
        contextType: conv.context_type,
        contextId: conv.context_id,
        contextData: conv.context_data,
        participants: conv.participants as string[],
        unreadCount: getConversationUnreadCount(conv, userId)
      }));

      // Sort by timestamp (most recent first)
      return conversationItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
  });
};

// Hook for total unread conversation count
export const useUnreadInboxCount = (userId?: string) => {
  const conversationsCount = useUnreadConversationsCount(userId);

  return useQuery({
    queryKey: ['unread-inbox-count', userId],
    queryFn: (): number => {
      return conversationsCount.data || 0;
    },
    enabled: !!userId,
    refetchInterval: 30000,
  });
};

// Helper function to get conversation title based on context
function getConversationTitle(conversation: any): string {
  const { context_type, context_data, participants } = conversation;

  switch (context_type) {
    case 'adoption':
      return context_data?.listing_title
        ? `Adoption: ${context_data.listing_title}`
        : 'Adoption Discussion';

    case 'listing':
      return context_data?.listing_title
        ? `Listing: ${context_data.listing_title}`
        : 'Listing Inquiry';

    case 'support':
      return context_data?.subject || 'Support Request';

    default:
      // For general conversations, show other participant names
      const otherParticipants = (participants as string[])
        ?.filter((p: string) => p !== 'current-user') // This would need to be passed in
        ?.slice(0, 2)
        ?.join(', ');
      return otherParticipants ? `${otherParticipants}` : 'Conversation';
  }
}

// Helper function to get unread count for a conversation
function getConversationUnreadCount(conversation: any, userId: string): number {
  return (conversation.unread_count as any)?.[userId] || 0;
}
