import { workflow } from '@novu/framework';
import { z } from 'zod';

export const breederApplicationSubmitted = workflow('breeder-application-submitted', async ({ step, payload }: { step: any; payload: any }) => {
  // Notify admin via in-app
  await step.inApp('admin-notification', async () => {
    return {
      subject: 'New Breeder Application',
      body: `${payload.breederName} has submitted a breeder verification application.`,
      data: {
        breederId: payload.breederId,
      },
    };
  });

  // Notify admin via email
  await step.email('admin-email', async () => {
    return {
      subject: 'New Breeder Application Submitted',
      body: `A new breeder application has been submitted by ${payload.breederName} (${payload.email}).\n\nPlease review and verify their documents.\n\nLogin to the admin dashboard to approve or reject.`,
    };
  });

  // Confirm to breeder
  await step.inApp('breeder-confirmation', async () => {
    return {
      subject: 'Application Submitted',
      body: 'Your breeder application has been submitted. We will review it and get back to you soon.',
      data: {},
    };
  });
}, {
  payloadSchema: z.object({
    breederId: z.string(),
    breederName: z.string(),
    email: z.string(),
  }),
});