import { workflow } from '@novu/framework';
import { z } from 'zod';
import { createEmailVerificationEmail } from '../emailTemplates';

export const verifyEmail = workflow('verify-email', async ({ step, payload }: { step: any; payload: any }) => {
  // Send verification email
  await step.email('verification-email', async () => {
    return {
      subject: 'Verify Your Email - Pethouse',
      body: createEmailVerificationEmail(payload.firstName, payload.verificationUrl),
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