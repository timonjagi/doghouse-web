import { NextApiRequest, NextApiResponse } from 'next';
import novu from 'lib/novu/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { subscriberId, topicKey } = req.body;

  try {
    // Unsubscribe from topic using correct API method
    await novu.topics.subscriptions.delete({
      subscriptions: [{ subscriberId }],
    }, topicKey);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
