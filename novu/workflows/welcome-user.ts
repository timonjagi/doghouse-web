import { workflow } from '@novu/framework';
import { z } from 'zod';

export const welcomeUser = workflow('welcome-user', async ({ step, payload }) => {
  // Send welcome email
  await step.email('welcome-email', async () => {
    return {
      subject: 'Welcome to Pethouse!',
      body: `Hi ${payload.firstName},\n\nWelcome to Pethouse! We're excited to have you join our community of verified breeders and responsible pet seekers.\n\nGet started by exploring available litters or listing your own.\n\nBest regards,\nThe Pethouse Team`,
    };
  });

  // Send in-app welcome
  await step.inApp('welcome-notification', async () => {
    return {
      subject: 'Welcome to Pethouse!',
      body: 'Your account has been created successfully. Start exploring!',
      data: {},
    };
  });
}, {
  payloadSchema: z.object({
    userId: z.string(),
    firstName: z.string(),
    email: z.string(),
  }),
});