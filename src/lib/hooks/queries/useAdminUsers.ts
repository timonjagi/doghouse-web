import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase/client";
import { queryKeys } from "../../queryKeys";

export interface AdminUser {
  id: string;
  display_name: string | null;
  email: string;
  role: "seeker" | "breeder" | "admin" | null;
  profile_photo_url: string | null;
  created_at: string;
  updated_at: string | null;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  phone: string | null;
  location_text: string | null;
  is_active: boolean;
  breeder_profiles?: {
    id: string;
    verified: boolean;
    verified_at: string | null;
    kennel_name: string | null;
    kennel_location: string | null;
    facility_type: string | null;
    user_breeds?: {
      id: string;
      is_verified: boolean;
    }[];
  }[];
  seeker_profiles?: {
    id: string;
    experience_level: string | null;
    living_situation: string | null;
    has_children: boolean | null;
    has_allergies: boolean | null;
    has_other_pets: boolean | null;
  }[];
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  breedersCount: number;
  seekersCount: number;
  verifiedBreedersCount: number;
  unverifiedBreedersCount: number;
}

export interface AdminUsersFilters {
  role?: "seeker" | "breeder" | "admin";
  verified?: boolean;
  is_active?: boolean;
  search?: string;
}

/**
 * Hook to get all users with filtering and pagination for admin
 */
export const useAdminUsers = (
  filters: AdminUsersFilters = {},
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: queryKeys.admin.users(filters, page, limit),
    queryFn: async (): Promise<{ users: AdminUser[]; total: number }> => {
      let query = supabase.from("users").select(
        `
        *,
        breeder_profiles (
          id,
          verified,
          verified_at,
          kennel_name,
          kennel_location,
          facility_type
        ),
        user_breeds (
          id,
          is_verified
        ),
        seeker_profiles (
          id,
          experience_level,
          living_situation,
          has_children,
          has_allergies,
          has_other_pets
        )
      `,
        { count: "exact" }
      );

      // Apply filters
      if (filters.role) {
        query = query.eq("role", filters.role);
      }

      if (filters.is_active !== undefined) {
        query = query.eq("is_active", filters.is_active);
      }

      if (filters.verified !== undefined && filters.role === "breeder") {
        if (filters.verified) {
          query = query
            .eq("breeder_profiles.verified", true)
            .not("breeder_profiles.verified_at", "is", null);
        } else {
          query = query
            .eq("breeder_profiles.verified", false)
            .is("breeder_profiles.verified_at", null);
        }
      }

      if (filters.search) {
        query = query.or(
          `display_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,breeder_profiles.kennel_name.ilike.%${filters.search}%`
        );
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      // Order by creation date (newest first)
      query = query.order("created_at", { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        users: data || [],
        total: count || 0,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get user statistics for admin dashboard
 */
export const useUserStats = () => {
  return useQuery({
    queryKey: queryKeys.admin.userStats(),
    queryFn: async (): Promise<UserStats> => {
      // Get total users
      const { count: totalUsers } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      // Get active users (signed in within last 30 days)
      // For now, consider all users as active since we don't have last_sign_in_at field tracking
      const { count: activeUsers } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      // You could add a more sophisticated active user tracking later by using a separate activity_logs table

      // Get new users this month
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);

      const { count: newUsersThisMonth } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .gte("created_at", firstDayOfMonth.toISOString());

      // Get role counts
      const { count: breedersCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "breeder");

      const { count: seekersCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "seeker");

      // Get verification counts
      const { count: verifiedBreedersCount } = await supabase
        .from("breeder_profiles")
        .select("*", { count: "exact", head: true })
        .eq("verified", true);

      const { count: unverifiedBreedersCount } = await supabase
        .from("breeder_profiles")
        .select("*", { count: "exact", head: true })
        .eq("verified", false);

      return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        newUsersThisMonth: newUsersThisMonth || 0,
        breedersCount: breedersCount || 0,
        seekersCount: seekersCount || 0,
        verifiedBreedersCount: verifiedBreedersCount || 0,
        unverifiedBreedersCount: unverifiedBreedersCount || 0,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get a single user details for admin
 */
export const useAdminUserDetails = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.admin.userDetails(userId),
    queryFn: async (): Promise<AdminUser | null> => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("users")
        .select(
          `
          id,
          display_name,
          email,
          role,
          profile_photo_url,
          created_at,
          updated_at,
          last_sign_in_at,
          email_confirmed_at,
          phone,
          location_text,
          is_active,
          breeder_profiles (
            id,
            verified,
            kennel_name,
            kennel_location,
            facility_type,
            verification_docs,
            created_at,
            verified_at
          ),
          user_breeds (
            id,
            is_verified
          ),
          user_breeds (
            id,
            is_verified
          ),
          seeker_profiles (
            id,
            experience_level,
            living_situation,
            has_children,
            has_allergies,
            has_other_pets
          )
        `
        )
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for admin user actions (role changes, status updates, etc.)
 */
export const useAdminUserActions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      action,
      data,
    }: {
      userId: string;
      action: "update_role" | "toggle_status" | "update_profile";
      data?: any;
    }) => {
      switch (action) {
        case "update_role":
          const { error: roleError } = await supabase
            .from("users")
            .update({ role: data.role })
            .eq("id", userId);

          if (roleError) throw roleError;
          break;

        case "toggle_status":
          const { error: statusError } = await supabase
            .from("users")
            .update({ is_active: data.is_active })
            .eq("id", userId);

          if (statusError) throw statusError;
          break;

        case "update_profile":
          if (data.profileType === "breeder") {
            const { error: breederError } = await supabase
              .from("breeder_profiles")
              .update(data.updates)
              .eq("user_id", userId);

            if (breederError) throw breederError;
          } else if (data.profileType === "seeker") {
            const { error: seekerError } = await supabase
              .from("seeker_profiles")
              .update(data.updates)
              .eq("user_id", userId);

            if (seekerError) throw seekerError;
          }
          break;

        default:
          throw new Error("Invalid action");
      }

      return { userId, action, data };
    },
    onSuccess: () => {
      // Invalidate user-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.userStats() });
    },
  });
};

/**
 * Hook to get user activity logs (recent actions, sign-ins, etc.)
 */
export const useUserActivityLogs = (userId: string, limit: number = 10) => {
  return useQuery({
    queryKey: queryKeys.admin.userActivity(userId, limit),
    queryFn: async (): Promise<any[]> => {
      if (!userId) return [];

      // This would typically query an activity/logs table
      // For now, we'll get recent transactions and adoptions as activity
      const { data: transactions } = await supabase
        .from("transactions")
        .select("id, amount, status, created_at, type")
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order("created_at", { ascending: false })
        .limit(limit);

      const { data: adoptions } = await supabase
        .from("adoptions")
        .select(
          `
          id,
          status,
          created_at,
          listings (
            title,
            owner_id
          )
        `
        )
        .eq("seeker_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      // Combine and sort activities
      const activities = [
        ...(transactions || []).map((tx) => ({
          id: tx.id,
          type: "transaction",
          description: `Transaction: ${tx.type} - ${tx.amount}`,
          status: tx.status,
          timestamp: tx.created_at,
        })),
        ...(adoptions || []).map((adoption) => ({
          id: adoption.id,
          type: "adoption",
          description: `Applied for: ${(adoption as any).listings?.title}`,
          status: adoption.status,
          timestamp: adoption.created_at,
        })),
      ];

      return activities
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, limit);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
