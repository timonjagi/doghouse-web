import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase/client";
import { queryKeys } from "../../queryKeys";
import { Review, Testimonial } from "../../db/schema";

// Interface for review with related data
export interface ReviewWithDetails extends Review {
  reviewer: {
    id: string;
    display_name: string | null;
    profile_photo_url: string | null;
  };
  breeder: {
    id: string;
    display_name: string | null;
    profile_photo_url: string | null;
  };
  adoption: {
    id: string;
    listings: {
      id: string;
      title: string;
      type: string;
    };
  };
}

// Interface for testimonial with admin data
export interface TestimonialWithAdmin extends Testimonial {
  created_by_user?: {
    id: string;
    display_name: string | null;
  };
}

// Interface for breeder review stats
export interface BreederReviewStats {
  breeder_id: string;
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// Query to get all reviews (admin use)
export const useReviews = (filters?: {
  breeder_id?: string;
  reviewer_id?: string;
  rating?: number;
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: queryKeys.reviews.list(filters),
    queryFn: async (): Promise<ReviewWithDetails[]> => {
      let query = supabase
        .from("reviews")
        .select(
          `
          *,
          reviewer:reviewer_id (
            id,
            display_name,
            profile_photo_url
          ),
          breeder:breeder_id (
            id,
            display_name,
            profile_photo_url
          ),
          adoption:adoption_id (
            id,
            listings (
              id,
              title,
              type
            )
          )
        `
        )
        .order("created_at", { ascending: false });

      if (filters?.breeder_id) {
        query = query.eq("breeder_id", filters.breeder_id);
      }
      if (filters?.reviewer_id) {
        query = query.eq("reviewer_id", filters.reviewer_id);
      }
      if (filters?.rating) {
        query = query.eq("rating", filters.rating);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(
          filters.offset,
          filters.offset + (filters.limit || 20) - 1
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
  });
};

// Query to get reviews for a specific breeder
export const useBreederReviews = (breederId: string, limit?: number) => {
  return useQuery({
    queryKey: queryKeys.reviews.byBreeder(breederId),
    queryFn: async (): Promise<ReviewWithDetails[]> => {
      if (!breederId) return [];

      const query = supabase
        .from("reviews")
        .select(
          `
          *,
          reviewer:reviewer_id (
            id,
            display_name,
            profile_photo_url
          ),
          breeder:breeder_id (
            id,
            display_name,
            profile_photo_url
          ),
          adoption:adoption_id (
            id,
            listings (
              id,
              title,
              type
            )
          )
        `
        )
        .eq("breeder_id", breederId)
        .eq("is_anonymous", false)
        .order("created_at", { ascending: false });

      if (limit) {
        query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    enabled: !!breederId,
  });
};

// Query to get reviews by a specific seeker
export const useSeekerReviews = (seekerId: string) => {
  return useQuery({
    queryKey: queryKeys.reviews.bySeeker(seekerId),
    queryFn: async (): Promise<ReviewWithDetails[]> => {
      if (!seekerId) return [];

      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
          *,
          reviewer:reviewer_id (
            id,
            display_name,
            profile_photo_url
          ),
          breeder:breeder_id (
            id,
            display_name,
            profile_photo_url
          ),
          adoption:adoption_id (
            id,
            listings (
              id,
              title,
              type
            )
          )
        `
        )
        .eq("reviewer_id", seekerId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!seekerId,
  });
};

// Query to get breeder review statistics
export const useBreederReviewStats = (breederId: string) => {
  return useQuery({
    queryKey: queryKeys.reviews.breederStats(breederId),
    queryFn: async (): Promise<BreederReviewStats> => {
      if (!breederId) {
        return {
          breeder_id: breederId,
          total_reviews: 0,
          average_rating: 0,
          rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        };
      }

      const { data: reviews, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("breeder_id", breederId)
        .eq("is_anonymous", false);

      if (error) throw error;

      const total_reviews = reviews?.length || 0;
      const average_rating =
        total_reviews > 0
          ? reviews!.reduce((sum, review) => sum + review.rating, 0) /
            total_reviews
          : 0;

      const rating_distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviews?.forEach((review) => {
        rating_distribution[
          review.rating as keyof typeof rating_distribution
        ]++;
      });

      return {
        breeder_id: breederId,
        total_reviews,
        average_rating: Math.round(average_rating * 10) / 10, // Round to 1 decimal
        rating_distribution,
      };
    },
    enabled: !!breederId,
  });
};

// Query to get review for a specific adoption
export const useAdoptionReview = (adoptionId: string) => {
  return useQuery({
    queryKey: queryKeys.reviews.byAdoption(adoptionId),
    queryFn: async (): Promise<ReviewWithDetails | null> => {
      if (!adoptionId) return null;

      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
          *,
          reviewer:reviewer_id (
            id,
            display_name,
            profile_photo_url
          ),
          breeder:breeder_id (
            id,
            display_name,
            profile_photo_url
          ),
          adoption:adoption_id (
            id,
            listings (
              id,
              title,
              type
            )
          )
        `
        )
        .eq("adoption_id", adoptionId)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows returned
      return data;
    },
    enabled: !!adoptionId,
  });
};

// Mutation to create a new review
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      adoption_id: string;
      rating: number;
      title?: string;
      comment?: string;
      aspects?: Record<string, any>;
      is_anonymous?: boolean;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // First get the adoption to find the breeder
      const { data: adoption, error: adoptionError } = await supabase
        .from("adoptions")
        .select("listings(owner_id)")
        .eq("id", data.adoption_id)
        .single();

      if (adoptionError) throw adoptionError;
      const breederId = (adoption as any).listings.owner_id;

      const { data: review, error } = await supabase
        .from("reviews")
        .insert({
          adoption_id: data.adoption_id,
          reviewer_id: user.id,
          breeder_id: breederId,
          rating: data.rating,
          title: data.title,
          comment: data.comment,
          aspects: data.aspects,
          is_anonymous: data.is_anonymous || false,
        })
        .select(
          `
          *,
          reviewer:reviewer_id (
            id,
            display_name,
            profile_photo_url
          ),
          breeder:breeder_id (
            id,
            display_name,
            profile_photo_url
          ),
          adoption:adoption_id (
            id,
            listings (
              id,
              title,
              type
            )
          )
        `
        )
        .single();

      if (error) throw error;
      return review;
    },
    onSuccess: (newReview) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      if (newReview.breeder_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.reviews.breederStats(newReview.breeder_id),
        });
      }
    },
  });
};

