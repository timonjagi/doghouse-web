import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';
import { Adoption } from '../../db/schema';
import { NotificationService } from '../../services/notificationService';
import {
  CheckCircleIcon,
  WarningIcon,
  StarIcon,
  InfoIcon,
  CheckIcon,
  EditIcon,
} from '@chakra-ui/icons';

// Extended Adoption type with related data
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
    breeds: {
      id: string;
      name: string;
    };
    users?: {
      id: string;
      display_name: string;
      email: string;
      profile_photo_url: string | null;
      location_text: string | null;
    };
  };
  users: {
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
      has_other_pets: boolean | null;
    } | null;
  };
}


export interface AdoptionStatusHistory {
  id: string;
  adoption_id: string;
  status: string;
  notes?: string;
  created_at: string | Date;
}

interface UpdateAdoptionData {
  status?: string;
  reservation_paid?: boolean;
  contract_signed?: boolean;
  payment_completed?: boolean;
  application_data?: any
}

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending' | 'locked';
  date?: string;

  info?: string[];
}

interface AdoptionTimelineActions {
  onPayReservation?: () => void;
  onSignContract?: () => void;
  onCompletePayment?: () => void;
  onMarkCompleted?: () => void;
  onWithdrawAdoption?: () => void;
  onApproveAdoption?: () => void;
  onRejectAdoption?: () => void;
  onCheckPaymentStatus?: (reference: string, type: string) => void;
  onLeaveReview?: () => void;
  onContactBreeder?: () => void;
  onContactSupport?: () => void;
}



