import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "lib/supabase/client";
import { Wishlist } from "../../db/schema";
import { useCurrentUser } from "./useAuth";
import { NotificationService } from "../../services/notificationService";

// Get user's wishlist
export const useWishlist = () => {
  const { data: user } = useCurrentUser();
  return useQuery({
    queryKey: ["wishlist", user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<any[]> => {
      const { data, error } = await supabase
        .from("wishlists")
        .select(
          `
          *,
          user_breeds (
            id,
            breed_id,
            images,
            is_owner,
            user_id,
            breeds (
              name,
              featured_image_url
            ),
            users (
               display_name,
               profile_photo_url,
               breeder_profiles (
                 kennel_name,
                 kennel_location,
                 rating,
                 verified_at
               )
            )
          ),
          breeds (
             id,
             name,
             featured_image_url,
             group
          )
        `
        )
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
  });
};

// Add item to wishlist
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: async ({
      user_breed_id,
      breed_id,
      breeder_id,
      notify_when_available = false,
    }: {
      user_breed_id?: string;
      breed_id?: string;
      breeder_id?: string;
      notify_when_available?: boolean;
    }) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("wishlists")
        .insert({
          user_id: user.id,
          user_breed_id,
          breed_id,
          breeder_id,
          notify_when_available,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });

      // Subscribe to appropriate interest topic for notifications
      if (data.notify_when_available && user?.id) {
        try {
          if (data.breed_id) {
            // Subscribe to breed interest topic
            const { data: breed } = await supabase
              .from("breeds")
              .select("name")
              .eq("id", data.breed_id)
              .single();

            const breedName = breed?.name || "Unknown Breed";

            await NotificationService.subscribeToBreedInterest(
              user.id,
              data.breed_id,
              breedName
            );
          } else if (data.user_breed_id) {
            // Subscribe to user breed interest topic
            const { data: userBreed } = await supabase
              .from("user_breeds")
              .select("breeds (name)")
              .eq("id", data.user_breed_id)
              .single();

            const breedName = userBreed?.breeds?.[0]?.name || "Unknown Breed";

            await NotificationService.subscribeToBreedInterest(
              user.id,
              data.user_breed_id,
              breedName
            );
          } else if (data.breeder_id) {
            // Subscribe to breeder activity topic
            const { data: breeder } = await supabase
              .from("users")
              .select("display_name")
              .eq("id", data.breeder_id)
              .single();

            const breederName = breeder?.display_name || "Unknown Breeder";

            await NotificationService.subscribeToBreeder(
              user.id,
              data.breeder_id,
              breederName
            );
          }
        } catch (error) {
          console.error("Failed to subscribe to interest:", error);
        }
      }
    },
  });
};

// Remove item from wishlist
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("wishlists")
        .select("breed_id, breeder_id")
        .eq("id", id)
        .single();

      if (error) throw error;

      // Delete from wishlist
      const { error: deleteError } = await supabase
        .from("wishlists")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      return data;
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });

      // Unsubscribe from appropriate interest topic
      if (user?.id) {
        try {
          if (data.breed_id) {
            await NotificationService.unsubscribeFromBreedInterest(
              user.id,
              data.breed_id
            );
          } else if (data.breeder_id) {
            await NotificationService.unsubscribeFromBreeder(
              user.id,
              data.breeder_id
            );
          }
        } catch (error) {
          console.error("Failed to unsubscribe from interest:", error);
        }
      }
    },
  });
};

// Toggle notification setting
export const useToggleWishlistNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      notify_when_available,
    }: {
      id: string;
      notify_when_available: boolean;
    }) => {
      const { data, error } = await supabase
        .from("wishlists")
        .update({ notify_when_available })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

// Check if item is in wishlist
export const useIsInWishlist = (user_breed_id?: string, breed_id?: string) => {
  const { data: user } = useCurrentUser();

  return useQuery({
    queryKey: [
      "wishlist",
      "check",
      { user_breed_id, breed_id, userId: user?.id },
    ],
    queryFn: async () => {
      if (!user?.id) return { inWishlist: false, wishlistId: null };

      let query = supabase.from("wishlists").select("id");

      if (user_breed_id) {
        query = query.eq("user_breed_id", user_breed_id);
      } else if (breed_id) {
        query = query.eq("breed_id", breed_id);
      }

      query = query.eq("user_id", user.id);

      const { data, error } = await query.maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      return { inWishlist: !!data, wishlistId: data?.id || null };
    },
    enabled: (!!user_breed_id || !!breed_id) && !!user?.id,
  });
};

export const useWishlistCount = () => {
  const { data: user } = useCurrentUser();
  return useQuery({
    queryKey: ["wishlist", "count", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { count, error } = await supabase
        .from("wishlists")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user?.id,
  });
};

// Check if user is subscribed to a breeder
export const useIsSubscribedToBreeder = (breederId?: string) => {
  const { data: user } = useCurrentUser();

  return useQuery({
    queryKey: [
      "breeder-subscription",
      "check",
      { breederId, userId: user?.id },
    ],
    queryFn: async () => {
      if (!user?.id || !breederId) return { isSubscribed: false };

      const { data, error } = await supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", user.id)
        .eq("breeder_id", breederId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      return { isSubscribed: !!data };
    },
    enabled: !!user?.id && !!breederId,
  });
};

// Get matches for breeder (users who wishlisted their items)
export const useBreederMatches = () => {
  const { data: user } = useCurrentUser();
  return useQuery({
    queryKey: ["breederMatches", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user?.id) return [];

      // Get user_breeds owned by user
      const { data: userBreeds } = await supabase
        .from("user_breeds")
        .select("id")
        .eq("user_id", user.id);
      const userBreedIds = userBreeds?.map((ub) => ub.id) || [];

      if (userBreedIds.length === 0) return [];

      const conditions: string[] = [];
      if (userBreedIds.length > 0)
        conditions.push(`user_breed_id.in.(${userBreedIds.join(",")})`);

      const { data, error } = await supabase
        .from("wishlists")
        .select(
          `
          *,
          users (
            id,
            display_name,
            profile_photo_url,
            email
          ),
          user_breeds (
            id,
            breeds (name)
          )
        `
        )
        .or(conditions.join(","));

      if (error) throw error;
      return data;
    },
  });
};
