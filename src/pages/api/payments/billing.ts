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

    // Get payments made (as seeker)
    const { data: payments, error: paymentsError } = await supabase
      .from('transactions')
      .select(`
        *,
        applications (
          listings (
            title,
            owner_id
          )
        )
      `)
      .eq('seeker_id', user.id)
      .order('created_at', { ascending: false });

    if (paymentsError) {
      console.error('Failed to fetch payments:', paymentsError);
      return res.status(500).json({ error: 'Failed to fetch payment history' });
    }

    // Get earnings received (as breeder)
    const { data: earnings, error: earningsError } = await supabase
      .from('transactions')
      .select(`
        *,
        applications (
          listings (
            title
          )
        )
      `)
      .eq('breeder_id', user.id)
      .order('created_at', { ascending: false });

    if (earningsError) {
      console.error('Failed to fetch earnings:', earningsError);
      return res.status(500).json({ error: 'Failed to fetch earnings history' });
    }

    res.status(200).json({
      success: true,
      data: {
        payments: payments || [],
        earnings: earnings || [],
      },
    });

  } catch (error) {
    console.error('Billing API error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