// Logic to determine steps and status
export const useAdoptionTimelineLogic = ({
  adoption,
  userProfile,
  transactions = [],
  statusHistory = []
}: {
  adoption: AdoptionWithListing;
  userProfile: any;
  transactions?: any[];
  statusHistory?: AdoptionStatusHistory[];
}) => {
  const isApplicant = userProfile?.id === adoption.seeker_id;

  // Helper to get date from history
  const getStatusDate = (statusKey: string) => {
    const entry = statusHistory.find(h => h.status === statusKey);
    return entry ? new Date(entry.created_at).toLocaleDateString() : undefined;
  };

  // Check for pending transactions
  const pendingTransactions = transactions?.filter(tx => tx.status === 'pending') || [];
  const hasPendingReservationPayment = pendingTransactions.some(tx => (tx.meta as any)?.payment_type === 'reservation');
  const hasPendingFinalPayment = pendingTransactions.some(tx => (tx.meta as any)?.payment_type === 'final');

  const contractRequired = adoption.listings?.requirements?.contract_required;

  const getTimelineSteps = (): TimelineStep[] => {
    if (isApplicant) {
      // Steps for seekers (applicants)
      const steps: TimelineStep[] = [
        {
          id: 'submitted',
          title: 'Adoption Submitted',
          description: 'Your adoption application has been received and is awaiting review',
          status: 'completed',
          date: getStatusDate('submitted') || new Date(adoption.created_at).toLocaleDateString(),
          info: [
            'Application includes your personal details and preferences',
            'Breeder will review your suitability for adoption',
          ],
        },
        {
          id: 'under_review',
          title: 'Under Review',
          description: 'Your application is being reviewed by the breeder',
          status: adoption.status === 'submitted' ? 'current' :
            ['pending', 'approved', 'rejected', 'reserved', 'completed'].includes(adoption.status) ? 'completed' : 'pending',
          date: getStatusDate('pending'),
          info: [
            'Breeder evaluates your application against their requirements',
            'May include phone/video calls or home visits',
          ],
        },

      ];

      if (['approved', 'rejected', 'reserved'].includes(adoption.status)) {
        steps.push(
          {
            id: 'decision',
            title: adoption.status === 'approved' ? 'Adoption Approved' : 'Decision Made',
            description: adoption.status === 'approved' || adoption.status === 'reserved'
              ? 'Congratulations! Your adoption application has been approved'
              : adoption.status === 'rejected'
                ? 'Your adoption application was not approved at this time'
                : 'Awaiting breeder decision',
            status: ['approved', 'rejected', 'reserved'].includes(adoption.status) ? 'completed' :
              adoption.status === 'pending' ? 'current' : 'pending',
            date: getStatusDate(adoption.status),
            info: adoption.status === 'approved' ? [
              'Listing is now temporarily reserved for you',
              'Next step: Pay reservation fee within 24 hours',
            ] : adoption.status === 'rejected' ? [
              'You can apply for other available listings',
              'Consider reaching out to the breeder for feedback',
            ] : [
              'Breeder will notify you of their decision',
              'This may take 1-3 business days',
            ],
          }
        )
      }
      // Add post-approval steps only if approved
      if (['approved', 'reserved'].includes(adoption.status)) {
        steps.push(
          {
            id: 'reserved',
            title: 'Reserve Listing',
            description: adoption.reservation_paid ? 'The listing has been reserved for you' : 'Pay reservation fee to secure your adoption',
            status: adoption.reservation_paid ? 'completed' : 'current',
            date: getStatusDate('reserved'),
            info: [
              'Reservation fee is deducted from final payment',
              'If payment is not received within 24 hours, listing will be released',
            ],
          }
        );
      }

      if (adoption.reservation_paid && contractRequired) {
        steps.push(
          {
            id: 'contract',
            title: 'Sign Adoption Contract',
            description: 'Review and sign the adoption contract',
            status: adoption.contract_signed ? 'completed' :
              adoption.reservation_paid ? 'current' : 'locked',
            info: [
              'Legal agreement outlining adoption terms',
              'Includes responsibilities of both parties',
              'Required by breeder before final payment',
            ],
          }
        )
      }

      if (adoption.contract_signed || (adoption.reservation_paid && !contractRequired)) {
        steps.push(
          {
            id: 'payment',
            title: 'Complete Payment',
            description: 'Make final payment to complete adoption',
            status: adoption.payment_completed ? 'completed' :
              adoption.contract_signed || (adoption.reservation_paid && !contractRequired) ? 'current' : 'locked',
            info: [
              'Reservation fee will be deducted from final amount',
              'Payment secures ownership transfer',
            ],
          }
        )
      }

      if (adoption.payment_completed) {
        steps.push(
          {
            id: 'completed',
            title: adoption.status === 'completed' ? 'Adoption Completed' : 'Pickup/ Delivery Arrangements',
            description: adoption.status === 'completed' ? 'Congratulations! Adoption process is complete. If you enjoyed your experiece, please leave us a review.' : 'Contact the breeder for pickup/delivery arrangements',
            status: adoption.status === 'completed' ? 'completed' : 'current',
            date: getStatusDate('completed'),
          }
        )
      }
      return steps;
    } else {
      // Steps for breeders (owners)
      const steps: TimelineStep[] = [
        {
          id: 'received',
          title: 'Application Received',
          description: 'New adoption application received for your listing',
          status: 'completed',
          date: getStatusDate('submitted') || new Date(adoption.created_at).toLocaleDateString(),
          info: [
            'Applicant has submitted their details and preferences',
            'Review their suitability for adoption',
          ],
        },
        {
          id: 'review',
          title: 'Review Application',
          description: 'Review the applicant\'s suitability',
          status: adoption.status === 'submitted' ? 'current' :
            ['pending', 'approved', 'rejected', 'reserved', 'completed'].includes(adoption.status) ? 'completed' : 'pending',
          date: getStatusDate('pending'),
          info: [
            'Evaluate applicant against your requirements',
            'Consider phone/video calls or home visits if needed',
          ],
        },
        {
          id: 'decision',
          title: adoption.status === 'approved' ? 'Adoption Approved' :
            adoption.status === 'rejected' ? 'Adoption Rejected' : 'Adoption Approved',
          description: ['approved', 'reserved', 'completed'].includes(adoption.status)
            ? 'You approved this adoption'
            : adoption.status === 'rejected'
              ? 'You rejected this adoption'
              : 'Approve or reject the application',
          status: ['approved', 'rejected', 'reserved', 'completed'].includes(adoption.status) ? 'completed' :
            adoption.status === 'pending' ? 'current' : 'pending',
          date: getStatusDate(adoption.status),
          info: adoption.status === 'approved' ? [
            'Applicant will be notified of approval',
            'They have 24 hours to pay reservation fee',
          ] : adoption.status === 'rejected' ? [
            'Applicant will be notified of rejection',
            'They can apply for other listings',
          ] : [
            'Take time to make the right decision',
            'Consider the applicant\'s profile and requirements',
          ]
        },
      ];

      // Add post-approval steps only if approved
      if (['approved', 'reserved', 'completed'].includes(adoption.status)) {
        steps.push(
          {
            id: 'awaiting_payment',
            title: 'Awaiting Reservation Payment',
            description: adoption.reservation_paid ? 'Reservation fee has been paid' : 'Waiting for applicant to pay reservation fee',
            status: adoption.reservation_paid ? 'completed' : 'current',
            date: getStatusDate('reserved'),
            info: [
              'Applicant has 24 hours to pay reservation fee',
              'If payment is not received within 24 hours, listing will be released',

            ],
          }
        );
      }

      if (adoption.reservation_paid && contractRequired) {
        steps.push(
          {
            id: 'awaiting_contract',
            title: 'Awaiting Contract Signature',
            description: adoption.contract_signed ? 'Contract has been signed' : 'Waiting for applicant to sign adoption contract',
            status: adoption.contract_signed ? 'completed' :
              adoption.reservation_paid ? 'current' : 'locked',
            info: [
              'Contract outlines adoption terms and responsibilities',
              'Both parties must agree to the terms',
            ],
          }
        )
      }

      if (adoption.contract_signed || (adoption.reservation_paid && !contractRequired)) {
        steps.push(
          {
            id: 'awaiting_final_payment',
            title: 'Awaiting Final Payment',
            description: adoption.payment_completed ? 'Final payment has been completed' : 'Waiting for applicant to complete final payment',
            status: adoption.payment_completed ? 'completed' :
              adoption.contract_signed || (adoption.reservation_paid && !contractRequired) ? 'current' : 'locked',
            info: [
              'Final payment completes the adoption',
              'Reservation fee will be deducted from total',
            ],
          }
        )
      }

      if (adoption.payment_completed) {
        steps.push(
          {
            id: 'finalize',
            title: adoption.status === 'completed' ? 'Adoption Completed' : 'Finalize Adoption',
            description: adoption.status === 'completed' ? 'Congratulations! Your adoption is complete. If you enjoyed your experiece, please leave us a review.' : 'Finalize the adoption.',
            status: adoption.status === 'completed' ? 'completed' : 'current',
            date: getStatusDate('completed'),
            info: [
              'Mark adoption as completed',
              'Arrange pickup/delivery with new owner',
            ],
          }
        )
      }
      return steps;
    }
  };

  const steps = getTimelineSteps();

  const getCurrentStepIndex = () => {
    // If completed, return length
    if (adoption.status === 'completed') return steps.length;
    // Otherwise find the first non-completed or current
    const idx = steps.findIndex(step => step.status === 'current');
    return idx === -1 ? steps.findIndex(step => step.status === 'locked') : idx;
  };

  const currentStep = steps.find(step => step.status === 'current');

  return {
    steps,
    currentStepIndex: getCurrentStepIndex(),
    currentStep,
    getStatusBannerProps: () => {
      // Always return current step or relevant info
      // Match banner with timeline status logic
      // If no current step (e.g. everything completed), use the last one
      const effectiveStep = currentStep || steps[steps.length - 1];
      if (!effectiveStep) return null;

      return {
        title: effectiveStep.title,
        description: effectiveStep.description,
        // actions are now handled externally
      }
    }
  };
};

