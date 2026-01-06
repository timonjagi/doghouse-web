import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase/client";
import { queryKeys } from "../../queryKeys";
import { Adoption } from "../../db/schema";
import { NotificationService } from "../../services/notificationService";
import {
  CheckCircleIcon,
  WarningIcon,
  StarIcon,
  InfoIcon,
  CheckIcon,
  EditIcon,
  ChatIcon,
} from "@chakra-ui/icons";

// Interface for adoption with full listing data
export interface AdoptionWithListing extends Adoption {
  listings: {
    id: string;
    title: string;
    type: string;
    price: number | null;
    reservation_fee: number | null;
    photos: string[];
    owner_id: string;
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
    breeds?: {
      id: string;
      name: string;
    };
    users?: {
      id: string;
      display_name: string;
      email: string;
      profile_photo_url: string | null;
      location_text: string | null;
      created_at: string;
      phone: string | null;
      seeker_profiles?: {
        id: string;
        experience_level: string | null;
        living_situation: string | null;
        has_allergies: boolean | null;
        has_children: boolean | null;
        has_other_pets: boolean | null;
      };
    };
  };
}

export interface AdoptionStatusHistory {
  id: string;
  adoption_id: string;
  status: string;
  notes?: string;
  created_at: string | Date;
}

export interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "pending" | "locked";
  date?: string;
  info?: string[];
}

export interface UpdateAdoptionData {
  status?: string;
  reservation_paid?: boolean;
  contract_signed?: boolean;
  payment_completed?: boolean;
  application_data?: any;
}