// Mutation to update a review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      rating?: number;
      title?: string;
      comment?: string;
      aspects?: Record<string, any>;
      is_anonymous?: boolean;
    }) => {
      const { data: review, error } = await supabase
        .from("reviews")
        .update({
          rating: data.rating,
          title: data.title,
          comment: data.comment,
          aspects: data.aspects,
          is_anonymous: data.is_anonymous,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id)
        .select(
          `
          *,
          reviewer:reviewer_id (
            id,
            display_name,
            profile_photo_url
          ),
          breeder:breeder_id (
            id,
            display_name,
            profile_photo_url
          ),
          adoption:adoption_id (
            id,
            listings (
              id,
              title,
              type
            )
          )
        `
        )
        .single();

      if (error) throw error;
      return review;
    },
    onSuccess: (updatedReview) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      if (updatedReview.breeder_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.reviews.breederStats(updatedReview.breeder_id),
        });
      }
    },
  });
};

// Mutation to delete a review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (error) throw error;
      return reviewId;
    },
    onSuccess: (deletedReviewId, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      // Note: We don't know the breeder_id here, so we invalidate all stats
      queryClient.invalidateQueries({ queryKey: ["reviews", "breeder-stats"] });
    },
  });
};

// Mutation to mark review as helpful
export const useMarkReviewHelpful = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase.rpc("increment_review_helpful", {
        review_id: reviewId,
      });

      if (error) throw error;
      return reviewId;
    },
    onSuccess: () => {
      // Invalidate reviews to update helpful counts
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

// TESTIMONIALS HOOKS

// Query to get all testimonials
export const useTestimonials = (filters?: {
  is_featured?: boolean;
  is_active?: boolean;
  limit?: number;
}) => {
  return useQuery({
    queryKey: queryKeys.testimonials.list(filters),
    queryFn: async (): Promise<TestimonialWithAdmin[]> => {
      let query = supabase
        .from("testimonials")
        .select(
          `
          *,
          created_by_user:created_by (
            id,
            display_name
          )
        `
        )
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (filters?.is_featured !== undefined) {
        query = query.eq("is_featured", filters.is_featured);
      }
      if (filters?.is_active !== undefined) {
        query = query.eq("is_active", filters.is_active);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
  });
};

// Query to get featured testimonials for landing page
export const useFeaturedTestimonials = (limit?: number) => {
  return useQuery({
    queryKey: queryKeys.testimonials.featured(),
    queryFn: async (): Promise<Testimonial[]> => {
      let query = supabase
        .from("testimonials")
        .select("*")
        .eq("is_featured", true)
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
  });
};

// Mutation to create a testimonial
export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      author_name: string;
      author_role?: string;
      author_location?: string;
      author_avatar_url?: string;
      content: string;
      rating?: number;
      is_featured?: boolean;
      sort_order?: number;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data: testimonial, error } = await supabase
        .from("testimonials")
        .insert({
          ...data,
          created_by: user.id,
        })
        .select(
          `
          *,
          created_by_user:created_by (
            id,
            display_name
          )
        `
        )
        .single();

      if (error) throw error;
      return testimonial;
    },
    onSuccess: () => {
      // Invalidate testimonials queries
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
};

// Mutation to update a testimonial
export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      author_name?: string;
      author_role?: string;
      author_location?: string;
      author_avatar_url?: string;
      content?: string;
      rating?: number;
      is_featured?: boolean;
      sort_order?: number;
      is_active?: boolean;
    }) => {
      const { data: testimonial, error } = await supabase
        .from("testimonials")
        .update(data)
        .eq("id", data.id)
        .select(
          `
          *,
          created_by_user:created_by (
            id,
            display_name
          )
        `
        )
        .single();

      if (error) throw error;
      return testimonial;
    },
    onSuccess: () => {
      // Invalidate testimonials queries
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
};

// Mutation to delete a testimonial
export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimonialId: string) => {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", testimonialId);

      if (error) throw error;
      return testimonialId;
    },
    onSuccess: () => {
      // Invalidate testimonials queries
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
};
