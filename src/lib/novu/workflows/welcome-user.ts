import { workflow } from '@novu/framework';
import { z } from 'zod';
import { createWelcomeEmail } from '../../emailTemplates';

export const welcomeUser = workflow('welcome-user', async ({ step, payload }) => {
  // Send welcome email
  await step.email('welcome-email', async () => {
    return {
      subject: 'Welcome to Pethouse!',
      body: createWelcomeEmail(payload.firstName),
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

  // Send push welcome
  await step.push('welcome-push', async () => {
    return {
      subject: 'Welcome to Pethouse!',
      body: `Hi ${payload.firstName}, welcome to Pethouse! Start exploring amazing pets today.`,
      data: {
        userId: payload.userId,
      },
    };
  });
}, {
  payloadSchema: z.object({
    userId: z.string(),
    firstName: z.string(),
    email: z.string(),
  }),
});