// Query to get a single adoption by ID with full listing data
export const useAdoption = (adoptionId: string) => {
  return useQuery({
    queryKey: queryKeys.adoptions.detail(adoptionId),
    queryFn: async (): Promise<AdoptionWithListing | null> => {
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
            reservation_fee,
            photos,
            owner_id,
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
            breeds (
              id,
              name
            ),
            users (
              id,
              display_name,
              email,
              profile_photo_url,
              location_text,
              phone,
              seeker_profiles (
                id,
                experience_level,
                living_situation,
                has_allergies,
                has_children,
                has_other_pets
              )
            )
          )
          `
        )
        .eq("id", adoptionId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!adoptionId,
  });
};

// Query to get adoptions by user (seeker) - moved from useListings
export const useAdoptionsByUser = (userId?: string) => {
  return useQuery({
    queryKey: queryKeys.adoptions.byUser(userId),
    queryFn: async (): Promise<AdoptionWithListing[]> => {
      if (!userId) return [];

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
            photos,
            owner_id,
            breeds (
              id,
              name
            )
          ),
          users (
            id,
            display_name,
            email,
            profile_photo_url
          )
          `
        )
        .eq("seeker_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
};

// Query to get adoptions received by breeder (for their listings)
export const useAdoptionsReceived = (breederId?: string) => {
  return useQuery({
    queryKey: ["adoptions", "received", breederId],
    queryFn: async (): Promise<AdoptionWithListing[]> => {
      if (!breederId) return [];

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
            photos,
            owner_id,
            breeds (
              id,
              name
            )
          ),
          users (
            id,
            display_name,
            email,
            profile_photo_url
          )
          `
        )
        .eq("listings.owner_id", breederId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!breederId,
  });
};

// Mutation to create a new adoption
export const useCreateAdoption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { listing_id: string; application_data: any }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data: adoption, error } = await supabase
        .from("adoptions")
        .insert({
          listing_id: data.listing_id,
          seeker_id: user.id,
          status: "submitted",
          application_data: data.application_data,
        })
        .select(
          `
          *,
          listings (
            id,
            title,
            type,
            price,
            photos,
            owner_id,
            breeds (
              id,
              name
            )
          )
        `
        )
        .single();

      if (error) throw error;
      return adoption;
    },
    onSuccess: (newAdoption) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["adoptions"] });

      // Send notification to listing owner and seeker
      if (newAdoption?.listings?.owner_id && newAdoption?.seeker_id) {
        NotificationService.sendAdoptionStatusNotification(
          newAdoption.seeker_id,
          newAdoption.listings.owner_id,
          "submitted",
          newAdoption.listings.title,
          newAdoption.id,
          newAdoption.listings.id
        );
      }
    },
  });
};

// Mutation to update an existing adoption
export const useUpdateAdoption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; updates: UpdateAdoptionData }) => {
      const { data: adoption, error } = await supabase
        .from("adoptions")
        .update({
          ...data.updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id)
        .select(
          `
          *,
          listings (
            id,
            title,
            owner_id,
            breeds (
              id,
              name
            )
          )
        `
        )
        .single();

      if (error) throw error;
      return adoption;
    },
    onSuccess: (updatedAdoption, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["adoptions"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.adoptions.detail(variables.id),
      });

      // Send notifications based on status change
      if (
        variables.updates.status &&
        updatedAdoption?.listings?.owner_id &&
        updatedAdoption?.seeker_id
      ) {
        NotificationService.sendAdoptionStatusNotification(
          updatedAdoption.seeker_id,
          updatedAdoption.listings.owner_id,
          variables.updates.status,
          updatedAdoption.listings.title,
          updatedAdoption.id,
          updatedAdoption.listings.id
        );
      }
    },
  });
};

// Adoption action configuration
export const ADOPTION_ACTION_CONFIGS = {
  approve: {
    label: "Approve Application",
    buttonLabel: "Approve Application",
    variant: "solid",
    colorScheme: "green",
    icon: CheckCircleIcon,
    requiresPayment: false,
    disabled: false,
  },
  reject: {
    label: "Reject Application",
    buttonLabel: "Reject Application",
    variant: "solid",
    colorScheme: "red",
    icon: WarningIcon,
    requiresPayment: false,
    disabled: false,
  },
  request_payment: {
    label: "Request Payment",
    buttonLabel: "Request Payment",
    variant: "solid",
    colorScheme: "blue",
    icon: StarIcon,
    requiresPayment: true,
    disabled: false,
  },
  reserve: {
    label: "Reserve Pet",
    buttonLabel: "Reserve Pet",
    variant: "solid",
    colorScheme: "purple",
    icon: InfoIcon,
    requiresPayment: true,
    disabled: false,
  },
  complete: {
    label: "Complete Adoption",
    buttonLabel: "Complete Adoption",
    variant: "solid",
    colorScheme: "green",
    icon: CheckIcon,
    requiresPayment: false,
    disabled: false,
  },
  withdraw: {
    label: "Withdraw Application",
    buttonLabel: "Withdraw Application",
    variant: "solid",
    colorScheme: "orange",
    icon: WarningIcon,
    requiresPayment: false,
    disabled: false,
  },
  message: {
    label: "Send Message",
    buttonLabel: "Send Message",
    variant: "outline",
    colorScheme: "blue",
    icon: ChatIcon,
    requiresPayment: false,
    disabled: false,
  },
  edit: {
    label: "Edit Application",
    buttonLabel: "Edit Application",
    variant: "outline",
    colorScheme: "gray",
    icon: EditIcon,
    requiresPayment: false,
    disabled: false,
  },
} as const;

// Hook for adoption timeline logic
export const useAdoptionTimelineLogic = ({
  adoption,
  userProfile,
  transactions,
  statusHistory,
}: {
  adoption: AdoptionWithListing | null;
  userProfile?: any;
  transactions?: any[];
  statusHistory?: AdoptionStatusHistory[];
}) => {
  const getTimelineSteps = (): TimelineStep[] => {
    if (!adoption) return [];

    const steps: TimelineStep[] = [
      {
        id: "application_submitted",
        title: "Application Submitted",
        description:
          "Your adoption application has been submitted and is under review.",
        status: adoption.status === "submitted" ? "current" : "completed",
        date: adoption.created_at.toString(),
      },
      {
        id: "application_reviewed",
        title: "Application Reviewed",
        description:
          "The breeder will review your application and make a decision.",
        status: ["pending", "approved", "rejected"].includes(adoption.status)
          ? "completed"
          : "pending",
      },
      {
        id: "reservation_payment",
        title: "Reservation Payment",
        description: "Pay the reservation fee to secure the pet.",
        status: adoption.reservation_paid
          ? "completed"
          : ["approved", "completed"].includes(adoption.status)
          ? "current"
          : "locked",
        info: adoption.reservation_paid ? ["Reservation fee paid"] : undefined,
      },
      {
        id: "contract_signing",
        title: "Contract Signing",
        description: "Review and sign the adoption contract.",
        status: adoption.contract_signed
          ? "completed"
          : adoption.reservation_paid
          ? "current"
          : "locked",
        info: adoption.contract_signed ? ["Contract signed"] : undefined,
      },
      {
        id: "final_payment",
        title: "Final Payment",
        description: "Complete the final payment to finalize the adoption.",
        status: adoption.payment_completed
          ? "completed"
          : adoption.contract_signed
          ? "current"
          : "locked",
        info: adoption.payment_completed
          ? ["Final payment completed"]
          : undefined,
      },
      {
        id: "adoption_completed",
        title: "Adoption Completed",
        description: "Congratulations! Your adoption process is complete.",
        status: adoption.status === "completed" ? "completed" : "locked",
      },
    ];

    return steps;
  };

  const steps = getTimelineSteps();
  const currentStepIndex = steps.findIndex((step) => step.status === "current");
  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;

  return {
    steps,
    currentStepIndex,
    currentStep,
  };
};

// Get available adoption actions based on current state
export const getAvailableAdoptionActions = (
  adoption: AdoptionWithListing | null,
  userProfile?: any,
  transactions?: any[]
) => {
  if (!adoption || !userProfile) return [];

  const isBreeder = userProfile.id === adoption.listings.owner_id;
  const isSeeker = userProfile.id === adoption.seeker_id;
  const actions: string[] = [];

  if (isSeeker) {
    switch (adoption.status) {
      case "submitted":
        actions.push("withdraw", "message");
        break;
      case "approved":
        if (!adoption.reservation_paid) {
          actions.push("reserve");
        }
        actions.push("message", "withdraw");
        break;
      case "pending":
        actions.push("message", "withdraw");
        break;
      case "rejected":
        actions.push("message");
        break;
    }
  }

  if (isBreeder) {
    switch (adoption.status) {
      case "submitted":
      case "pending":
        actions.push("approve", "reject", "message");
        break;
      case "approved":
        actions.push("message");
        if (
          adoption.reservation_paid &&
          adoption.contract_signed &&
          !adoption.payment_completed
        ) {
          actions.push("complete");
        }
        break;
      case "completed":
        actions.push("message");
        break;
    }
  }

  return actions
    .map((action) => ({
      ...ADOPTION_ACTION_CONFIGS[
        action as keyof typeof ADOPTION_ACTION_CONFIGS
      ],
      action,
    }))
    .filter(Boolean);
};

// Get priority action for UI
export const getPriorityAdoptionAction = (
  adoption: AdoptionWithListing | null,
  userProfile?: any,
  transactions?: any[]
) => {
  const availableActions = getAvailableAdoptionActions(
    adoption,
    userProfile,
    transactions
  );

  // Priority order for different statuses
  if (!adoption || !userProfile) return null;

  const isSeeker = userProfile.id === adoption.seeker_id;
  const isBreeder = userProfile.id === adoption.listings.owner_id;

  if (isSeeker) {
    switch (adoption.status) {
      case "approved":
        if (!adoption.reservation_paid) {
          return availableActions.find((action) => action.action === "reserve");
        }
        break;
      case "submitted":
        return (
          availableActions.find((action) => action.action === "withdraw") ||
          availableActions.find((action) => action.action === "message")
        );
    }
  }

  if (isBreeder) {
    switch (adoption.status) {
      case "submitted":
      case "pending":
        return (
          availableActions.find((action) => action.action === "approve") ||
          availableActions.find((action) => action.action === "reject")
        );
      case "approved":
        if (
          adoption.reservation_paid &&
          adoption.contract_signed &&
          !adoption.payment_completed
        ) {
          return availableActions.find(
            (action) => action.action === "complete"
          );
        }
        break;
    }
  }

  return availableActions[0] || null;
};
