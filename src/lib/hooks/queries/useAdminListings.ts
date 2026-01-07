import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase/client";
import { queryKeys } from "../../queryKeys";

export interface AdminListing {
  id: string;
  title: string;
  description: string | null;
  type: "litter" | "pet";
  status: "available" | "pending" | "sold" | "withdrawn";
  price: number | null;
  reservation_fee: number | null;
  photos: string[];
  owner_id: string;
  breed_id: string | null;
  birth_date: string | null;
  available_date: string | null;
  number_of_puppies: number | null;
  pet_name: string | null;
  pet_age: string | null;
  pet_gender: string | null;
  location_text: string | null;
  location_lat: number | null;
  location_lng: number | null;
  requirements: any;
  flagged: boolean;
  flagged_reason: string | null;
  flagged_at: string | null;
  created_at: string;
  updated_at: string;
  breeds: {
    id: string;
    name: string;
  }[];
  users: {
    id: string;
    display_name: string | null;
    email: string;
    profile_photo_url: string | null;
  }[];
}

export interface ListingFilters {
  status?: "available" | "pending" | "sold" | "withdrawn";
  type?: "litter" | "pet";
  flagged?: boolean;
  owner_id?: string;
  search?: string;
}

export interface ListingStats {
  totalListings: number;
  activeListings: number;
  flaggedListings: number;
  soldListings: number;
  averagePrice: number;
}

/**
 * Hook to get listings for admin moderation
 */
export const useAdminListings = (
  filters: ListingFilters = {},
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ["admin", "listings", filters, page, limit],
    queryFn: async (): Promise<{ listings: AdminListing[]; total: number }> => {
      let query = supabase.from("listings").select(
        `
          id,
          title,
          description,
          type,
          status,
          price,
          reservation_fee,
          photos,
          owner_id,
          breed_id,
          birth_date,
          available_date,
          number_of_puppies,
          pet_name,
          pet_age,
          pet_gender,
          location_text,
          location_lat,
          location_lng,
          requirements,
          flagged,
          flagged_reason,
          flagged_at,
          created_at,
          updated_at,
          breeds (
            id,
            name
          ),
          users (
            id,
            display_name,
            email,
            profile_photo_url
          )
        `,
        { count: "exact" }
      );

      // Apply filters
      if (filters.status) {
        query = query.eq("status", filters.status);
      }

      if (filters.type) {
        query = query.eq("type", filters.type);
      }

      if (filters.flagged !== undefined) {
        query = query.eq("flagged", filters.flagged);
      }

      if (filters.owner_id) {
        query = query.eq("owner_id", filters.owner_id);
      }

      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,pet_name.ilike.%${filters.search}%`
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
        listings: data || [],
        total: count || 0,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get listing statistics for admin dashboard
 */
export const useListingStats = () => {
  return useQuery({
    queryKey: queryKeys.admin.listings({ stats: true }),
    queryFn: async (): Promise<ListingStats> => {
      // Get all listings stats
      const { data: listings, error } = await supabase
        .from("listings")
        .select("status, price, flagged");

      if (error) throw error;

      const totalListings = listings?.length || 0;
      const activeListings =
        listings?.filter((l) => l.status === "available").length || 0;
      const flaggedListings = listings?.filter((l) => l.flagged).length || 0;
      const soldListings =
        listings?.filter((l) => l.status === "sold").length || 0;

      // Calculate average price (excluding null prices)
      const validPrices =
        listings?.filter((l) => l.price && l.price > 0).map((l) => l.price!) ||
        [];
      const averagePrice =
        validPrices.length > 0
          ? validPrices.reduce((sum, price) => sum + price, 0) /
            validPrices.length
          : 0;

      return {
        totalListings,
        activeListings,
        flaggedListings,
        soldListings,
        averagePrice,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get a single listing details for admin
 */
export const useAdminListingDetails = (listingId: string) => {
  return useQuery({
    queryKey: queryKeys.admin.listings({ details: listingId }),
    queryFn: async (): Promise<AdminListing | null> => {
      if (!listingId) return null;

      const { data, error } = await supabase
        .from("listings")
        .select(
          `
          id,
          title,
          description,
          type,
          status,
          price,
          reservation_fee,
          photos,
          owner_id,
          breed_id,
          birth_date,
          available_date,
          number_of_puppies,
          pet_name,
          pet_age,
          pet_gender,
          location_text,
          location_lat,
          location_lng,
          requirements,
          flagged,
          flagged_reason,
          flagged_at,
          created_at,
          updated_at,
          breeds (
            id,
            name
          ),
          users (
            id,
            display_name,
            email,
            profile_photo_url
          )
        `
        )
        .eq("id", listingId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!listingId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for admin listing moderation actions
 */
export const useListingModeration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listingId,
      action,
      data,
    }: {
      listingId: string;
      action: "flag" | "unflag" | "approve" | "reject" | "update_status";
      data?: any;
    }) => {
      const now = new Date().toISOString();

      switch (action) {
        case "flag":
          const { error: flagError } = await supabase
            .from("listings")
            .update({
              flagged: true,
              flagged_reason: data.reason,
              flagged_at: now,
              updated_at: now,
            })
            .eq("id", listingId);

          if (flagError) throw flagError;
          break;

        case "unflag":
          const { error: unflagError } = await supabase
            .from("listings")
            .update({
              flagged: false,
              flagged_reason: null,
              flagged_at: null,
              updated_at: now,
            })
            .eq("id", listingId);

          if (unflagError) throw unflagError;
          break;

        case "approve":
          const { error: approveError } = await supabase
            .from("listings")
            .update({
              status: "available",
              flagged: false,
              flagged_reason: null,
              flagged_at: null,
              updated_at: now,
            })
            .eq("id", listingId);

          if (approveError) throw approveError;
          break;

        case "reject":
          const { error: rejectError } = await supabase
            .from("listings")
            .update({
              status: "withdrawn",
              flagged: false,
              flagged_reason: null,
              flagged_at: null,
              updated_at: now,
            })
            .eq("id", listingId);

          if (rejectError) throw rejectError;
          break;

        case "update_status":
          const { error: statusError } = await supabase
            .from("listings")
            .update({
              status: data.status,
              updated_at: now,
            })
            .eq("id", listingId);

          if (statusError) throw statusError;
          break;

        default:
          throw new Error("Invalid action");
      }

      return { listingId, action, data };
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.listings() });
    },
  });
};

/**
 * Hook to get flagged listings that need immediate attention
 */
export const useFlaggedListings = (limit: number = 10) => {
  return useQuery({
    queryKey: ["admin", "flagged-listings", limit],
    queryFn: async (): Promise<Partial<AdminListing>[]> => {
      const { data, error } = await supabase
        .from("listings")
        .select(
          `
          id,
          title,
          type,
          status,
          photos,
          owner_id,
          flagged_reason,
          flagged_at,
          created_at,
          breeds (
            id,
            name
          ),
          users (
            id,
            display_name,
            email,
            profile_photo_url
          )
        `
        )
        .eq("flagged", true)
        .order("flagged_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
