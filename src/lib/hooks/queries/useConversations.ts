import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';
import { Conversation, Message } from '../../db/schema';

// Query to get user conversations with context
export const useConversations = (userId?: string) => {
  return useQuery({
    queryKey: queryKeys.conversations.list({ user_id: userId }),
    queryFn: async (): Promise<Conversation[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('is_active', true)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (error) throw error;

      // Filter conversations where user is a participant
      return (data || []).filter(conv =>
        (conv.participants as string[])?.includes(userId)
      );
    },
    enabled: !!userId,
  });
};

// Query to get a specific conversation with messages
export const useConversation = (conversationId: string) => {
  return useQuery({
    queryKey: queryKeys.conversations.detail(conversationId),
    queryFn: async (): Promise<Conversation & { messages: Message[] }> => {
      // Get conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (convError) throw convError;

      // Get messages
      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select(`
          *,
          users:sender_id (
            id,
            display_name,
            profile_photo_url
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;

      return {
        ...conversation,
        messages: messages || []
      };
    },
    enabled: !!conversationId,
  });
};

// Query to get unread conversation count
export const useUnreadConversationsCount = (userId?: string) => {
  return useQuery({
    queryKey: queryKeys.conversations.unreadCount(userId),
    queryFn: async (): Promise<number> => {
      if (!userId) return 0;

      const { data, error } = await supabase
        .from('conversations')
        .select('unread_count, participants')
        .eq('is_active', true);

      if (error) throw error;

      // Filter conversations where user is a participant and sum unread counts
      return (data || [])
        .filter(conv => (conv.participants as string[])?.includes(userId))
        .reduce((total, conv) => {
          const userUnread = (conv.unread_count as any)?.[userId] || 0;
          return total + userUnread;
        }, 0);
    },
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Mutation to create a new conversation
export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contextType,
      contextId,
      participants,
      title,
      contextData = {},
      createdBy
    }: {
      contextType: string;
      contextId?: string;
      participants: string[];
      title?: string;
      contextData?: any;
      createdBy: string;
    }) => {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          context_type: contextType,
          context_id: contextId,
          participants,
          title,
          context_data: contextData,
          created_by: createdBy,
          unread_count: participants.reduce((acc, participant) => ({
            ...acc,
            [participant]: 0
          }), {})
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all() });
    },
  });
};

// Mutation to send a message
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      senderId,
      content,
      attachments = []
    }: {
      conversationId: string;
      senderId: string;
      content: string;
      attachments?: any[];
    }) => {
      // Send message
      const { data: message, error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content,
          attachments,
          read_by: [senderId] // Sender has read their own message
        })
        .select()
        .single();

      if (msgError) throw msgError;

      // Update conversation metadata
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('participants, unread_count')
        .eq('id', conversationId)
        .single();

      if (convError) throw convError;

      // Increment unread count for all participants except sender
      const updatedUnreadCount = { ...(conversation.unread_count as any) };
      conversation.participants.forEach((participant: string) => {
        if (participant !== senderId) {
          updatedUnreadCount[participant] = (updatedUnreadCount[participant] || 0) + 1;
        }
      });

      // Update conversation
      const { error: updateError } = await supabase
        .from('conversations')
        .update({
          last_message_at: new Date().toISOString(),
          last_message_preview: content?.substring(0, 100) || 'Attachment',
          unread_count: updatedUnreadCount
        })
        .eq('id', conversationId);

      if (updateError) throw updateError;

      return message;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.detail(variables.conversationId)
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all() });
    },
  });
};

// Mutation to mark messages as read
export const useMarkConversationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      userId
    }: {
      conversationId: string;
      userId: string;
    }) => {
      // Get conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('unread_count')
        .eq('id', conversationId)
        .single();

      if (convError) throw convError;

      // Reset unread count for user
      const updatedUnreadCount = { ...(conversation.unread_count as any) };
      updatedUnreadCount[userId] = 0;

      // Update conversation
      const { error: updateError } = await supabase
        .from('conversations')
        .update({ unread_count: updatedUnreadCount })
        .eq('id', conversationId);

      if (updateError) throw updateError;

      // Get all messages in conversation that haven't been read by user
      const { data: messagesToUpdate, error: fetchError } = await supabase
        .from('messages')
        .select('id, read_by')
        .eq('conversation_id', conversationId)
        .not('read_by', 'cs', `{${userId}}`);

      if (fetchError) throw fetchError;

      // Update each message to add user to read_by array
      if (messagesToUpdate && messagesToUpdate.length > 0) {
        const updatePromises = messagesToUpdate.map(message =>
          supabase
            .from('messages')
            .update({
              read_by: [...(message.read_by as string[] || []), userId]
            })
            .eq('id', message.id)
        );

        const results = await Promise.all(updatePromises);
        const msgError = results.find(result => result.error)?.error;
        if (msgError) throw msgError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all() });
    },
  });
};

// Mutation to archive a conversation
export const useArchiveConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const { error } = await supabase
        .from('conversations')
        .update({ is_active: false })
        .eq('id', conversationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all() });
    },
  });
};
