import { workflow } from '@novu/framework';
import { z } from 'zod';

export const adoptionStatusChanged = workflow('adoption-status-changed', async ({ step, payload }) => {
  // Notify seeker of status change
  await step.inApp('notify-seeker', async () => {
    return {
      subject: payload.title,
      body: payload.body,
      data: {
        adoptionId: payload.adoptionId,
        listingId: payload.listingId,
        status: payload.status,
      },
    };
  });

  // Send email to seeker
  await step.email('email-seeker', async () => {
    return {
      subject: payload.title,
      body: `Hi ${payload.seekerName},\n\n${payload.body}\n\nView details: [link to adoption]\n\nBest regards,\nPethouse Team`,
    };
  });

  // If approved, notify breeder
  if (payload.status === 'approved') {
    await step.inApp('notify-breeder', async () => {
      return {
        subject: 'Adoption Approved',
        body: `The adoption for "${payload.listingTitle}" has been approved.`,
        data: {
          adoptionId: payload.adoptionId,
          listingId: payload.listingId,
        },
      };
    });
  }

  // If completed, notify both
  if (payload.status === 'completed') {
    await step.inApp('notify-breeder', async () => {
      return {
        subject: 'Adoption Completed',
        body: `The adoption for "${payload.listingTitle}" has been completed successfully.`,
        data: {
          adoptionId: payload.adoptionId,
          listingId: payload.listingId,
        },
      };
    });
  }
}, {
  payloadSchema: z.object({
    adoptionId: z.string(),
    listingId: z.string(),
    listingTitle: z.string(),
    seekerId: z.string(),
    seekerName: z.string(),
    breederId: z.string(),
    status: z.string(),
    title: z.string(),
    body: z.string(),
  }),
});