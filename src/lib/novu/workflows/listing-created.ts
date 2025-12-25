import { workflow } from '@novu/framework';
import { z } from 'zod';
import { createListingCreatedEmail } from '../emailTemplates';

export const listingCreated = workflow('listing-created', async ({ step, payload }: { step: any; payload: any }) => {
  // Notify admin of new listing
  await step.inApp('notify-admin', async () => {
    return {
      subject: 'New Listing Created',
      body: `${payload.breederName} created a new ${payload.listingType} listing: "${payload.listingTitle}".`,
      data: {
        listingId: payload.listingId,
        breederId: payload.breederId,
      },
    };
  });

  // Optional: Notify breeder of successful creation
  await step.inApp('confirm-breeder', async () => {
    return {
      subject: 'Listing Created Successfully',
      body: `Your ${payload.listingType} listing "${payload.listingTitle}" has been created and is now live.`,
      data: {
        listingId: payload.listingId,
      },
    };
  });

  // Send push notification to breeder
  await step.push('push-breeder', async () => {
    return {
      subject: 'Listing Created Successfully',
      body: `Your ${payload.listingType} "${payload.listingTitle}" is now live and ready for applications!`,
      data: {
        listingId: payload.listingId,
      },
    };
  });

  // Send email to breeder
  await step.email('email-breeder', async () => {
    return {
      subject: 'Listing Created Successfully',
      body: createListingCreatedEmail(
        payload.breederName,
        payload.listingTitle,
        payload.listingType
      ),
    };
  });
}, {
  payloadSchema: z.object({
    listingId: z.string(),
    listingTitle: z.string(),
    listingType: z.string(),
    breederId: z.string(),
    breederName: z.string(),
  }),
});
