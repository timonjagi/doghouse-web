import { workflow } from '@novu/framework';
import { z } from 'zod';
import { createNewUserSignupEmail } from '../emailTemplates';

export const newUserSignup = workflow('new-user-signup', async ({ step, payload }: { step: any; payload: any }) => {
  // Notify admin of new user
  await step.inApp('notify-admin', async () => {
    return {
      subject: 'New User Signup',
      body: `${payload.firstName} (${payload.email}) signed up as a ${payload.role}.`,
      data: {
        userId: payload.userId,
        role: payload.role,
      },
    };
  });

  // Send email to admin
  await step.email('email-admin', async () => {
    return {
      subject: 'New User Registration',
      body: createNewUserSignupEmail(
        payload.firstName,
        payload.email,
        payload.role
      ),
    };
  });
}, {
  payloadSchema: z.object({
    userId: z.string(),
    firstName: z.string(),
    email: z.string(),
    role: z.string(),
  }),
});
