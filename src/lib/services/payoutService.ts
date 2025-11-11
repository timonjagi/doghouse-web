import { supabase } from '../supabase/client';

export interface PayoutTransaction {
  id: string;
  amount: number;
  commission_fee: number;
  breeder_id: string;
  application_id: string;
  meta: any;
  applications?: Array<{
    listings?: Array<{
      title: string;
    }>;
  }>;
  users?: Array<{
    display_name: string;
    email: string;
  }>;
}

export interface PaystackTransferResponse {
  status: boolean;
  message: string;
  data?: {
    reference: string;
    amount: number;
    currency: string;
    recipient: string;
    status: string;
    transfer_code: string;
  };
}

export class PayoutService {
  private static readonly COMMISSION_RATE = 0.1; // 10%
  private static readonly MINIMUM_PAYOUT = 5000; // Ksh. 5,000

  /**
   * Get all transactions ready for payout
   */
  static async getPendingPayouts(): Promise<PayoutTransaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id,
        amount,
        commission_fee,
        breeder_id,
        application_id,
        meta,
        applications (
          listings (
            title
          )
        ),
        users!transactions_breeder_id_fkey (
          display_name,
          email
        )
      `)
      .eq('status', 'completed')
      .eq('payout_status', 'pending')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching pending payouts:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Calculate payout amount for a breeder (total earnings minus commission)
   */
  static async calculateBreederPayout(breederId: string): Promise<{
    totalEarnings: number;
    totalCommission: number;
    payoutAmount: number;
    transactions: PayoutTransaction[];
  }> {
    const transactions = await this.getPendingPayouts();

    // Filter transactions for this breeder
    const breederTransactions = transactions.filter(tx => tx.breeder_id === breederId);

    const totalEarnings = breederTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const totalCommission = breederTransactions.reduce((sum, tx) => sum + tx.commission_fee, 0);
    const payoutAmount = totalEarnings - totalCommission;

    return {
      totalEarnings,
      totalCommission,
      payoutAmount,
      transactions: breederTransactions,
    };
  }

  /**
   * Process payout for a breeder via Paystack
   */
  static async processBreederPayout(
    breederId: string,
    payoutOptions?: {
      method?: 'mobile_money' | 'bank';
      recipientPhone?: string;
      bankCode?: string;
      accountNumber?: string;
    }
  ): Promise<{
    success: boolean;
    message: string;
    transferReference?: string;
    amount?: number;
  }> {
    try {
      // Get breeder payout calculation
      const payoutData = await this.calculateBreederPayout(breederId);

      // Check minimum payout threshold
      if (payoutData.payoutAmount < this.MINIMUM_PAYOUT) {
        return {
          success: false,
          message: `Payout amount (${payoutData.payoutAmount}) is below minimum threshold (${this.MINIMUM_PAYOUT})`,
        };
      }

      // Determine payout method and recipient details
      let recipient: string;
      let transferType: string;
      let recipientName: string;

      if (payoutOptions?.method === 'bank' && payoutOptions.bankCode && payoutOptions.accountNumber) {
        // Bank transfer
        recipient = payoutOptions.accountNumber;
        transferType = 'bank';
        recipientName = 'Bank Account'; // Generic name for bank transfers
      } else {
        // Mobile money (default or specified)
        recipient = payoutOptions?.recipientPhone || '';
        transferType = 'mobile_money';

        // If no custom phone provided, get from breeder profile
        if (!recipient) {
          const { data: breederProfile, error: profileError } = await supabase
            .from('breeder_profiles')
            .select('*, users(*)')
            .eq('user_id', breederId)
            .single();

          if (profileError || !breederProfile) {
            throw new Error('Breeder profile not found');
          }

          recipient = breederProfile.users?.phone || '';
          recipientName = breederProfile.users?.display_name || 'Breeder';
        } else {
          recipientName = 'Custom Recipient';
        }
      }

      if (!recipient) {
        return {
          success: false,
          message: 'No payout recipient configured',
        };
      }

      // Create Paystack transfer with custom recipient details
      const transferResponse = await this.createPaystackTransfer({
        amount: payoutData.payoutAmount,
        recipient,
        reason: `Payout for ${payoutData.transactions.length} completed transactions`,
        reference: `payout_${breederId}_${Date.now()}`,
        type: transferType,
        recipientName,
        bankCode: payoutOptions?.bankCode,
      });

      if (transferResponse.status) {
        // Update transaction payout statuses to completed
        const transactionIds = payoutData.transactions.map(tx => tx.id);

        const { error: updateError } = await supabase
          .from('transactions')
          .update({
            payout_status: 'completed',
            updated_at: new Date().toISOString(),
          })
          .in('id', transactionIds);

        if (updateError) {
          console.error('Error updating transaction payout status:', updateError);
          // Continue anyway - the transfer was successful
        }

        // Create payout notification
        await this.createPayoutNotification(breederId, payoutData, transferResponse.data);

        return {
          success: true,
          message: 'Payout processed successfully',
          transferReference: transferResponse.data?.reference,
          amount: payoutData.payoutAmount,
        };
      } else {
        return {
          success: false,
          message: transferResponse.message || 'Payout processing failed',
        };
      }
    } catch (error) {
      console.error('Error processing breeder payout:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Create Paystack transfer
   */
  private static async createPaystackTransfer(params: {
    amount: number;
    recipient: string;
    reason: string;
    reference: string;
    type?: string;
    recipientName?: string;
    bankCode?: string;
  }): Promise<PaystackTransferResponse> {
    try {
      const response = await fetch('/api/payments/payout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: params.amount,
          recipient: params.recipient,
          reason: params.reason,
          reference: params.reference,
          type: params.type,
          recipientName: params.recipientName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payout transfer');
      }

      return await response.json();
    } catch (error) {
      console.error('Paystack transfer error:', error);
      return {
        status: false,
        message: error instanceof Error ? error.message : 'Transfer failed',
      };
    }
  }

  /**
   * Create payout notification for breeder
   */
  private static async createPayoutNotification(
    breederId: string,
    payoutData: any,
    transferData?: any
  ): Promise<void> {
    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: breederId,
          type: 'payout_processed',
          title: 'Payout Processed',
          body: `Your payout of Ksh. ${payoutData.payoutAmount.toLocaleString()} for ${payoutData.transactions.length} completed transactions has been processed and is on its way.`,
          target_type: 'billing',
          target_id: breederId,
          meta: {
            payoutAmount: payoutData.payoutAmount,
            transactionCount: payoutData.transactions.length,
            transferReference: transferData?.reference,
            transferCode: transferData?.transfer_code,
          },
        });
    } catch (notificationError) {
      console.error('Failed to create payout notification:', notificationError);
      // Don't fail the payout if notification fails
    }
  }

  /**
   * Process all pending payouts (admin function)
   */
  static async processAllPendingPayouts(): Promise<{
    success: boolean;
    processed: number;
    failed: number;
    totalAmount: number;
    results: Array<{
      breederId: string;
      success: boolean;
      message: string;
      amount?: number;
    }>;
  }> {
    const pendingTransactions = await this.getPendingPayouts();

    // Group by breeder
    const breederGroups = pendingTransactions.reduce((groups, tx) => {
      if (!groups[tx.breeder_id]) {
        groups[tx.breeder_id] = [];
      }
      groups[tx.breeder_id].push(tx);
      return groups;
    }, {} as Record<string, PayoutTransaction[]>);

    const results = [];
    let processed = 0;
    let failed = 0;
    let totalAmount = 0;

    for (const [breederId, transactions] of Object.entries(breederGroups)) {
      const result = await this.processBreederPayout(breederId);
      results.push({
        breederId,
        success: result.success,
        message: result.message,
        amount: result.amount,
      });

      if (result.success) {
        processed++;
        totalAmount += result.amount || 0;
      } else {
        failed++;
      }
    }

    return {
      success: failed === 0,
      processed,
      failed,
      totalAmount,
      results,
    };
  }
}
