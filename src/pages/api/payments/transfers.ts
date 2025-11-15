import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'lib/supabase/client';
import * as https from 'https';
import { config } from 'dotenv';
config({ path: '.env.local' });

interface TransferParams {
  source: 'balance';
  amount: number;
  recipient: string;
  reference?: string;
  reason?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const transferData: TransferParams = req.body;

    // Validate required fields
    if (!transferData.source || !transferData.amount || !transferData.recipient) {
      return res.status(400).json({
        error: 'Missing required fields: source, amount, recipient'
      });
    }

    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Call Paystack API directly to initiate transfer
    const paystackResponse = await new Promise<any>((resolve, reject) => {
      const postData = JSON.stringify(transferData);

      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transfer',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
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

      req.write(postData);
      req.end();
    });

    res.status(200).json({
      success: true,
      data: paystackResponse.data,
    });

  } catch (error) {
    console.error('Initiate transfer API error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
