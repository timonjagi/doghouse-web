import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';
import { User } from '../../db/schema';
import { useCurrentUser } from './useAuth';
import novu from '../../novu';

interface UpdateProfileData {
  display_name?: string;
  bio?: string;
  phone?: string;
  location_text?: string;
  location_lat?: number;
  location_lng?: number;
  profile_photo_url?: string | null;
  role?: string;
  onboarding_completed?: boolean;
}

// Query to get current user profile from database
export const useUserProfile = () => {
  const { data: user } = useCurrentUser();

  return useQuery({
    queryKey: queryKeys.users.currentProfile(user?.id),
    queryFn: async (): Promise<User | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

// Query to get user profile by ID
export const useUserProfileById = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.users.profile(userId),
    queryFn: async (): Promise<User | null> => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

// Mutation to update user profile in database
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: async (updates: UpdateProfileData) => {
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries - avoid infinite recursion
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.currentProfile(user?.id) });
    },
  });
};

// Mutation to create basic user profile (used during signup)
export const useCreateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: {
      id: string;
      email: string;
      display_name?: string;
      role?: string;
    }) => {
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            id: userData.id,
            email: userData.email,
            display_name: userData.display_name || userData.email.split('@')[0],
            role: userData.role || 'seeker',
            is_verified: false,
            onboarding_completed: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      // Trigger welcome notification
      try {
        await novu.trigger({
          workflowId: 'welcome-user',
          to: {
            subscriberId: data.id,
          },
          payload: {
            userId: data.id,
            firstName: data.display_name || data.email.split('@')[0],
            email: data.email,
          },
        });

        // Trigger admin notification for new user
        await novu.trigger({
          workflowId: 'new-user-signup',
          to: {
            subscriberId: 'admin', // Assuming admin subscriber ID, or use specific admin ID
          },
          payload: {
            userId: data.id,
            firstName: data.display_name || data.email.split('@')[0],
            email: data.email,
            role: data.role || 'seeker',
          },
        });
      } catch (novuError) {
        console.error('Failed to send notifications:', novuError);
      }

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.currentProfile(data.id) });
    },
  });
};
