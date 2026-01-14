import { NextApiRequest, NextApiResponse } from 'next';
import novu from 'lib/novu/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { subscriberId, email, firstName, lastName, phone, data } = req.body;

  try {
    // Create or update subscriber
    await novu.subscribers.create({
      subscriberId,
      email: email || `${subscriberId}@placeholder.com`,
      firstName,
      lastName,
      phone,
      data,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
