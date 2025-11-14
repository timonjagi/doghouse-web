import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';
import { useAppStore } from '../../stores/useAppStore';

// Types
interface SignUpData {
  email: string;
  password: string;
  userData?: {
    display_name?: string;
    role?: 'breeder' | 'seeker' | 'admin';
  };
}

interface SignInData {
  email: string;
  password: string;
}

interface UpdateProfileData {
  display_name?: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
}

// Query to get current user session
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Query to get current session
export const useCurrentSession = () => {
  return useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Mutation for signing up
export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password, userData }: SignUpData) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all() });
    },
  });
};

// Mutation for signing in
export const useSignIn = () => {
  const queryClient = useQueryClient();
  const { setUserSession } = useAppStore.getState();

  return useMutation({
    mutationFn: async ({ email, password }: SignInData) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Update Zustand store with user session
      if (data.user) {
        setUserSession({
          id: data.user.id,
          email: data.user.email!,
          role: (data.user.user_metadata?.role as 'breeder' | 'seeker' | 'admin') || 'seeker',
          displayName: data.user.user_metadata?.display_name,
          isAuthenticated: true,
          onboardingCompleted: false, // This should be checked from the database
        });
      }

      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all() });
    },
  });
};

// Mutation for signing out
export const useSignOut = () => {
  const queryClient = useQueryClient();
  const { clearUserSession } = useAppStore.getState();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      // Clear Zustand store
      clearUserSession();

      // Clear all cached queries
      //queryClient.clear();

      // Invalidate auth queries
      queryClient.invalidateQueries();
    },
  });
};

// Mutation for updating user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: UpdateProfileData) => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!user) throw new Error('No authenticated user');

      const { error: updateError } = await supabase.auth.updateUser({
        data: updates,
      });
      if (updateError) throw updateError;

      return { user, updates };
    },
    onSuccess: (data) => {
      // Update the user session in Zustand store
      const { updateUserProfile } = useAppStore.getState();
      updateUserProfile({
        displayName: data.updates.display_name,
        avatarUrl: data.updates.avatar_url,
      });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.currentProfile() });
    },
  });
};

// Mutation for password reset
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    },
  });
};
