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