export const ADOPTION_ACTION_CONFIGS = {
  withdraw: {
    type: 'withdraw',
    status: 'rejected',
    title: 'Adoption Withdrawn',
    message: 'Your adoption application has been successfully withdrawn',
    dialogBody: 'Are you sure you want to withdraw this adoption request? This action cannot be undone.',
    confirmText: 'Withdraw Adoption',
    colorScheme: 'red',
    icon: WarningIcon,
    buttonLabel: 'Withdraw Adoption'
  },
  approve: {
    type: 'approve',
    status: 'approved',
    title: 'Approve Adoption',
    message: 'The adoption application has been approved successfully',
    dialogBody: 'Approving this adoption will notify the applicant and allow them to proceed with the process.',
    confirmText: 'Approve Adoption',
    colorScheme: 'green',
    icon: CheckCircleIcon,
    buttonLabel: 'Approve'
  },
  reject: {
    type: 'reject',
    status: 'rejected',
    title: 'Reject Adoption',
    message: 'The adoption application has been rejected',
    dialogBody: 'Rejecting this adoption will notify the applicant that their request was not approved.',
    confirmText: 'Reject Adoption',
    colorScheme: 'red',
    icon: WarningIcon,
    buttonLabel: 'Reject'
  },
  complete: {
    type: 'complete',
    status: 'completed',
    title: 'Complete Adoption',
    message: 'The adoption process has been marked as completed',
    dialogBody: 'Marking this adoption as completed will move it to the completed tab and request a review from the applicant.',
    confirmText: 'Mark as Completed',
    colorScheme: 'purple',
    icon: CheckIcon,
    buttonLabel: 'Mark as Completed'
  },
  pay_reservation: {
    type: 'pay_reservation',
    title: 'Pay Reservation Fee',
    dialogBody: 'You are about to pay the reservation fee. This will secure the listing for you.',
    confirmText: 'Proceed to Payment',
    colorScheme: 'green',
    icon: StarIcon,
    buttonLabel: 'Pay Reservation Fee'
  },
  sign_contract: {
    type: 'sign_contract',
    title: 'Sign Contract',
    dialogBody: 'You are about to sign the adoption contract. Please review the terms carefully.',
    confirmText: 'Sign Contract',
    colorScheme: 'blue',
    icon: EditIcon,
    buttonLabel: 'Sign Contract'
  },
  complete_payment: {
    type: 'complete_payment',
    title: 'Complete Payment',
    dialogBody: 'You are about to make the final payment for your adoption.',
    confirmText: 'Proceed to Payment',
    colorScheme: 'green',
    icon: StarIcon,
    buttonLabel: 'Complete Payment'
  },
  contact_support: {
    type: 'contact_support',
    title: 'Contact Support',
    dialogBody: 'Need help? Contact our support team.',
    confirmText: 'Contact Support',
    colorScheme: 'orange',
    icon: InfoIcon,
    buttonLabel: 'Contact Support'
  },
  leave_review: {
    type: 'leave_review',
    title: 'Leave Review',
    dialogBody: 'Please leave a review for your experience.',
    confirmText: 'Leave Review',
    colorScheme: 'blue',
    icon: StarIcon,
    buttonLabel: 'Leave Review'
  },
  check_payment_status: {
    type: 'check_payment_status',
    title: 'Check Payment Status',
    dialogBody: 'Checking payment status...',
    confirmText: 'Check Status',
    colorScheme: 'blue',
    icon: InfoIcon,
    buttonLabel: 'Check Payment Status'
  }
};

