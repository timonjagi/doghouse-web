import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase/client";
import { queryKeys } from "../../queryKeys";
import { Adoption } from "../../db/schema";

export interface AdminAdoption extends Adoption {
  listings: {
    id: string;
    title: string;
    type: string;
    price: number | null;
    owner_id: string;
    breeds?: {
      id: string;
      name: string;
    };
  };
  seeker_user: {
    id: string;
    display_name: string | null;
    email: string;
    profile_photo_url: string | null;
    phone: string | null;
  };
  breeder_user: {
    id: string;
    display_name: string | null;
    email: string;
    profile_photo_url: string | null;
    phone: string | null;
  };
}

export interface AdoptionFilters {
  status?: string;
  flagged?: boolean;
  breeder_id?: string;
  seeker_id?: string;
  search?: string;
}

export interface AdoptionStats {
  totalAdoptions: number;
  pendingAdoptions: number;
  completedAdoptions: number;
  disputedAdoptions: number;
  averageCompletionTime: number;
}

/**
 * Hook to get adoptions for admin oversight
 */
export const useAdminAdoptions = (
  filters: AdoptionFilters = {},
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ["admin", "adoptions", filters, page, limit],
    queryFn: async (): Promise<{
      adoptions: AdminAdoption[];
      total: number;
    }> => {
      let query = supabase.from("adoptions").select(
        `
          *,
          listings (
            id,
            title,
            type,
            price,
            owner_id,
            breeds (
              id,
              name
            )
          )
        `,
        { count: "exact" }
      );

      // Apply filters
      if (filters.status) {
        query = query.eq("status", filters.status);
      }

      if (filters.flagged !== undefined) {
        query = query.eq("flagged", filters.flagged);
      }

      if (filters.breeder_id) {
        query = query.eq("listings.owner_id", filters.breeder_id);
      }

      if (filters.seeker_id) {
        query = query.eq("seeker_id", filters.seeker_id);
      }

      if (filters.search) {
        query = query.or(
          `listings.title.ilike.%${filters.search}%,application_data->>notes.ilike.%${filters.search}%`
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

      // Enrich data with user information
      const enrichedAdoptions = await Promise.all(
        (data || []).map(async (adoption) => {
          const [seekerUser, breederUser] = await Promise.all([
            supabase
              .from("users")
              .select("id, display_name, email, profile_photo_url, phone")
              .eq("id", adoption.seeker_id)
              .single(),
            supabase
              .from("users")
              .select("id, display_name, email, profile_photo_url, phone")
              .eq("id", (adoption as any).listings?.owner_id)
              .single(),
          ]);

          return {
            ...adoption,
            seeker_user: seekerUser.data,
            breeder_user: breederUser.data,
          };
        })
      );

      return {
        adoptions: enrichedAdoptions,
        total: count || 0,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get adoption statistics for admin dashboard
 */
export const useAdoptionStats = () => {
  return useQuery({
    queryKey: queryKeys.admin.adoptions({ stats: true }),
    queryFn: async (): Promise<AdoptionStats> => {
      const { data: adoptions, error } = await supabase
        .from("adoptions")
        .select("status, created_at, updated_at");

      if (error) throw error;

      const totalAdoptions = adoptions?.length || 0;
      const pendingAdoptions =
        adoptions?.filter((a) =>
          ["submitted", "approved", "pending"].includes(a.status)
        ).length || 0;
      const completedAdoptions =
        adoptions?.filter((a) => a.status === "completed").length || 0;
      const disputedAdoptions =
        adoptions?.filter((a) => a.status === "disputed").length || 0;

      // Calculate average completion time
      const completedAdoptionsWithTimes = adoptions?.filter(
        (a) => a.status === "completed" && a.updated_at
      );
      const totalCompletionTime =
        completedAdoptionsWithTimes?.reduce((sum, adoption) => {
          const created = new Date(adoption.created_at).getTime();
          const completed = new Date(adoption.updated_at!).getTime();
          return sum + (completed - created);
        }, 0) || 0;

      const averageCompletionTime =
        completedAdoptionsWithTimes && completedAdoptionsWithTimes.length > 0
          ? totalCompletionTime /
            completedAdoptionsWithTimes.length /
            (1000 * 60 * 60 * 24) // Convert to days
          : 0;

      return {
        totalAdoptions,
        pendingAdoptions,
        completedAdoptions,
        disputedAdoptions,
        averageCompletionTime,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get a single adoption details for admin
 */
export const useAdminAdoptionDetails = (adoptionId: string) => {
  return useQuery({
    queryKey: queryKeys.admin.adoptions({ details: adoptionId }),
    queryFn: async (): Promise<AdminAdoption | null> => {
      if (!adoptionId) return null;

      const { data, error } = await supabase
        .from("adoptions")
        .select(
          `
          *,
          listings (
            id,
            title,
            type,
            price,
            owner_id,
            breeds (
              id,
              name
            )
          )
        `
        )
        .eq("id", adoptionId)
        .single();

      if (error) throw error;

      // Enrich with user information
      const [seekerUser, breederUser] = await Promise.all([
        supabase
          .from("users")
          .select("id, display_name, email, profile_photo_url, phone")
          .eq("id", data.seeker_id)
          .single(),
        supabase
          .from("users")
          .select("id, display_name, email, profile_photo_url, phone")
          .eq("id", (data as any).listings?.owner_id)
          .single(),
      ]);

      return {
        ...data,
        seeker_user: seekerUser.data,
        breeder_user: breederUser.data,
      };
    },
    enabled: !!adoptionId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for admin adoption interventions
 */
export const useAdoptionInterventions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      adoptionId,
      action,
      data,
    }: {
      adoptionId: string;
      action:
        | "resolve_dispute"
        | "force_complete"
        | "flag"
        | "unflag"
        | "update_status"
        | "add_note";
      data?: any;
    }) => {
      const now = new Date().toISOString();

      switch (action) {
        case "resolve_dispute":
          const { error: resolveError } = await supabase
            .from("adoptions")
            .update({
              status:
                data.resolution === "completed" ? "completed" : "cancelled",
              admin_notes: data.notes,
              resolved_at: now,
              resolved_by: "admin",
              updated_at: now,
            })
            .eq("id", adoptionId);

          if (resolveError) throw resolveError;
          break;

        case "force_complete":
          const { error: completeError } = await supabase
            .from("adoptions")
            .update({
              status: "completed",
              payment_completed: true,
              contract_signed: true,
              admin_notes: data?.notes || "Force completed by admin",
              updated_at: now,
            })
            .eq("id", adoptionId);

          if (completeError) throw completeError;
          break;

        case "flag":
          const { error: flagError } = await supabase
            .from("adoptions")
            .update({
              flagged: true,
              flag_reason: data.reason,
              flagged_at: now,
              updated_at: now,
            })
            .eq("id", adoptionId);

          if (flagError) throw flagError;
          break;

        case "unflag":
          const { error: unflagError } = await supabase
            .from("adoptions")
            .update({
              flagged: false,
              flag_reason: null,
              flagged_at: null,
              updated_at: now,
            })
            .eq("id", adoptionId);

          if (unflagError) throw unflagError;
          break;

        case "update_status":
          const { error: statusError } = await supabase
            .from("adoptions")
            .update({
              status: data.status,
              admin_notes: data.notes,
              updated_at: now,
            })
            .eq("id", adoptionId);

          if (statusError) throw statusError;
          break;

        case "add_note":
          const { data: currentAdoption } = await supabase
            .from("adoptions")
            .select("admin_notes")
            .eq("id", adoptionId)
            .single();

          const existingNotes = currentAdoption?.admin_notes || "";
          const newNotes = `${existingNotes}\n\n[${new Date().toISOString()}] ${
            data.notes
          }`.trim();

          const { error: noteError } = await supabase
            .from("adoptions")
            .update({
              admin_notes: newNotes,
              updated_at: now,
            })
            .eq("id", adoptionId);

          if (noteError) throw noteError;
          break;

        default:
          throw new Error("Invalid action");
      }

      return { adoptionId, action, data };
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.adoptions() });
    },
  });
};

/**
 * Hook to get disputed adoptions that need admin attention
 */
export const useDisputedAdoptions = (limit: number = 10) => {
  return useQuery({
    queryKey: ["admin", "disputed-adoptions", limit],
    queryFn: async (): Promise<AdminAdoption[]> => {
      const { data, error } = await supabase
        .from("adoptions")
        .select(
          `
          *,
          listings (
            id,
            title,
            type,
            owner_id,
            breeds (
              id,
              name
            )
          )
        `
        )
        .eq("status", "disputed")
        .order("updated_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Enrich with user information
      const enrichedAdoptions = await Promise.all(
        (data || []).map(async (adoption) => {
          const [seekerUser, breederUser] = await Promise.all([
            supabase
              .from("users")
              .select("id, display_name, email, profile_photo_url, phone")
              .eq("id", adoption.seeker_id)
              .single(),
            supabase
              .from("users")
              .select("id, display_name, email, profile_photo_url, phone")
              .eq("id", (adoption as any).listings?.owner_id)
              .single(),
          ]);

          return {
            ...adoption,
            seeker_user: seekerUser.data,
            breeder_user: breederUser.data,
          };
        })
      );

      return enrichedAdoptions;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
