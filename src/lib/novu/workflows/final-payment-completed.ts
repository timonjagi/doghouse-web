import { workflow } from '@novu/framework';
import { z } from 'zod';
import { createProfessionalEmailTemplate } from '../../emailTemplates';

export const finalPaymentCompleted = workflow('final-payment-completed', async ({ step, payload }) => {
  // Send in-app to breeder
  await step.inApp('notify-breeder', async () => {
    return {
      subject: 'Final Payment Completed',
      body: `Final payment of ${payload.amount} has been received for "${payload.litterName}". Adoption is complete.`,
      data: {
        applicationId: payload.applicationId,
      },
    };
  });

  // Send email to breeder
  await step.email('email-breeder', async () => {
    return {
      subject: 'Final Payment Received - Adoption Complete',
      body: createPaymentReceivedEmail(
        payload.breederName,
        'final',
        payload.amount,
        payload.litterName
      ),
    };
  });

  // Send WhatsApp to breeder
  await step.chat('whatsapp-breeder', async () => {
    return {
      body: `Hi ${payload.breederName}, final payment of ${payload.amount} for "${payload.litterName}" is complete. Congratulations on the adoption!`,
    };
  });

  // Send in-app to seeker
  await step.inApp('notify-seeker', async () => {
    return {
      subject: 'Adoption Complete',
      body: `Your final payment of ${payload.amount} for "${payload.litterName}" has been processed. Welcome to your new family!`,
      data: {
        applicationId: payload.applicationId,
      },
    };
  });
}, {
  payloadSchema: z.object({
    breederId: z.string(),
    breederName: z.string(),
    seekerId: z.string(),
    litterName: z.string(),
    applicationId: z.string(),
    amount: z.string(),
  }),
});
