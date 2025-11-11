import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

interface PaystackTransferRequest {
  amount: number;
  recipient: string;
  reason: string;
  reference: string;
  type?: string;
  recipientName?: string;
  bankCode?: string;
}

interface PaystackTransferResponse {
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PaystackTransferResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      status: false,
      message: 'Method not allowed',
    });
  }

  try {
    // Verify user authentication
    const supabase = createServerSupabaseClient({ req, res });
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
      });
    }

    // Check if user is admin (only admins can process payouts)
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profileError || userProfile?.role !== 'admin') {
      return res.status(403).json({
        status: false,
        message: 'Admin access required for payout processing',
      });
    }

    const { amount, recipient, reason, reference, type, recipientName, bankCode }: PaystackTransferRequest = req.body;

    // Validate required fields
    if (!amount || !recipient || !reason || !reference) {
      return res.status(400).json({
        status: false,
        message: 'Missing required fields: amount, recipient, reason, reference',
      });
    }

    // Validate amount (must be at least 100 Naira/Kes equivalent)
    if (amount < 100) {
      return res.status(400).json({
        status: false,
        message: 'Amount must be at least 100',
      });
    }

    // Get Paystack secret key
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      console.error('Paystack secret key not configured');
      return res.status(500).json({
        status: false,
        message: 'Payment service configuration error',
      });
    }

    // Determine transfer type and validate recipient accordingly
    const transferType = type || 'mobile_money';
    let recipientPayload: any;

    if (transferType === 'mobile_money') {
      // Validate recipient phone number (Kenyan format)
      const kenyanPhoneRegex = /^(\+254|254|0)[17]\d{8}$/;
      if (!kenyanPhoneRegex.test(recipient)) {
        return res.status(400).json({
          status: false,
          message: 'Invalid Kenyan phone number format',
        });
      }

      recipientPayload = {
        type: 'mobile_money',
        name: recipientName || 'Breeder Payout',
        account_number: recipient,
        bank_code: 'MPESA',
        currency: 'KES',
      };
    } else if (transferType === 'bank') {
      // For bank transfers, recipient should be account number
      if (!bankCode) {
        return res.status(400).json({
          status: false,
          message: 'Bank code is required for bank transfers',
        });
      }

      recipientPayload = {
        type: 'nuban', // Nigerian account format, but Paystack supports Kenyan banks
        name: recipientName || 'Breeder Payout',
        account_number: recipient,
        bank_code: bankCode,
        currency: 'KES',
      };
    } else {
      return res.status(400).json({
        status: false,
        message: 'Invalid transfer type. Supported types: mobile_money, bank',
      });
    }

    // First, create or get recipient on Paystack
    const recipientResponse = await fetch('https://api.paystack.co/transferrecipient', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipientPayload),
    });

    if (!recipientResponse.ok) {
      const errorData = await recipientResponse.json();
      console.error('Paystack recipient creation error:', errorData);
      return res.status(500).json({
        status: false,
        message: 'Failed to create payout recipient',
      });
    }

    const recipientData = await recipientResponse.json();

    if (!recipientData.status) {
      return res.status(400).json({
        status: false,
        message: recipientData.message || 'Invalid recipient details',
      });
    }

    const recipientCode = recipientData.data.recipient_code;

    // Now create the transfer
    const transferResponse = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'balance',
        amount: amount * 100, // Paystack expects amount in kobo (multiply by 100)
        recipient: recipientCode,
        reason,
        reference,
        currency: 'KES',
      }),
    });

    if (!transferResponse.ok) {
      const errorData = await transferResponse.json();
      console.error('Paystack transfer error:', errorData);
      return res.status(500).json({
        status: false,
        message: 'Failed to initiate payout transfer',
      });
    }

    const transferData = await transferResponse.json();

    if (!transferData.status) {
      return res.status(400).json({
        status: false,
        message: transferData.message || 'Transfer initiation failed',
      });
    }

    // Log the payout in our database for tracking
    const { error: logError } = await supabase
      .from('activity_logs')
      .insert({
        user_id: session.user.id,
        action: 'payout_processed',
        description: `Payout of ${amount} KES to ${recipient}`,
        context: {
          transfer_reference: transferData.data.reference,
          transfer_code: transferData.data.transfer_code,
          amount,
          recipient,
          reason,
          reference,
        },
      });

    if (logError) {
      console.error('Failed to log payout activity:', logError);
      // Don't fail the payout if logging fails
    }

    // Return success response
    return res.status(200).json({
      status: true,
      message: 'Payout transfer initiated successfully',
      data: {
        reference: transferData.data.reference,
        amount,
        currency: 'KES',
        recipient,
        status: transferData.data.status,
        transfer_code: transferData.data.transfer_code,
      },
    });

  } catch (error) {
    console.error('Payout API error:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
    });
  }
}
