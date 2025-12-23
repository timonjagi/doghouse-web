import { workflow } from '@novu/framework';
import { z } from 'zod';
import { createProfessionalEmailTemplate } from '../../emailTemplates';

export const breederActivityBroadcast = workflow('breeder-activity-broadcast', async ({ step, payload }) => {
  // Send in-app notification to breeder subscribers
  await step.inApp('activity-notification', async () => {
    return {
      subject: payload.title,
      body: payload.message,
      data: {
        breederId: payload.breederId,
        activityType: payload.activityType,
        activityId: payload.activityId,
        activityTitle: payload.activityTitle,
      },
    };
  });

  // Send push notification to breeder subscribers
  await step.push('activity-push', async () => {
    return {
      subject: payload.title,
      body: payload.message.substring(0, 100) || 'New breeder activity',
      data: {
        breederId: payload.breederId,
        activityType: payload.activityType,
        activityId: payload.activityId,
      },
    };
  });

  // Send email to breeder subscribers
  await step.email('activity-email', async () => {
    return {
      subject: payload.title,
      body: createProfessionalEmailTemplate({
        title: payload.title,
        greeting: 'Hello!',
        content: payload.message,
        details: payload.activityId ? [{
          label: 'Activity',
          value: payload.activityTitle
        }] : undefined,
        footerContent: `Stay updated with ${payload.breederName}'s latest activities.`,
      }),
    };
  });
}, {
  payloadSchema: z.object({
    breederId: z.string(),
    breederName: z.string(),
    activityType: z.enum(['listing', 'breed']),
    activityId: z.string(),
    activityTitle: z.string(),
    title: z.string(),
    message: z.string(),
  }),
});
