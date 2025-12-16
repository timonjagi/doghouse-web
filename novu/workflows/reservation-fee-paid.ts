import { workflow } from '@novu/framework';
import { z } from 'zod';
import { createPaymentReceivedEmail } from '../../src/lib/emailTemplates';

export const reservationFeePaid = workflow('reservation-fee-paid', async ({ step, payload }) => {
  // Send in-app to breeder
  await step.inApp('notify-breeder', async () => {
    return {
      subject: 'Reservation Fee Paid',
      body: `Reservation fee of ${payload.amount} has been paid for your litter "${payload.litterName}".`,
      data: {
        applicationId: payload.applicationId,
      },
    };
  });

  // Send email to breeder
  await step.email('email-breeder', async () => {
    return {
      subject: 'Reservation Fee Received',
      body: createPaymentReceivedEmail(
        payload.breederName,
        'reservation',
        payload.amount,
        payload.litterName
      ),
    };
  });

  // Send WhatsApp to breeder
  await step.chat('whatsapp-breeder', async () => {
    return {
      body: `Hi ${payload.breederName}, reservation fee of ${payload.amount} has been received for "${payload.litterName}". Proceed with the next steps.`,
    };
  });

  // Send in-app to seeker
  await step.inApp('notify-seeker', async () => {
    return {
      subject: 'Payment Confirmed',
      body: `Your reservation fee of ${payload.amount} for "${payload.litterName}" has been processed.`,
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
