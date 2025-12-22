import { workflow } from '@novu/framework';
import { z } from 'zod';

export const breedMatchFound = workflow('breed-match-found', async ({ step, payload }) => {
  // Send in-app notification to seeker
  await step.inApp('notify-seeker', async () => {
    return {
      subject: 'New Breed Match Found',
      body: `A new litter for "${payload.breedName}" is available from ${payload.breederName}.`,
      avatar: payload.breederAvatar,
      data: {
        litterId: payload.litterId,
        breederId: payload.breederId,
      },
    };
  });

  // Send push notification
  await step.push('push-seeker', async () => {
    return {
      subject: 'Breed Match Alert',
      body: `Check out the new "${payload.breedName}" litter from ${payload.breederName}!`,
      data: {
        litterId: payload.litterId,
      },
    };
  });

  // Send email
  await step.email('email-seeker', async () => {
    return {
      subject: 'New Breed Match on Pethouse',
      body: `Hi ${payload.seekerName},\n\nGreat news! A new litter for "${payload.breedName}" is now available from verified breeder ${payload.breederName}.\n\nView details: [link to litter]\n\nHappy adopting!\nPethouse Team`,
    };
  });
}, {
  payloadSchema: z.object({
    seekerId: z.string(),
    seekerName: z.string(),
    breederId: z.string(),
    breederName: z.string(),
    breederAvatar: z.string().optional(),
    breedName: z.string(),
    litterId: z.string(),
  }),
});