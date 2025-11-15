import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'lib/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user transactions
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .or(`seeker_id.eq.${user.id},breeder_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch transactions:', error);
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }

    res.status(200).json({
      success: true,
      data: transactions || [],
    });

  } catch (error) {
    console.error('Transactions API error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
