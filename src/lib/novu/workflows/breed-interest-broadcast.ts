import { workflow } from '@novu/framework';
import { z } from 'zod';
import { createBreedMatchEmail } from '../../src/lib/emailTemplates';

export const breedInterestBroadcast = workflow('breed-interest-broadcast', async ({ step, payload }) => {
  // Send in-app notification to users interested in this breed
  await step.inApp('breed-match-notification', async () => {
    return {
      subject: payload.title,
      body: payload.message,
      data: {
        type: 'breed-match',
        breedId: payload.breedId,
        breedName: payload.breedName,
        listingId: payload.listingId,
        breederId: payload.breederId,
        breederName: payload.breederName,
      },
    };
  });

  // Send push notification to users interested in this breed
  await step.push('breed-match-push', async () => {
    return {
      subject: `New ${payload.breedName} Available!`,
      body: `Check out this new ${payload.breedName} listing from ${payload.breederName}`,
      data: {
        type: 'breed-match',
        breedId: payload.breedId,
        listingId: payload.listingId,
      },
    };
  });

  // Send email to users interested in this breed
  await step.email('breed-match-email', async () => {
    return {
      subject: payload.title,
      body: createBreedMatchEmail(
        payload.userName,
        payload.breedName,
        payload.breederName
      ),
    };
  });
}, {
  payloadSchema: z.object({
    title: z.string(),
    message: z.string(),
    breedId: z.string(),
    breedName: z.string(),
    listingId: z.string(),
    breederId: z.string(),
    breederName: z.string(),
    userName: z.string().optional(),
  }),
});
