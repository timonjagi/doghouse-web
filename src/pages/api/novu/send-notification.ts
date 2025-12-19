import { NextApiRequest, NextApiResponse } from 'next';
import { Novu } from '@novu/api';
import { supabase } from '../../../lib/supabase/client';

const novu = new Novu({ secretKey: process.env.NOVU_API_KEY! });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { dbPayload, novuPayload } = req.body;

  try {
    // Insert into database
    const { data, error } = await supabase.from('notifications').insert({
      user_id: dbPayload.userId,
      type: dbPayload.type,
      title: dbPayload.title,
      body: dbPayload.body,
      target_type: dbPayload.targetType,
      target_id: dbPayload.targetId,
      meta: dbPayload.meta,
    }).select('id').single();

    if (error) {
      throw error;
    }

    const dbNotificationId = data.id;

    // Trigger Novu workflow if provided
    if (novuPayload && dbNotificationId) {
      novuPayload.payload.dbNotificationId = dbNotificationId;
      await novu.trigger(novuPayload);
    }

    res.status(200).json({ success: true, notificationId: dbNotificationId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
