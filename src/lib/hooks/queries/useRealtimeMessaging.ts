import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface UseRealtimeMessagingOptions {
  userId?: string;
  conversationId?: string;
  enabled?: boolean;
}

/**
 * Hook to handle real-time messaging updates using Supabase subscriptions
 * Automatically updates React Query cache when messages or conversations change
 */
export const useRealtimeMessaging = ({
  userId,
  conversationId,
  enabled = true
}: UseRealtimeMessagingOptions = {}) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !userId) return;

    const channels: RealtimeChannel[] = [];

    // Subscribe to conversation updates for the user
    const conversationsChannel = supabase
      .channel(`conversations-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `participants.cs.{${userId}}`
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('Conversation update:', payload);
          // Invalidate conversations queries
          queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all() });
          queryClient.invalidateQueries({ queryKey: queryKeys.conversations.list({ user_id: userId }) });
          queryClient.invalidateQueries({ queryKey: queryKeys.conversations.unreadCount(userId) });

          // If we have a specific conversation, also invalidate its detail query
          if (conversationId) {
            queryClient.invalidateQueries({
              queryKey: queryKeys.conversations.detail(conversationId)
            });
          }
        }
      )
      .subscribe();

    channels.push(conversationsChannel);

    // Subscribe to message updates for the user's conversations
    const messagesChannel = supabase
      .channel(`messages-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        async (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('Message update:', payload);

          if (payload.eventType === 'INSERT' && payload.new) {
            const message = payload.new;

            // Check if this message is in one of the user's conversations
            const { data: conversation } = await supabase
              .from('conversations')
              .select('participants')
              .eq('id', message.conversation_id)
              .single();

            if (conversation && conversation.participants?.includes(userId)) {
              // Invalidate relevant queries
              queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all() });
              queryClient.invalidateQueries({ queryKey: queryKeys.conversations.list({ user_id: userId }) });
              queryClient.invalidateQueries({ queryKey: queryKeys.conversations.unreadCount(userId) });
              queryClient.invalidateQueries({
                queryKey: queryKeys.conversations.detail(message.conversation_id)
              });
            }
          }
        }
      )
      .subscribe();

    channels.push(messagesChannel);

    // Subscribe to notification updates for the user
    const notificationsChannel = supabase
      .channel(`notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('Notification update:', payload);
          // Invalidate notifications queries
          queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });
          queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list() });
          queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount(userId) });
        }
      )
      .subscribe();

    channels.push(notificationsChannel);

    // Cleanup function
    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [userId, conversationId, enabled, queryClient]);

  return null; // This hook doesn't return anything, just sets up subscriptions
};

/**
 * Hook to handle real-time updates for a specific conversation
 * Useful for individual chat views
 */
export const useRealtimeConversation = (conversationId: string, enabled = true) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !conversationId) return;

    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('Conversation message update:', payload);

          // Invalidate conversation detail query
          queryClient.invalidateQueries({
            queryKey: queryKeys.conversations.detail(conversationId)
          });

          // Also invalidate conversation list to update last message
          queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all() });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `id=eq.${conversationId}`
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('Conversation metadata update:', payload);

          // Invalidate conversation detail and list queries
          queryClient.invalidateQueries({
            queryKey: queryKeys.conversations.detail(conversationId)
          });
          queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all() });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, enabled, queryClient]);

  return null;
};

/**
 * Hook to handle typing indicators (future enhancement)
 */
export const useTypingIndicator = (conversationId: string, userId: string) => {
  const queryClient = useQueryClient();

  const sendTypingIndicator = (isTyping: boolean) => {
    // This would broadcast typing status via Supabase realtime
    // For now, this is a placeholder for future implementation
    console.log(`User ${userId} ${isTyping ? 'started' : 'stopped'} typing in conversation ${conversationId}`);
  };

  return { sendTypingIndicator };
};
