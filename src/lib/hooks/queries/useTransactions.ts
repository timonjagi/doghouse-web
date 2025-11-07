import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';
import { Transaction } from '../../../../db/schema';


export interface TransactionFilters extends Record<string, unknown> {
  status?: string;
  payment_method?: string;
  date_from?: string;
  date_to?: string;
}

// Query to get all user transactions with optional filters
export const useTransactions = (filters?: TransactionFilters) => {
  return useQuery({
    queryKey: queryKeys.transactions.list(filters),
    queryFn: async (): Promise<Transaction[] | any[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let query = supabase
        .from('transactions')
        .select(`
          id,
          application_id,
          seeker_id,
          breeder_id,
          amount,
          commission_fee,
          status,
          payment_method,
          created_at,
          updated_at,
          meta,
          applications (
            listings (
              title,
              owner_id
            )
          )
        `)
        .or(`seeker_id.eq.${user.id},breeder_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.payment_method) {
        query = query.eq('payment_method', filters.payment_method);
      }
      if (filters?.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      if (filters?.date_to) {
        query = query.lte('created_at', filters.date_to);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });
};

// Query to get transaction by ID
export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: queryKeys.transactions.detail(id),
    queryFn: async (): Promise<Transaction | null> => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          application_id,
          seeker_id,
          breeder_id,
          amount,
          commission_fee,
          status,
          payment_method,
          payout_status,
          created_at,
          updated_at,
          meta,
          applications (
            listings (
              title,
              owner_id
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

// Query to get transactions by application
export const useTransactionsByApplication = (applicationId: string) => {
  return useQuery({
    queryKey: ['transactions', 'by-application', applicationId],
    queryFn: async (): Promise<Transaction[] | any[]> => {
      console.log(applicationId)
      if (!applicationId) throw new Error('Applciation Id missing')
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          application_id,
          seeker_id,
          breeder_id,
          amount,
          commission_fee,
          status,
          payment_method,
          created_at,
          meta
        `)
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!applicationId,
  });
};

// Query to get billing history (enhanced transaction data)
export const useBillingHistory = () => {
  return useQuery({
    queryKey: queryKeys.transactions.billing('current'),
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { payments: [], earnings: [] };

      // Get payments made (as seeker)
      const { data: payments, error: paymentsError } = await supabase
        .from('transactions')
        .select(`
          *,
          applications (
            listings (
              title,
              owner_id
            )
          )
        `)
        .eq('seeker_id', user.id)
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;

      // Get earnings received (as breeder)
      const { data: earnings, error: earningsError } = await supabase
        .from('transactions')
        .select(`
          *,
          applications (
            listings (
              title
            )
          )
        `)
        .eq('breeder_id', user.id)
        .order('created_at', { ascending: false });

      if (earningsError) throw earningsError;

      return {
        payments: payments || [],
        earnings: earnings || [],
      };
    },
  });
};

// Query to get transaction statistics
export const useTransactionStats = () => {
  return useQuery({
    queryKey: ['transactions', 'stats', 'current'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { totalPaid: 0, totalEarned: 0, pendingPayments: 0 };

      // Get total paid (as seeker)
      const { data: payments, error: paymentsError } = await supabase
        .from('transactions')
        .select('amount, status')
        .eq('seeker_id', user.id);

      if (paymentsError) throw paymentsError;

      // Get total earned (as breeder)
      const { data: earnings, error: earningsError } = await supabase
        .from('transactions')
        .select('amount, commission_fee, status')
        .eq('breeder_id', user.id);

      if (earningsError) throw earningsError;

      const totalPaid = payments?.reduce((sum, tx) => sum + (tx.status === 'completed' ? tx.amount : 0), 0) || 0;
      const totalEarned = earnings?.reduce((sum, tx) => sum + (tx.status === 'completed' ? (tx.amount - tx.commission_fee) : 0), 0) || 0;
      const pendingPayments = payments?.filter(tx => tx.status === 'pending').length || 0;

      return {
        totalPaid,
        totalEarned,
        pendingPayments,
      };
    },
  });
};

// Mutation to update transaction status
export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('transactions')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() });
    },
  });
};

// Mutation to create manual transaction (for admin purposes)
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionData: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() });
    },
  });
};
