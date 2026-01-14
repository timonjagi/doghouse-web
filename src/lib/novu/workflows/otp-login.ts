import { workflow } from '@novu/framework';
import { z } from 'zod';

export const otpLogin = workflow('otp-login', async ({ step, payload }: { step: any; payload: any }) => {
  // Send OTP via SMS
  await step.sms('otp-sms', async () => {
    return {
      body: `Your Pethouse verification code is: ${payload.otp}\n\nThis code expires in 10 minutes.`,
    };
  });

  // Send OTP via email as backup
  await step.email('otp-email', async () => {
    return {
      subject: 'Your Pethouse Verification Code',
      body: `Hi,\n\nYour verification code is: ${payload.otp}\n\nEnter this code to complete your login.\n\nThis code expires in 10 minutes.\n\nBest regards,\nThe Pethouse Team`,
    };
  });
}, {
  payloadSchema: z.object({
    userId: z.string(),
    phone: z.string(),
    email: z.string(),
    otp: z.string(),
  }),
});