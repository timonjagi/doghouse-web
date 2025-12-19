import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const payload = req.body;

  try {
    const { data, error } = await supabase.from('notifications').insert({
      user_id: payload.userId,
      type: payload.type,
      title: payload.title,
      body: payload.body,
      target_type: payload.targetType,
      target_id: payload.targetId,
      meta: payload.meta,
    }).select('id').single();

    if (error) {
      throw error;
    }

    res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
