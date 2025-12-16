import { workflow } from '@novu/framework';
import { z } from 'zod';

export const adoptionSubmitted = workflow('adoption-submitted', async ({ step, payload }) => {
  // Send in-app notification to breeder
  await step.inApp('notify-breeder', async () => {
    return {
      subject: 'New Adoption Application',
      body: `A new adoption application has been submitted for your listing "${payload.listingTitle}".`,
      avatar: payload.seekerAvatar,
      data: {
        listingId: payload.listingId,
        seekerId: payload.seekerId,
      },
    };
  });

  // Send WhatsApp to breeder (if enabled)
  await step.chat('whatsapp-breeder', async () => {
    return {
      body: `Hi ${payload.breederName}, a new adoption application has been submitted for your listing "${payload.listingTitle}". Check your dashboard for details.`,
    };
  });

  // Send in-app confirmation to seeker
  await step.inApp('confirm-seeker', async () => {
    return {
      subject: 'Application Submitted',
      body: `Your application for "${payload.listingTitle}" has been submitted successfully.`,
      data: {
        listingId: payload.listingId,
      },
    };
  });

  // Notify admin of new adoption
  await step.inApp('notify-admin', async () => {
    return {
      subject: 'New Adoption Application',
      body: `A new adoption application submitted for "${payload.listingTitle}" by ${payload.seekerName}.`,
      data: {
        listingId: payload.listingId,
        adoptionId: payload.adoptionId,
      },
    };
  });
}, {
  payloadSchema: z.object({
    listingId: z.string(),
    listingTitle: z.string(),
    breederId: z.string(),
    breederName: z.string(),
    seekerId: z.string(),
    seekerName: z.string(),
    seekerAvatar: z.string().optional(),
    adoptionId: z.string(),
  }),
});