import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';

export interface PaymentInitParams {
  amount: number;
  type: 'reservation' | 'final';
  applicationId: string;
  description: string;
  application: any; // Application with listing data
}

export interface PaymentInitResponse {
  authorization_url: string;
  reference: string;
  applicationId: string;
  paymentType: string;
  amount: number;
  description: string;
  listingId: string;
  breederId: string;
}

export interface PaystackTransactionResponse {
  status: boolean;
  message: string;
  data: PaymentInitResponse;
}

export interface PaymentVerificationResponse {
  status: string;
  reference: string;
  amount: number;
  paid_at?: string;
  created_at: string;
  channel: string;
  currency: string;
}

// Mutation to initialize payment
export const useInitiatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: PaymentInitParams): Promise<PaystackTransactionResponse> => {
      // Client-side validation before API call
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('You must be logged in to make a payment');
      }

      // Use application data passed from component (no redundant fetch)
      const application = params.application;

      // Verify user owns this application
      if (application.seeker_id !== user.id) {
        throw new Error('You do not have permission to make payments for this application');
      }

      // Validate payment logic using passed application data
      const listing = application.listings;
      if (!listing) {
        throw new Error('Listing information not found');
      }

      let paymentAmount: number;
      let paymentDescription: string;

      if (params.type === 'reservation') {
        // Reservation payment validation
        if (application.reservation_paid) {
          throw new Error('Reservation fee has already been paid');
        }

        if (!listing.reservation_fee) {
          throw new Error('No reservation fee is set for this listing');
        }

        paymentAmount = Number(listing.reservation_fee);
        paymentDescription = params.description || `Reservation fee for ${listing.title}`;
      } else {
        // Final payment validation
        if (!application.reservation_paid) {
          throw new Error('Reservation fee must be paid before making the final payment');
        }

        if (application.payment_complete) {
          throw new Error('Final payment has already been completed');
        }

        if (!application.contract_signed) {
          throw new Error('Contract must be signed before making the final payment');
        }

        const finalAmount = Number(listing.price) - Number(listing.reservation_fee);
        if (finalAmount <= 0) {
          throw new Error('Invalid payment amount calculated');
        }

        paymentAmount = finalAmount;
        paymentDescription = params.description || `Final payment for ${listing.title}`;
      }

      // Make API call with validated data
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentAmount,
          type: params.type,
          applicationId: params.applicationId,
          description: paymentDescription,
          listingId: listing.id,
          breederId: listing.owner_id,
          seekerEmail: user.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initialize payment');
      }

      const result = await response.json();

      // Add validated data to response for transaction creation
      result.data.validatedData = {
        applicationId: params.applicationId,
        paymentType: params.type,
        amount: paymentAmount,
        description: paymentDescription,
        listingId: listing.id,
        breederId: listing.owner_id,
        seekerId: user.id,
      };

      return result;
    },
    onSuccess: async (result: PaystackTransactionResponse) => {
      const validatedData = (result as any).data.validatedData;

      // Create transaction record in database after successful payment initialization
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          application_id: validatedData.applicationId,
          seeker_id: validatedData.seekerId,
          breeder_id: validatedData.breederId,
          amount: validatedData.amount,
          commission_fee: validatedData.amount * 0.1, // 10% commission
          status: 'pending',
          meta: {
            paystack_reference: result.data.reference,
            payment_type: validatedData.paymentType,
            description: validatedData.description,
          },
        });

      if (txError) {
        console.error('Failed to create transaction record:', txError);
        // Don't fail the payment, but log the error
      }

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() });
    },
  });
};

// Mutation to verify payment
export const useVerifyPayment = (applicationId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reference: string): Promise<PaymentVerificationResponse> => {
      const response = await fetch(`/api/payments/verify/${reference}`);
      if (!response.ok) {
        throw new Error('Failed to check payment status');
      }

      const result = await response.json();
      return result;
    },

    onSuccess: async (data) => {
      if (data.status === 'completed' && applicationId) {
        // Find the pending transaction for this application and reference
        try {
          const { data: transaction, error: txFetchError } = await supabase
            .from('transactions')
            .select('id, meta')
            .eq('application_id', applicationId)
            .eq('status', 'pending')
            .eq('meta->>paystack_reference', data.reference)
            .single();

          if (txFetchError) throw txFetchError;

          if (transaction) {
            const paymentType = (transaction.meta as any)?.payment_type;
            // Update transaction status to completed
            const { data: txn, error: txError } = await supabase
              .from('transactions')
              .update({
                status: 'completed',
                payment_method: data.channel,
                updated_at: new Date().toISOString(),
              })
              .eq('id', transaction.id)
              .select()
              .single();

            console.log('updted txn', txn)

            if (txError) throw txError;
            // Update application fields based on payment type
            const updateData: any = {};
            if (paymentType === 'reservation') {
              updateData.reservation_paid = true;
              updateData.status = 'reserved'
            } else if (paymentType === 'final') {
              updateData.payment_completed = true;
            }

            if (Object.keys(updateData).length > 0) {
              console.log(updateData)
              const { data: app, error: appError } = await supabase
                .from('applications')
                .update({
                  ...updateData,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', applicationId)
                .select()
                .single();

              if (appError) throw appError;

              console.log('updated application', app)
            }
          }
        } catch (error) {
          console.error(error);
          return
        }
      }

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() });
    },
  });
};

// Legacy hook for backward compatibility - DEPRECATED
// Use useInitiatePayment and useVerifyPayment directly instead
export const usePayments = (props: {
  onPaymentSuccess?: (reference: string) => void;
  onPaymentError?: (error: string) => void;
} = {}) => {
  const { onPaymentSuccess, onPaymentError } = props;

  const initiatePaymentMutation = useInitiatePayment();
  const verifyPaymentMutation = useVerifyPayment();

  const initiatePayment = async (params: PaymentInitParams) => {
    try {
      const result = await initiatePaymentMutation.mutateAsync(params);
      return result;
    } catch (error) {
      onPaymentError?.(error instanceof Error ? error.message : 'Payment initialization failed');
      throw error;
    }
  };

  const verifyPayment = async (reference: string) => {
    try {
      const result = await verifyPaymentMutation.mutateAsync(reference);
      if (result.status === 'completed') {
        onPaymentSuccess?.(reference);
      }
      return result;
    } catch (error) {
      onPaymentError?.(error instanceof Error ? error.message : 'Payment verification failed');
      throw error;
    }
  };

  return {
    // Payment initiation
    initiatePayment,
    isInitiatingPayment: initiatePaymentMutation.isPending,

    // Payment verification
    verifyPayment,
    isVerifyingPayment: verifyPaymentMutation.isPending,
  };
};
