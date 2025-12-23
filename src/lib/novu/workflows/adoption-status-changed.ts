import { workflow } from '@novu/framework';
import { z } from 'zod';
import { createProfessionalEmailTemplate } from '../../emailTemplates';

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

  // Send push notification to seeker
  await step.push('push-seeker', async () => {
    return {
      subject: payload.title,
      body: payload.body?.substring(0, 100) || 'Your adoption status has been updated',
      data: {
        adoptionId: payload.adoptionId,
        status: payload.status,
      },
    };
  });

  // Send email to seeker
  await step.email('email-seeker', async () => {
    return {
      subject: payload.title,
      body: createAdoptionStatusEmail(
        payload.seekerName,
        payload.title,
        payload.body,
        payload.adoptionId,
        payload.listingTitle,
        payload.status
      ),
    };
  });

  // If approved, notify breeder
  if (payload.status === 'approved') {
    await step.inApp('notify-breeder-approved', async () => {
      return {
        subject: 'Adoption Approved',
        body: `The adoption application for "${payload.listingTitle}" has been approved.`,
        data: {
          adoptionId: payload.adoptionId,
          listingId: payload.listingId,
        },
      };
    });

    await step.push('push-breeder-approved', async () => {
      return {
        subject: 'Adoption Approved',
        body: `Your listing "${payload.listingTitle}" has been approved for adoption!`,
        data: {
          adoptionId: payload.adoptionId,
          listingId: payload.listingId,
        },
      };
    });
  }

  // If completed, notify breeder
  if (payload.status === 'completed') {
    await step.inApp('notify-breeder-completed', async () => {
      return {
        subject: 'Adoption Completed',
        body: `The adoption for "${payload.listingTitle}" has been completed successfully.`,
        data: {
          adoptionId: payload.adoptionId,
          listingId: payload.listingId,
        },
      };
    });

    await step.push('push-breeder-completed', async () => {
      return {
        subject: 'Adoption Completed',
        body: `The adoption for "${payload.listingTitle}" is now complete!`,
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
