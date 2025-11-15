import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'lib/supabase/client';
import * as https from 'https';
import { config } from 'dotenv';
config({ path: '.env.local' });

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

    // Get query parameters
    const {
      reference,
      status,
      from,
      to,
      page = '1',
      perPage = '50'
    } = req.query;

    // Build Paystack API query parameters
    const queryParams = new URLSearchParams();
    if (reference) queryParams.append('reference', reference as string);
    if (status) queryParams.append('status', status as string);
    if (from) queryParams.append('from', from as string);
    if (to) queryParams.append('to', to as string);
    if (page) queryParams.append('page', page as string);
    if (perPage) queryParams.append('perPage', perPage as string);

    const endpoint = `/transaction${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    // Call Paystack API directly
    const paystackResponse = await new Promise<any>((resolve, reject) => {
      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: endpoint,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      };

      const req = https.request(options, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          try {
            const responseData = JSON.parse(body);

            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              resolve(responseData);
            } else {
              reject(new Error(`Paystack API error: ${res.statusCode} - ${responseData.message || 'Unknown error'}`));
            }
          } catch (error) {
            reject(new Error('Failed to parse Paystack API response'));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Paystack API request failed: ${error.message}`));
      });

      req.end();
    });

    res.status(200).json({
      success: true,
      data: paystackResponse.data,
      meta: paystackResponse.meta,
    });

  } catch (error) {
    console.error('List transactions API error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
