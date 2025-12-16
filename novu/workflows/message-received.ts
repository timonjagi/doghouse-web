import { workflow } from '@novu/framework';
import { z } from 'zod';

export const messageReceived = workflow('message-received', async ({ step, payload }) => {
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
