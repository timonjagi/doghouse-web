import { NextApiRequest, NextApiResponse } from 'next';
import { Novu } from '@novu/api';

const novu = new Novu(process.env.NOVU_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { subscriberId, topicKey, topicName } = req.body;

  try {
    // Ensure subscriber exists
    await novu.subscribers.create({
      subscriberId,
      email: `${subscriberId}@placeholder.com`,
    });

    // Subscribe to topic using correct API method
    await novu.topics.subscriptions.create({
      subscriptions: [{ subscriberId }],
      name: topicName,
    }, topicKey);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
