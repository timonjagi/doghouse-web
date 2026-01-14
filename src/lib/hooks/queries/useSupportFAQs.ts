import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase/client";
import { queryKeys } from "../../queryKeys";
import { SupportFAQ, SupportCategory } from "../../db/schema";

// Query to get all active FAQs
export const useSupportFAQs = (categoryId?: string) => {
  return useQuery({
    queryKey: queryKeys.support.faqs.list({ categoryId }),
    queryFn: async (): Promise<SupportFAQ[]> => {
      let query = supabase
        .from("support_faqs")
        .select(
          `
          *,
          support_categories (
            id,
            name,
            icon
          )
        `
        )
        .eq("is_active", true)
        .order("view_count", { ascending: false });

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Query to get featured FAQs
export const useFeaturedFAQs = (limit: number = 6) => {
  return useQuery({
    queryKey: queryKeys.support.faqs.list({ featured: true, limit }),
    queryFn: async (): Promise<SupportFAQ[]> => {
      const { data, error } = await supabase
        .from("support_faqs")
        .select(
          `
          *,
          support_categories (
            id,
            name,
            icon
          )
        `
        )
        .eq("is_featured", true)
        .eq("is_active", true)
        .order("view_count", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Query to get FAQ by ID
export const useSupportFAQ = (id: string) => {
  return useQuery({
    queryKey: queryKeys.support.faqs.detail(id),
    queryFn: async (): Promise<SupportFAQ | null> => {
      const { data, error } = await supabase
        .from("support_faqs")
        .select(
          `
          *,
          support_categories (
            id,
            name,
            icon
          )
        `
        )
        .eq("id", id)
        .eq("is_active", true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

// Query to search FAQs
export const useFAQSearch = (searchQuery: string) => {
  return useQuery({
    queryKey: queryKeys.support.faqs.search(searchQuery),
    queryFn: async (): Promise<SupportFAQ[]> => {
      if (!searchQuery.trim()) return [];

      const { data, error } = await supabase
        .from("support_faqs")
        .select(
          `
          *,
          support_categories (
            id,
            name,
            icon
          )
        `
        )
        .eq("is_active", true)
        .or(`question.ilike.%${searchQuery}%,answer.ilike.%${searchQuery}%`)
        .order("view_count", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    },
    enabled: !!searchQuery.trim(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Mutation to track FAQ view
export const useTrackFAQView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (faqId: string) => {
      // Increment view count using direct table update
      const { data: currentFAQ, error: fetchError } = await supabase
        .from("support_faqs")
        .select("view_count")
        .eq("id", faqId)
        .single();

      if (fetchError) throw fetchError;

      const newViewCount = (currentFAQ.view_count || 0) + 1;

      const { error } = await supabase
        .from("support_faqs")
        .update({ view_count: newViewCount })
        .eq("id", faqId);

      if (error) throw error;
      return faqId;
    },
    onSuccess: (faqId) => {
      // Invalidate FAQ queries to update view counts
      queryClient.invalidateQueries({
        queryKey: queryKeys.support.faqs.detail(faqId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.support.faqs.lists(),
      });
    },
  });
};

// Mutation to vote on FAQ helpfulness
export const useVoteFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      faqId,
      isHelpful,
    }: {
      faqId: string;
      isHelpful: boolean;
    }) => {
      // Get current vote counts
      const { data: currentFAQ, error: fetchError } = await supabase
        .from("support_faqs")
        .select("helpful_votes, not_helpful_votes")
        .eq("id", faqId)
        .single();

      if (fetchError) throw fetchError;

      // Increment the appropriate vote count
      const updateData = isHelpful
        ? { helpful_votes: (currentFAQ.helpful_votes || 0) + 1 }
        : { not_helpful_votes: (currentFAQ.not_helpful_votes || 0) + 1 };

      const { error } = await supabase
        .from("support_faqs")
        .update(updateData)
        .eq("id", faqId);

      if (error) throw error;
      return faqId;
    },
    onSuccess: (faqId) => {
      // Invalidate FAQ queries to update vote counts
      queryClient.invalidateQueries({
        queryKey: queryKeys.support.faqs.detail(faqId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.support.faqs.lists(),
      });
    },
  });
};

// Admin mutations for FAQ management
export const useCreateFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (faq: {
      question: string;
      answer: string;
      category_id?: string;
      is_featured?: boolean;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from("support_faqs")
        .insert({
          ...faq,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.support.faqs.lists(),
      });
    },
  });
};

export const useUpdateFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<
        Pick<
          SupportFAQ,
          "question" | "answer" | "category_id" | "is_featured" | "is_active"
        >
      >;
    }) => {
      const { data, error } = await supabase
        .from("support_faqs")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.support.faqs.lists(),
      });
    },
  });
};

export const useDeleteFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("support_faqs")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.support.faqs.lists(),
      });
    },
  });
};
