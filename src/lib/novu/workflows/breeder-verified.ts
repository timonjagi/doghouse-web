import { workflow } from '@novu/framework';
import { z } from 'zod';

export const breederVerified = workflow('breeder-verified', async ({ step, payload }) => {
  // Send in-app notification
  await step.inApp('notify-breeder', async () => {
    return {
      subject: 'Verification Approved',
      body: 'Congratulations! Your breeder profile has been verified. You can now start listing litters.',
      data: {},
    };
  });

  // Send push notification
  await step.push('push-breeder', async () => {
    return {
      subject: 'Breeder Verification Approved!',
      body: 'Congratulations! Your profile has been verified. Start listing your litters today!',
      data: {
        breederId: payload.breederId,
      },
    };
  });

  // Send WhatsApp
  await step.chat('whatsapp-breeder', async () => {
    return {
      body: `Hi ${payload.breederName}, your breeder verification has been approved. Welcome to Pethouse!`,
    };
  });

  // Send email
  await step.email('email-breeder', async () => {
    return {
      subject: 'Breeder Verification Approved',
      body: `Dear ${payload.breederName},\n\nYour breeder profile has been verified. You can now manage your kennel and list litters on Pethouse.\n\nBest regards,\nPethouse Team`,
    };
  });
}, {
  payloadSchema: z.object({
    breederId: z.string(),
    breederName: z.string(),
  }),
});
