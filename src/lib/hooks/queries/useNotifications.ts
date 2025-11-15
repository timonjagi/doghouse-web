import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';
import { Notification } from '../../../../db/schema';
// Query to get user notifications
export const useNotifications = (userId?: string) => {
  return useQuery({
    queryKey: queryKeys.notifications.list({ user_id: userId }),
    queryFn: async (): Promise<Notification[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
};

// Query to get unread notifications count
export const useUnreadNotificationsCount = (userId?: string) => {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: async (): Promise<number> => {
      if (!userId) return 0;

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId,
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
  });
};

// Mutation to mark notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });
    },
  });
};

// Mutation to mark all notifications as read
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });
    },
  });
};

// Mutation to create a notification (for internal use)
export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notification: Omit<Notification, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });
    },
  });
};
