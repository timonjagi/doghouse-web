import { NextApiRequest, NextApiResponse } from 'next';
import novu from 'lib/novu/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { subscriberId, topicKey, topicName } = req.body;

  try {
    // Subscribe to topic using correct API method
    await novu.topics.subscriptions.create({
      subscriptions: [{
        subscriberId: subscriberId,
        identifier: `${subscriberId}-${topicKey}`,
      }],
      name: topicName,
    }, topicKey);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
