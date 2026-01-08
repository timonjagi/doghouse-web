import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase/client";
import { queryKeys } from "../../queryKeys";

export interface AdminBreed {
  id: string;
  name: string;
  description: string | null;
  pet_type: string;
  characteristics: any;
  featured_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface BreedFilters {
  petType?: string;
  search?: string;
}

export interface BreedStats {
  totalBreeds: number;
  breedsByPetType: Record<string, number>;
  userBreedsCount: number;
  listingsCount: number;
}

export interface UserBreed {
  id: string;
  breed_id: string;
  user_id: string;
  title: string;
  description: string | null;
  photos: string[];
  price: number | null;
  available_date: string | null;
  created_at: string;
  updated_at: string;
  users: {
    id: string;
    display_name: string | null;
    email: string;
  }[];
}

/**
 * Hook to get all breeds for admin management
 */
export const useAdminBreeds = (
  filters: BreedFilters = {},
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: queryKeys.admin.breeds(filters, page, limit),
    queryFn: async (): Promise<{ breeds: AdminBreed[]; total: number }> => {
      let query = supabase.from("breeds").select("*", { count: "exact" });

      // Apply filters
      if (filters.petType) {
        query = query.eq("pet_type", filters.petType);
      }

      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
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
        breeds: data || [],
        total: count || 0,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get breed statistics for admin dashboard
 */
export const useBreedStats = () => {
  return useQuery({
    queryKey: queryKeys.admin.breedStats(),
    queryFn: async (): Promise<BreedStats> => {
      // Get all breeds
      const { data: breeds, error: breedsError } = await supabase
        .from("breeds")
        .select("pet_type");

      if (breedsError) throw breedsError;

      // Get user_breeds count
      const { count: userBreedsCount } = await supabase
        .from("user_breeds")
        .select("*", { count: "exact", head: true });

      // Get listings count
      const { count: listingsCount } = await supabase
        .from("listings")
        .select("*", { count: "exact", head: true });

      const totalBreeds = breeds?.length || 0;

      // Group breeds by pet type
      const breedsByPetType =
        breeds?.reduce((acc, breed) => {
          acc[breed.pet_type] = (acc[breed.pet_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

      return {
        totalBreeds,
        breedsByPetType,
        userBreedsCount: userBreedsCount || 0,
        listingsCount: listingsCount || 0,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get a single breed details for admin
 */
export const useAdminBreedDetails = (breedId: string) => {
  return useQuery({
    queryKey: queryKeys.admin.breedDetails(breedId),
    queryFn: async (): Promise<AdminBreed | null> => {
      if (!breedId) return null;

      const { data, error } = await supabase
        .from("breeds")
        .select("*")
        .eq("id", breedId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!breedId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get user_breeds for a specific breed
 */
export const useAdminBreedUserBreeds = (
  breedId: string,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery({
    queryKey: queryKeys.admin.breedUserBreeds(breedId, page, limit),
    queryFn: async (): Promise<{ userBreeds: UserBreed[]; total: number }> => {
      if (!breedId) return { userBreeds: [], total: 0 };

      let query = supabase.from("user_breeds").select(
        `
          id,
          breed_id,
          user_id,
          title,
          description,
          photos,
          price,
          available_date,
          created_at,
          updated_at,
          users (
            id,
            display_name,
            email
          )
        `,
        { count: "exact" }
      );

      query = query.eq("breed_id", breedId);

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      // Order by creation date (newest first)
      query = query.order("created_at", { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        userBreeds: data || [],
        total: count || 0,
      };
    },
    enabled: !!breedId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for admin breed CRUD operations
 */
export const useAdminBreedActions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      breedId,
      action,
      data,
    }: {
      breedId?: string;
      action: "create" | "update" | "delete";
      data?: any;
    }) => {
      const now = new Date().toISOString();

      switch (action) {
        case "create":
          const { data: newBreed, error: createError } = await supabase
            .from("breeds")
            .insert({
              ...data,
              created_at: now,
              updated_at: now,
            })
            .select()
            .single();

          if (createError) throw createError;
          return newBreed;

        case "update":
          if (!breedId) throw new Error("Breed ID required for update");

          const { data: updatedBreed, error: updateError } = await supabase
            .from("breeds")
            .update({
              ...data,
              updated_at: now,
            })
            .eq("id", breedId)
            .select()
            .single();

          if (updateError) throw updateError;
          return updatedBreed;

        case "delete":
          if (!breedId) throw new Error("Breed ID required for deletion");

          const { error: deleteError } = await supabase
            .from("breeds")
            .delete()
            .eq("id", breedId);

          if (deleteError) throw deleteError;
          return { breedId };

        default:
          throw new Error("Invalid action");
      }
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.breeds() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.breedStats() });
    },
  });
};

/**
 * Hook for admin user_breed operations
 */
export const useAdminUserBreedActions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userBreedId,
      action,
      data,
    }: {
      userBreedId: string;
      action: "update" | "delete";
      data?: any;
    }) => {
      const now = new Date().toISOString();

      switch (action) {
        case "update":
          const { data: updatedUserBreed, error: updateError } = await supabase
            .from("user_breeds")
            .update({
              ...data,
              updated_at: now,
            })
            .eq("id", userBreedId)
            .select()
            .single();

          if (updateError) throw updateError;
          return updatedUserBreed;

        case "delete":
          const { error: deleteError } = await supabase
            .from("user_breeds")
            .delete()
            .eq("id", userBreedId);

          if (deleteError) throw deleteError;
          return { userBreedId };

        default:
          throw new Error("Invalid action");
      }
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["admin", "breed-user-breeds"],
      });
    },
  });
};