export const useAdoptionActions = ({
  adoption,
  userProfile,
  transactions = [],
  actions
}: {
  adoption?: AdoptionWithListing;
  userProfile: any;
  transactions?: any[];
  actions: AdoptionTimelineActions;
}) => {
  const updateAdoptionMutation = useUpdateAdoption();

  if (!adoption) {
    return {
      updateAdoption: updateAdoptionMutation.mutateAsync,
      isLoading: updateAdoptionMutation.isPending,
      availableActions: []
    };
  }

  const isApplicant = userProfile?.id === adoption.seeker_id;
  const pendingTransactions = transactions?.filter(tx => tx.status === 'pending') || [];
  const hasPendingReservationPayment = pendingTransactions.some(tx => (tx.meta as any)?.payment_type === 'reservation');
  const hasPendingFinalPayment = pendingTransactions.some(tx => (tx.meta as any)?.payment_type === 'final');
  const contractRequired = adoption.listings?.requirements?.contract_required;

  const getAvailableActions = () => {
    const buttons: any[] = [];

    // Seeker Actions
    if (isApplicant) {
      if (adoption.status === 'submitted') {
        const config = ADOPTION_ACTION_CONFIGS.withdraw;
        buttons.push({
          ...config,
          label: config.buttonLabel,
          variant: 'outline'
        });
      }

      if (adoption.status === 'approved' && !adoption.reservation_paid && actions.onPayReservation) {
        buttons.push({
          label: 'Pay Reservation Fee',
          onClick: actions.onPayReservation,
          colorScheme: 'green',
          icon: StarIcon,
          variant: 'solid'
        });
      }

      if (['approved', 'reserved'].includes(adoption.status) && hasPendingReservationPayment && actions.onCheckPaymentStatus) {
        buttons.push({
          label: 'Check Payment Status',
          onClick: () => {
            const transaction = pendingTransactions.find(tx => (tx.meta as any)?.payment_type === 'reservation');
            if (transaction) {
              actions.onCheckPaymentStatus?.((transaction.meta as any).paystack_reference, 'reservation');
            }
          },
          colorScheme: 'blue',
          icon: InfoIcon,
          variant: 'outline'
        });

        if (actions.onContactSupport) {
          buttons.push({
            label: 'Contact Support',
            onClick: actions.onContactSupport,
            colorScheme: 'orange',
            icon: InfoIcon,
            variant: 'ghost'
          });
        }
      }

      if (adoption.status === 'rejected' && actions.onContactSupport) {
        buttons.push({
          label: 'Contact Support',
          onClick: actions.onContactSupport,
          colorScheme: 'red',
          icon: InfoIcon,
          variant: 'ghost'
        });
      }

      if (adoption.reservation_paid && !adoption.contract_signed && contractRequired && actions.onSignContract) {
        buttons.push({
          label: 'Sign Contract',
          onClick: actions.onSignContract,
          colorScheme: 'blue',
          icon: EditIcon,
          variant: 'solid'
        });
      }

      if ((adoption.contract_signed || (adoption.reservation_paid && !contractRequired)) && !adoption.payment_completed && actions.onCompletePayment) {
        buttons.push({
          label: 'Complete Payment',
          onClick: actions.onCompletePayment,
          colorScheme: 'green',
          icon: StarIcon,
          variant: 'solid'
        });
      }

      if (hasPendingFinalPayment && actions.onCheckPaymentStatus) {
        buttons.push({
          label: 'Check Payment Status',
          onClick: () => {
            const transaction = pendingTransactions.find(tx => (tx.meta as any)?.payment_type === 'final');
            if (transaction) {
              actions.onCheckPaymentStatus?.((transaction.meta as any).paystack_reference, 'final');
            }
          },
          colorScheme: 'blue',
          icon: InfoIcon,
          variant: 'outline'
        });
        if (actions.onContactSupport) {
          buttons.push({
            label: 'Contact Support',
            onClick: actions.onContactSupport,
            colorScheme: 'orange',
            icon: InfoIcon,
            variant: 'ghost'
          });
        }
      }

      if (adoption.status === 'completed' && actions.onLeaveReview) {
        buttons.push({
          label: 'Leave Review',
          onClick: actions.onLeaveReview,
          colorScheme: 'blue',
          icon: StarIcon,
          variant: 'solid'
        });
      }

    } else {
      // Breeder Actions
      if (adoption.status === 'submitted') {
        const approveConfig = ADOPTION_ACTION_CONFIGS.approve;
        const rejectConfig = ADOPTION_ACTION_CONFIGS.reject;

        buttons.push({
          ...approveConfig,
          label: approveConfig.buttonLabel,
          variant: 'solid'
        });

        buttons.push({
          ...rejectConfig,
          label: rejectConfig.buttonLabel,
          variant: 'outline'
        });
      }

      if (adoption.payment_completed && adoption.status !== 'completed') {
        const config = ADOPTION_ACTION_CONFIGS.complete;
        buttons.push({
          ...config,
          label: config.buttonLabel,
          variant: 'solid'
        });
      }

      if (adoption.status === 'completed' && actions.onLeaveReview) {
        buttons.push({
          label: 'Leave Review',
          onClick: actions.onLeaveReview,
          colorScheme: 'purple',
          icon: StarIcon,
          variant: 'solid'
        });
      }
    }

    return buttons;
  };

  return {
    updateAdoption: updateAdoptionMutation.mutateAsync,
    isLoading: updateAdoptionMutation.isPending,
    availableActions: getAvailableActions()
  };
};



