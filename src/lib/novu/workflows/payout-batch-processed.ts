import { workflow } from '@novu/framework';
import { z } from 'zod';

export const payoutBatchProcessed = workflow('payout-batch-processed', async ({ step, payload }) => {
  // Send in-app notification to admin
  await step.inApp('notify-admin', async () => {
    return {
      subject: 'Payout Batch Processed',
      body: `Successfully processed ${payload.processed} payouts with total amount ₦${payload.totalAmount}.`,
      data: {
        processed: payload.processed,
        totalAmount: payload.totalAmount,
      },
    };
  });

  // Send email to admin
  await step.email('email-admin', async () => {
    return {
      subject: 'Payout Batch Processing Complete',
      body: `Admin Notification,

The payout batch processing has been completed.

Processed Payouts: ${payload.processed}
Total Amount: ₦${payload.totalAmount}

Please review the transactions for any issues.

Best regards,
Pethouse System`,
    };
  });
}, {
  payloadSchema: z.object({
    processed: z.number(),
    totalAmount: z.number(),
  }),
});