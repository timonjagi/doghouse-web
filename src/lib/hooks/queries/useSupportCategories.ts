import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase/client";
import { queryKeys } from "../../queryKeys";
import { SupportCategory } from "../../db/schema";

// Query to get all active support categories
export const useSupportCategories = () => {
  return useQuery({
    queryKey: queryKeys.support.categories.active(),
    queryFn: async (): Promise<SupportCategory[]> => {
      const { data, error } = await supabase
        .from("support_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - categories don't change often
  });
};

// Query to get all support categories (including inactive for admin)
export const useAllSupportCategories = () => {
  return useQuery({
    queryKey: queryKeys.support.categories.all(),
    queryFn: async (): Promise<SupportCategory[]> => {
      const { data, error } = await supabase
        .from("support_categories")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Query to get category by ID
export const useSupportCategory = (id: string) => {
  return useQuery({
    queryKey: [...queryKeys.support.categories.all(), id],
    queryFn: async (): Promise<SupportCategory | null> => {
      const { data, error } = await supabase
        .from("support_categories")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

// Admin mutations for category management
export const useCreateSupportCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: {
      name: string;
      description?: string;
      icon?: string;
      sort_order?: number;
    }) => {
      const { data, error } = await supabase
        .from("support_categories")
        .insert(category)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.support.categories.all(),
      });
    },
  });
};

export const useUpdateSupportCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<
        Pick<
          SupportCategory,
          "name" | "description" | "icon" | "sort_order" | "is_active"
        >
      >;
    }) => {
      const { data, error } = await supabase
        .from("support_categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.support.categories.all(),
      });
    },
  });
};

export const useDeleteSupportCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Check if category has associated FAQs or tickets
      const { data: faqs } = await supabase
        .from("support_faqs")
        .select("id")
        .eq("category_id", id)
        .limit(1);

      const { data: tickets } = await supabase
        .from("support_tickets")
        .select("id")
        .eq("category_id", id)
        .limit(1);

      if (faqs?.length || tickets?.length) {
        throw new Error(
          "Cannot delete category with associated FAQs or tickets"
        );
      }

      const { error } = await supabase
        .from("support_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.support.categories.all(),
      });
    },
  });
};
