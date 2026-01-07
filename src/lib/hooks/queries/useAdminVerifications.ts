import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase/client";
import { queryKeys } from "../../queryKeys";

export interface BreederVerificationRequest {
  id: string;
  user_id: string;
  business_name: string | null;
  license_number: string | null;
  verification_docs: any;
  verified: boolean;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
  users: {
    id: string;
    display_name: string | null;
    email: string;
    profile_photo_url: string | null;
    phone: string | null;
    location_text: string | null;
  }[];
}

export interface VerificationStats {
  totalPending: number;
  totalVerified: number;
  totalRejected: number;
  averageProcessingTime: number; // in days
}

export interface VerificationFilters {
  status?: "pending" | "verified" | "rejected";
  search?: string;
}

/**
 * Hook to get breeder verification requests for admin
 */
export const usePendingVerifications = (
  filters: VerificationFilters = {},
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: queryKeys.admin.verifications(filters, page, limit),
    queryFn: async (): Promise<{
      requests: BreederVerificationRequest[];
      total: number;
    }> => {
      let query = supabase.from("breeder_profiles").select(
        `
          id,
          user_id,
          business_name,
          license_number,
          verification_docs,
          verified,
          verified_at,
          created_at,
          updated_at,
          users (
            id,
            display_name,
            email,
            profile_photo_url,
            phone,
            location_text
          )
        `,
        { count: "exact" }
      );

      // Apply filters
      if (filters.status === "pending") {
        query = query.eq("verified", false);
      } else if (filters.status === "verified") {
        query = query.eq("verified", true);
      } else if (filters.status === "rejected") {
        // For rejected, we might need a separate field or check verification_docs for rejection status
        // For now, we'll assume rejected means not verified and has some rejection flag
        query = query.eq("verified", false);
      }

      if (filters.search) {
        query = query.or(
          `business_name.ilike.%${filters.search}%,license_number.ilike.%${filters.search}%,users.display_name.ilike.%${filters.search}%,users.email.ilike.%${filters.search}%`
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
        requests: data || [],
        total: count || 0,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get verification statistics for admin dashboard
 */
export const useVerificationStats = () => {
  return useQuery({
    queryKey: queryKeys.admin.verifications({ stats: true }),
    queryFn: async (): Promise<VerificationStats> => {
      // Get pending verifications
      const { count: totalPending } = await supabase
        .from("breeder_profiles")
        .select("*", { count: "exact", head: true })
        .eq("verified", false);

      // Get verified breeders
      const { count: totalVerified } = await supabase
        .from("breeder_profiles")
        .select("*", { count: "exact", head: true })
        .eq("verified", true);

      // For now, we'll assume no rejected status - this would need a database field
      const totalRejected = 0;

      // Calculate average processing time (from creation to verification)
      const { data: verifiedProfiles } = await supabase
        .from("breeder_profiles")
        .select("created_at, verified_at")
        .eq("verified", true)
        .not("verified_at", "is", null);

      let averageProcessingTime = 0;
      if (verifiedProfiles && verifiedProfiles.length > 0) {
        const totalProcessingTime = verifiedProfiles.reduce((sum, profile) => {
          const created = new Date(profile.created_at).getTime();
          const verified = new Date(profile.verified_at!).getTime();
          return sum + (verified - created);
        }, 0);

        averageProcessingTime =
          totalProcessingTime / verifiedProfiles.length / (1000 * 60 * 60 * 24); // Convert to days
      }

      return {
        totalPending: totalPending || 0,
        totalVerified: totalVerified || 0,
        totalRejected,
        averageProcessingTime,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get a single verification request details
 */
export const useVerificationDetails = (requestId: string) => {
  return useQuery({
    queryKey: queryKeys.admin.verifications({ details: requestId }),
    queryFn: async (): Promise<BreederVerificationRequest | null> => {
      if (!requestId) return null;

      const { data, error } = await supabase
        .from("breeder_profiles")
        .select(
          `
          id,
          user_id,
          business_name,
          license_number,
          verification_docs,
          verified,
          verified_at,
          created_at,
          updated_at,
          users (
            id,
            display_name,
            email,
            profile_photo_url,
            phone,
            location_text
          )
        `
        )
        .eq("id", requestId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!requestId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for admin verification actions (approve, reject, request more info)
 */
export const useVerificationActions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      action,
      notes,
      additionalData,
    }: {
      requestId: string;
      action: "approve" | "reject" | "request_info";
      notes?: string;
      additionalData?: any;
    }) => {
      const now = new Date().toISOString();

      switch (action) {
        case "approve":
          const { error: approveError } = await supabase
            .from("breeder_profiles")
            .update({
              verified: true,
              verified_at: now,
              updated_at: now,
            })
            .eq("id", requestId);

          if (approveError) throw approveError;
          break;

        case "reject":
          // For rejection, we might want to add a rejection reason field
          // For now, we'll update the verification_docs to include rejection info
          const { data: currentProfile } = await supabase
            .from("breeder_profiles")
            .select("verification_docs")
            .eq("id", requestId)
            .single();

          const updatedDocs = {
            ...currentProfile?.verification_docs,
            rejection_reason: notes,
            rejected_at: now,
            rejected: true,
          };

          const { error: rejectError } = await supabase
            .from("breeder_profiles")
            .update({
              verification_docs: updatedDocs,
              updated_at: now,
            })
            .eq("id", requestId);

          if (rejectError) throw rejectError;
          break;

        case "request_info":
          // For requesting more information, update verification_docs
          const { data: currentProfile2 } = await supabase
            .from("breeder_profiles")
            .select("verification_docs")
            .eq("id", requestId)
            .single();

          const updatedDocs2 = {
            ...currentProfile2?.verification_docs,
            additional_info_requested: notes,
            info_requested_at: now,
          };

          const { error: requestError } = await supabase
            .from("breeder_profiles")
            .update({
              verification_docs: updatedDocs2,
              updated_at: now,
            })
            .eq("id", requestId);

          if (requestError) throw requestError;
          break;

        default:
          throw new Error("Invalid action");
      }

      return { requestId, action, notes };
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.verifications(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.userStats() });
    },
  });
};

/**
 * Hook to get verification processing history/timeline
 */
export const useVerificationHistory = (requestId: string) => {
  return useQuery({
    queryKey: ["verification-history", requestId],
    queryFn: async (): Promise<any[]> => {
      if (!requestId) return [];

      // For now, we'll reconstruct history from the verification_docs and timestamps
      const { data: profile } = await supabase
        .from("breeder_profiles")
        .select(
          "verification_docs, created_at, verified_at, updated_at, verified"
        )
        .eq("id", requestId)
        .single();

      if (!profile) return [];

      const history = [
        {
          id: "submitted",
          title: "Verification Request Submitted",
          description: "Breeder submitted verification request",
          timestamp: profile.created_at,
          status: "completed",
        },
      ];

      if (profile.verification_docs?.info_requested_at) {
        history.push({
          id: "info_requested",
          title: "Additional Information Requested",
          description:
            profile.verification_docs.additional_info_requested ||
            "Admin requested additional information",
          timestamp: profile.verification_docs.info_requested_at,
          status: "pending",
        });
      }

      if (profile.verification_docs?.rejected) {
        history.push({
          id: "rejected",
          title: "Verification Rejected",
          description:
            profile.verification_docs.rejection_reason ||
            "Verification request was rejected",
          timestamp: profile.verification_docs.rejected_at,
          status: "completed",
        });
      } else if (profile.verified && profile.verified_at) {
        history.push({
          id: "approved",
          title: "Verification Approved",
          description: "Breeder verification request was approved",
          timestamp: profile.verified_at,
          status: "completed",
        });
      }

      if (profile.verification_docs?.rejected) {
        history.push({
          id: "rejected",
          title: "Verification Rejected",
          description:
            profile.verification_docs.rejection_reason ||
            "Verification request was rejected",
          timestamp: profile.verification_docs.rejected_at,
          status: "completed",
        });
      } else if (profile.verified && profile.verified_at) {
        history.push({
          id: "approved",
          title: "Verification Approved",
          description: "Breeder verification request was approved",
          timestamp: profile.verified_at,
          status: "completed",
        });
      }

      return history.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    },
    enabled: !!requestId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
