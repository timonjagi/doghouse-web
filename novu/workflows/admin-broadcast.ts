import { workflow } from '@novu/framework';
import { z } from 'zod';
import { createProfessionalEmailTemplate } from '../../src/lib/emailTemplates';

export const adminBroadcast = workflow('admin-broadcast', async ({ step, payload }) => {
  // Send in-app notification to all admin users via topic
  await step.inApp('admin-notification', async () => {
    return {
      subject: payload.title,
      body: payload.message,
      data: {
        type: 'admin-broadcast',
        priority: payload.priority || 'normal',
        category: payload.category || 'general',
        actionUrl: payload.actionUrl,
        actionLabel: payload.actionLabel,
      },
    };
  }, {
    to: { type: "Topic", topicKey: "admin-users" }
  });

  // Send push notification to all admin users
  await step.push('admin-push', async () => {
    return {
      subject: payload.title,
      body: payload.message.substring(0, 100) || 'Admin notification',
      data: {
        type: 'admin-broadcast',
        priority: payload.priority || 'normal',
      },
    };
  });

  // Send email to all admin users
  await step.email('admin-email', async () => {
    return {
      subject: payload.title,
      body: createProfessionalEmailTemplate({
        title: payload.title,
        greeting: 'Admin Notification',
        content: payload.message,
        details: payload.details?.map((detail) => ({
          label: detail.label,
          value: detail.value
        })),
        actionButton: payload.actionUrl && payload.actionLabel ? {
          text: payload.actionLabel,
          url: payload.actionUrl
        } : undefined,
        footerContent: payload.footerContent || 'This is an automated admin notification.',
      }),
    };
  });
}, {
  payloadSchema: z.object({
    title: z.string(),
    message: z.string(),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).optional().default('normal'),
    category: z.enum(['general', 'user', 'breeder', 'system', 'security']).optional().default('general'),
    actionUrl: z.string().optional(),
    actionLabel: z.string().optional(),
    details: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).optional(),
    footerContent: z.string().optional(),
  }),
});