// Query to get adoptions for a specific listing
export const useAdoptionsByListing = (listingId: string) => {
  return useQuery({
    queryKey: queryKeys.adoptions.byListing(listingId),
    queryFn: async (): Promise<AdoptionWithListing[]> => {
      const { data, error } = await supabase
        .from('adoptions')
        .select(`
          *,
          listings (
            id,
            title,
            type,
            price,
            photos,
            owner_id,
            requirements,
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
        `)
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!listingId,
  });
};

// Query to get adoptions by user (seeker)
export const useAdoptionsByUser = (userId?: string) => {
  return useQuery({
    queryKey: queryKeys.adoptions.byUser(userId),
    queryFn: async (): Promise<AdoptionWithListing[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('adoptions')
        .select(`
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
        `)
        .eq('seeker_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
};

// Query to get a single adoption by ID
export const useAdoption = (adoptionId: string) => {
  return useQuery({
    queryKey: queryKeys.adoptions.detail(adoptionId),
    queryFn: async (): Promise<AdoptionWithListing | null> => {
      if (!adoptionId) return null;

      const { data, error } = await supabase
        .from('adoptions')
        .select(`
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
            created_at,
            breeds (
              id,
              name
            ),
            users (
              id,
              display_name,
              email,
              phone,
              profile_photo_url,
              location_text,
              created_at,
              breeder_profiles (
                id,
                kennel_name,
                kennel_location
              )
            )
          ),
          users (
            id,
            display_name,
            email,
            phone,
            profile_photo_url,
            location_text,
            created_at,
            seeker_profiles (
              id,
              experience_level,
              has_allergies,
              has_children,
              has_other_pets
            )
          )
        `)
        .eq('id', adoptionId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!adoptionId,
  });
};

// Query to get adoptions received by a breeder (for their listings)
export const useAdoptionsReceived = (breederId?: string) => {
  return useQuery({
    queryKey: queryKeys.adoptions.received(breederId),
    queryFn: async (): Promise<AdoptionWithListing[]> => {
      if (!breederId) return [];

      // First get all listings by this breeder
      const { data: listings, error: listingsError } = await supabase
        .from('listings')
        .select('id')
        .eq('owner_id', breederId);

      if (listingsError) throw listingsError;
      if (!listings || listings.length === 0) return [];

      const listingIds = listings.map(l => l.id);

      const { data, error } = await supabase
        .from('adoptions')
        .select(`
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
        `)
        .in('listing_id', listingIds)
        .order('created_at', { ascending: false });

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
    mutationFn: async (adoptionData: {
      listing_id: string;
      application_data: Record<string, any>;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('adoptions')
        .insert({
          listing_id: adoptionData.listing_id,
          seeker_id: user.id,
          status: 'submitted',
          application_data: adoptionData.application_data,
        })
        .select(`
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
        `)
        .single();

      if (error) throw error;

      // Add status history entry
      await supabase
        .from('adoption_status_history')
        .insert({
          adoption_id: data.id,
          status: 'submitted',
          created_by: user.id,
        });

      return data;
    },
    onSuccess: async (data) => {
      // Send notification to breeder using NotificationService (DB + Novu, no email)
      try {
        // Get seeker info for the notification
        const { data: seeker } = await supabase
          .from('users')
          .select('display_name, profile_photo_url')
          .eq('id', data.seeker_id)
          .single();

        await NotificationService.sendNotification(
          {
            userId: data.listings.owner_id,
            type: 'application_received',
            title: 'New Adoption Application Received',
            body: `${seeker?.display_name || 'A seeker'} has submitted an adoption application for your listing "${data.listings.title}".`,
            targetType: 'adoption',
            targetId: data.listing_id,
            meta: {
              adoptionId: data.id,
              listingId: data.listing_id,
              seekerId: data.seeker_id,
              seekerName: seeker?.display_name,
            },
          },
          {
            workflowId: 'adoption-submitted',
            to: { subscriberId: data.listings.owner_id },
            payload: {
              adoptionId: data.id,
              listingId: data.listing_id,
              listingTitle: data.listings.title,
              seekerId: data.seeker_id,
              seekerName: seeker?.display_name || 'A seeker',
              seekerAvatar: seeker?.profile_photo_url,
            },
          }
        );
      } catch (notificationError) {
        console.error('Failed to send adoption application notification:', notificationError);
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.adoptions.byUser() });
      queryClient.invalidateQueries({ queryKey: queryKeys.adoptions.received() });
    },
  });
};

// Mutation to update adoption status
export const useUpdateAdoption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates
    }: {
      id: string;
      updates: UpdateAdoptionData
    }) => {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('adoptions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
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
        `)
        .single();

      if (error) throw error;

      // Add status history entry if status changed
      if (updates.status) {
        await supabase
          .from('adoption_status_history')
          .insert({
            adoption_id: id,
            status: updates.status,
            notes: updates.application_data?.response_message,
            created_by: user?.id,
          });
      }

      return data;
    },
    onSuccess: async (data) => {
      // Automatically reserve listing when adoption is approved
      if (data.status === 'approved') {
        try {
          await supabase
            .from('listings')
            .update({
              status: 'reserved',
              updated_at: new Date().toISOString()
            })
            .eq('id', data.listing_id);
        } catch (reserveError) {
          console.error('Failed to reserve listing:', reserveError);
        }
      }

      if (data.status === 'completed') {
        try {
          await supabase
            .from('listings')
            .update({
              status: 'sold',
              updated_at: new Date().toISOString()
            })
            .eq('id', data.listing_id);
        } catch (completeError) {
          console.error('Failed to complete listing:', completeError);
        }
      }

      // Send notifications to relevant parties using NotificationService (DB + Novu, no email)
      if (data.status === 'pending' || data.status === 'approved' || data.status === 'rejected' || data.status === 'withdrawn' || data.status === 'completed') {
        try {
          await NotificationService.sendAdoptionStatusNotification(
            data.seeker_id,
            data.listings?.owner_id || '',
            data.status,
            data.listings?.title || 'Listing',
            data.id,
            data.listing_id
          );
        } catch (notificationError) {
          console.error('Failed to send status change notification:', notificationError);
        }
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.adoptions.all() });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
};
