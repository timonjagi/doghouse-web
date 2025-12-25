import { workflow } from '@novu/framework';
import { z } from 'zod';
import { createMessageReceivedEmail } from '../emailTemplates';

export const messageReceived = workflow('message-received', async ({ step, payload }: { step: any; payload: any }) => {
  // Send in-app notification to recipient
  await step.inApp('notify-recipient', async () => {
    return {
      subject: `Message from ${payload.senderName}`,
      body: payload.messageContent,
      avatar: payload.senderAvatar,
      data: {
        conversationId: payload.conversationId,
        senderId: payload.senderId,
        senderName: payload.senderName,
        messageId: payload.messageId,
        contextType: payload.contextType,
        contextId: payload.contextId,
      },
    };
  });

  // Send push notification to recipient
  await step.push('push-recipient', async () => {
    return {
      subject: `New message from ${payload.senderName}`,
      body: payload.messageContent?.substring(0, 100) || 'New message received',
      data: {
        conversationId: payload.conversationId,
        messageId: payload.messageId,
      },
    };
  });

  // Send email notification to recipient
  await step.email('email-recipient', async () => {
    return {
      subject: `New Message from ${payload.senderName}`,
      body: createMessageReceivedEmail(
        payload.senderName,
        payload.messageContent,
        payload.conversationTitle
      ),
    };
  });
}, {
  payloadSchema: z.object({
    conversationId: z.string(),
    conversationTitle: z.string(),
    senderId: z.string(),
    senderName: z.string(),
    senderAvatar: z.string().optional(),
    messageContent: z.string(),
    messageId: z.string(),
    contextType: z.string().optional(),
    contextId: z.string().optional(),
  }),
});
