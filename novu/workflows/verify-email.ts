import { workflow } from '@novu/framework';
import { z } from 'zod';

export const verifyEmail = workflow('verify-email', async ({ step, payload }) => {
  // Send verification email
  await step.email('verification-email', async () => {
    return {
      subject: 'Verify Your Email - Pethouse',
      body: `Hi ${payload.firstName},\n\nPlease verify your email address by clicking the link below:\n\n${payload.verificationUrl}\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account, please ignore this email.\n\nBest regards,\nThe Pethouse Team`,
    };
  });
}, {
  payloadSchema: z.object({
    userId: z.string(),
    firstName: z.string(),
    email: z.string(),
    verificationUrl: z.string(),
  }),
});