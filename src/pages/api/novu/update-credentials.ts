import { NextApiRequest, NextApiResponse } from 'next';
import novu from 'lib/novu/client';
import { ChatOrPushProviderEnum } from '@novu/api/models/components';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { subscriberId, deviceToken } = req.body;

  if (!subscriberId || !deviceToken) {
    return res.status(400).json({ message: 'subscriberId and deviceToken are required' });
  }

  try {
    await novu.subscribers.credentials.update(
      {
        providerId: ChatOrPushProviderEnum.OneSignal,
        credentials: {
          deviceTokens: [deviceToken],
        },
      },
      subscriberId
    );

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error updating Novu credentials:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
