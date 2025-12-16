import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PayoutService } from '../../services/payoutService';
import { queryKeys } from '../../queryKeys';
import { supabase } from '../../supabase/client';
import novu from '../../novu';

export interface PayoutResult {
  success: boolean;
  message: string;
  transferReference?: string;
  amount?: number;
}

/**
 * Hook to get pending payouts for admin overview
 */
export const usePendingPayouts = () => {
  return useQuery({
    queryKey: queryKeys.payouts.pending(),
    queryFn: () => PayoutService.getPendingPayouts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to calculate payout amount for a specific breeder
 */
export const useBreederPayoutCalculation = (breederId: string) => {
  return useQuery({
    queryKey: queryKeys.payouts.calculation(breederId),
    queryFn: () => PayoutService.calculateBreederPayout(breederId),
    enabled: !!breederId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to process payout for a specific breeder
 */
export const useProcessBreederPayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ breederId, payoutOptions }: {
      breederId: string;
      payoutOptions?: {
        method?: 'mobile_money' | 'bank';
        recipientPhone?: string;
        bankCode?: string;
        accountNumber?: string;
      };
    }) => PayoutService.processBreederPayout(breederId, payoutOptions),
    onSuccess: (result, { breederId }) => {
      if (result.success) {
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: queryKeys.payouts.pending() });
        queryClient.invalidateQueries({ queryKey: queryKeys.payouts.calculation(breederId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() });
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });

        // Add notifications
        try {
          // Supabase insert
          await supabase.from('notifications').insert({
            user_id: breederId,
            type: 'payout_processed',
            title: 'Payout Processed',
            body: `Your payout of ₦${result.amount} has been processed successfully.`,
            meta: {
              amount: result.amount,
              transferReference: result.transferReference,
            },
          });

          // Novu trigger
          await novu.trigger({
            workflowId: 'payout-processed',
            to: { subscriberId: breederId },
            payload: {
              amount: result.amount,
              transferReference: result.transferReference,
              breederId,
            },
          });
        } catch (error) {
          console.error('Failed to send payout notifications:', error);
        }
      }
    },
  });
};

/**
 * Hook to process all pending payouts (admin function)
 */
export const useProcessAllPayouts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => PayoutService.processAllPendingPayouts(),
    onSuccess: (result) => {
      if (result.success || result.processed > 0) {
        // Invalidate all payout-related queries
        queryClient.invalidateQueries({ queryKey: queryKeys.payouts.all() });
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() });
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });

        // Add notification for admin
        try {
          await supabase.from('notifications').insert({
            user_id: 'admin', // Assuming admin ID
            type: 'payout_batch_processed',
            title: 'Payout Batch Processed',
            body: `Processed ${result.processed} payouts successfully.`,
            meta: {
              processed: result.processed,
              totalAmount: result.totalAmount,
            },
          });

          // Novu trigger for admin
          await novu.trigger({
            workflowId: 'payout-batch-processed',
            to: { subscriberId: 'admin' },
            payload: {
              processed: result.processed,
              totalAmount: result.totalAmount,
            },
          });
        } catch (error) {
          console.error('Failed to send admin payout notifications:', error);
        }
      }
    },
  });
};

/**
 * Hook to get payout statistics for admin dashboard
 */
export const usePayoutStats = () => {
  return useQuery({
    queryKey: queryKeys.payouts.stats(),
    queryFn: async () => {
      const pendingPayouts = await PayoutService.getPendingPayouts();

      // Calculate statistics
      const totalPendingAmount = pendingPayouts.reduce((sum, tx) => {
        return sum + (tx.amount - tx.commission_fee);
      }, 0);

      const uniqueBreeders = new Set(pendingPayouts.map(tx => tx.breeder_id)).size;

      const totalTransactions = pendingPayouts.length;

      return {
        totalPendingAmount,
        uniqueBreeders,
        totalTransactions,
        averagePayout: uniqueBreeders > 0 ? totalPendingAmount / uniqueBreeders : 0,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
