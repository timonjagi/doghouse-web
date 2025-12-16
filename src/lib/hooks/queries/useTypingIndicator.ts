import { useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';

interface TypingUser {
  userId: string;
  displayName: string;
  timestamp: number;
}

// Hook to get typing users for a conversation
export const useTypingUsers = (conversationId: string) => {
  return useQuery({
    queryKey: queryKeys.conversations.typingUsers(conversationId),
    queryFn: async (): Promise<TypingUser[]> => {
      // This would be replaced with real-time subscription
      // For now, return empty array
      return [];
    },
    initialData: [],
    staleTime: 0, // Always fresh for typing indicators
    refetchInterval: false, // Manual updates only
  });
};

// Hook to manage typing indicators
export const useTypingIndicator = (conversationId: string, userId?: string) => {
  const queryClient = useQueryClient();

  // Start typing indicator
  const startTyping = useCallback(async () => {
    if (!conversationId || !userId) return;

    try {
      // Update local state immediately for responsive UI
      queryClient.setQueryData(
        queryKeys.conversations.typingUsers(conversationId),
        (old: TypingUser[] = []) => {
          const existingIndex = old.findIndex(user => user.userId === userId);
          const newTypingUser: TypingUser = {
            userId,
            displayName: 'You', // Will be updated with real name
            timestamp: Date.now(),
          };

          if (existingIndex >= 0) {
            // Update existing
            const updated = [...old];
            updated[existingIndex] = newTypingUser;
            return updated;
          } else {
            // Add new
            return [...old, newTypingUser];
          }
        }
      );

      // Send typing indicator to other participants via real-time
      // This would use Supabase real-time or a custom solution
      await supabase
        .from('conversation_typing')
        .upsert({
          conversation_id: conversationId,
          user_id: userId,
          is_typing: true,
          updated_at: new Date().toISOString(),
        });

    } catch (error) {
      console.error('Failed to start typing indicator:', error);
    }
  }, [conversationId, userId, queryClient]);

  // Stop typing indicator
  const stopTyping = useCallback(async () => {
    if (!conversationId || !userId) return;

    try {
      // Update local state immediately
      queryClient.setQueryData(
        queryKeys.conversations.typingUsers(conversationId),
        (old: TypingUser[] = []) => {
          return old.filter(user => user.userId !== userId);
        }
      );

      // Send stop typing to other participants
      await supabase
        .from('conversation_typing')
        .upsert({
          conversation_id: conversationId,
          user_id: userId,
          is_typing: false,
          updated_at: new Date().toISOString(),
        });

    } catch (error) {
      console.error('Failed to stop typing indicator:', error);
    }
  }, [conversationId, userId, queryClient]);

  // Auto-stop typing after timeout
  const handleTyping = useCallback(() => {
    startTyping();

    // Clear existing timeout
    const timeoutId = setTimeout(() => {
      stopTyping();
    }, 3000); // Stop after 3 seconds of no activity

    return () => clearTimeout(timeoutId);
  }, [startTyping, stopTyping]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (conversationId && userId) {
        stopTyping();
      }
    };
  }, [conversationId, userId, stopTyping]);

  return {
    startTyping,
    stopTyping,
    handleTyping,
  };
};

// Hook to subscribe to typing indicators for a conversation
export const useTypingSubscription = (conversationId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;

    // Subscribe to typing indicator changes
    const subscription = supabase
      .channel(`typing:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversation_typing',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          // Update typing users in real-time
          queryClient.invalidateQueries({
            queryKey: queryKeys.conversations.typingUsers(conversationId),
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId, queryClient]);
};
