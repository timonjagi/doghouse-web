import { workflow } from '@novu/framework';
import { z } from 'zod';

export const payoutProcessed = workflow('payout-processed', async ({ step, payload }: { step: any; payload: any }) => {
  // Send in-app notification to breeder
  await step.inApp('notify-breeder', async () => {
    return {
      subject: 'Payout Processed',
      body: `Your payout of ₦${payload.amount} has been processed successfully. Reference: ${payload.transferReference}`,
      data: {
        amount: payload.amount,
        transferReference: payload.transferReference,
      },
    };
  });

  // Send push notification to breeder
  await step.push('push-breeder', async () => {
    return {
      subject: 'Payout Processed',
      body: `Your payout of ₦${payload.amount} has been sent to your account!`,
      data: {
        amount: payload.amount,
        transferReference: payload.transferReference,
      },
    };
  });

  // Send email to breeder
  await step.email('email-breeder', async () => {
    return {
      subject: 'Payout Processed Successfully',
      body: `Dear Breeder,

Your payout of ₦${payload.amount} has been processed and transferred to your account.

Transfer Reference: ${payload.transferReference}

Thank you for using Pethouse!

Best regards,
Pethouse Team`,
    };
  });
}, {
  payloadSchema: z.object({
    breederId: z.string(),
    amount: z.number(),
    transferReference: z.string(),
  }),
});
