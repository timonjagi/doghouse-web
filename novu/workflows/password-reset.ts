import { workflow } from '@novu/framework';
import { z } from 'zod';

export const passwordReset = workflow('password-reset', async ({ step, payload }) => {
  // Send password reset email
  await step.email('reset-email', async () => {
    return {
      subject: 'Reset Your Password - Pethouse',
      body: `Hi ${payload.firstName},\n\nYou requested a password reset. Click the link below to set a new password:\n\n${payload.resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe Pethouse Team`,
    };
  });
}, {
  payloadSchema: z.object({
    userId: z.string(),
    firstName: z.string(),
    email: z.string(),
    resetUrl: z.string(),
  }),
});