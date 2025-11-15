import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'lib/supabase/client';
import { paystack } from 'lib/services/paystack';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read raw body for signature verification
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks).toString('utf8');

    // Verify webhook signature
    const signature = req.headers['x-paystack-signature'] as string;
    if (!signature) {
      return res.status(400).json({ error: 'Missing webhook signature' });
    }

    const isValidSignature = paystack.verifyWebhookSignature(rawBody, signature);
    if (!isValidSignature) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const event = JSON.parse(rawBody);

    // Only process successful payment events
    if (event.event === 'charge.success') {
      const { reference, amount, metadata } = event.data;

      if (!reference || !metadata) {
        console.error('Invalid webhook data:', event);
        return res.status(400).json({ error: 'Invalid webhook data' });
      }

      const {
        application_id: applicationId,
        listing_id: listingId,
        payment_type: paymentType,
        seeker_id: seekerId,
        breeder_id: breederId,
      } = metadata;

      if (!applicationId || !paymentType || !seekerId) {
        console.error('Missing required metadata:', metadata);
        return res.status(400).json({ error: 'Missing required metadata' });
      }

      // Update transaction status
      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .update({
          status: 'completed',
          meta: {
            paystack_reference: reference,
            payment_type: paymentType,
            completed_at: new Date().toISOString(),
            webhook_event: event,
          },
        })
        .eq('meta->>paystack_reference', reference)
        .select()
        .single();

      if (txError) {
        console.error('Failed to update transaction:', txError);
        return res.status(500).json({ error: 'Failed to update transaction' });
      }

      // Update application status based on payment type
      if (paymentType === 'reservation') {
        // Update reservation payment status
        const { error: appError } = await supabase
          .from('applications')
          .update({
            reservation_paid: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', applicationId);

        if (appError) {
          console.error('Failed to update application reservation status:', appError);
        }

        // Create notification for breeder
        await supabase.from('notifications').insert({
          user_id: breederId,
          type: 'reservation_paid',
          title: 'Reservation Fee Paid',
          body: 'A seeker has paid the reservation fee for your listing.',
          target_type: 'application',
          target_id: applicationId,
        });

      } else if (paymentType === 'final') {
        // Update final payment status
        const { error: appError } = await supabase
          .from('applications')
          .update({
            payment_complete: true,
            status: 'completed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', applicationId);

        if (appError) {
          console.error('Failed to update application final payment status:', appError);
        }

        // Create notification for breeder
        await supabase.from('notifications').insert({
          user_id: breederId,
          type: 'final_payment_completed',
          title: 'Final Payment Completed',
          body: 'The final payment has been completed for your listing.',
          target_type: 'application',
          target_id: applicationId,
        });

        // TODO: Trigger payout to breeder (minus commission)
        // This would be implemented in the payout system
      }

      // Log activity
      await supabase.from('activity_logs').insert({
        user_id: seekerId,
        action: 'payment_completed',
        description: `Payment completed: ${paymentType} for application ${applicationId}`,
        context: {
          payment_type: paymentType,
          amount: amount / 100, // Convert from kobo
          reference,
          application_id: applicationId,
        },
      });

      console.log(`Payment processed successfully: ${paymentType} for application ${applicationId}`);
    }

    // Always return 200 for webhook to prevent retries
    res.status(200).json({ status: 'success' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    // Return 200 to prevent Paystack retries, but log the error
    res.status(200).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Disable body parsing for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};
