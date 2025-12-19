import { NextApiRequest, NextApiResponse } from 'next';
import { Novu } from '@novu/api';
import { supabase } from '../../../lib/supabase/client';

const novu = new Novu({ secretKey: process.env.NOVU_API_KEY! });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { notifications } = req.body;

  try {
    const results = [];

    for (const notification of notifications) {
      const { db, novu: novuPayload } = notification;

      // Insert into database
      const { data, error } = await supabase.from('notifications').insert({
        user_id: db.userId,
        type: db.type,
        title: db.title,
        body: db.body,
        target_type: db.targetType,
        target_id: db.targetId,
        meta: db.meta,
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

      results.push({ success: true, notificationId: dbNotificationId });
    }

    res.status(200).json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
