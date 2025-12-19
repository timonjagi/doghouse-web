import { NextApiRequest, NextApiResponse } from 'next';
import novu from 'lib/novu';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    workflowId,
    topicKey,
    payload,
    title,
    message,
    options
  } = req.body;

  try {
    // Handle different types of topic notifications
    if (workflowId) {
      // Specific workflow with topic
      await novu.trigger({
        workflowId,
        to: { type: "Topic", topicKey },
        payload,
      });
    } else if (topicKey === 'admin-users') {
      // Admin broadcast
      await novu.trigger({
        workflowId: 'admin-broadcast',
        to: { type: "Topic", topicKey: "admin-users" },
        payload: {
          title,
          message,
          priority: options?.priority || 'normal',
          category: options?.category || 'general',
          actionUrl: options?.actionUrl,
          actionLabel: options?.actionLabel,
          details: options?.details,
          footerContent: options?.footerContent,
        },
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
