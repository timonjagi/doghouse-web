import { NextApiRequest, NextApiResponse } from 'next';
import * as https from 'https';
import { config } from 'dotenv';
config({ path: '.env.local' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { reference } = req.query;

    if (!reference || typeof reference !== 'string') {
      return res.status(400).json({ error: 'Payment reference is required' });
    }

    // Verify payment with Paystack - all business logic handled client-side
    const paystackResponse = await new Promise<any>((resolve, reject) => {
      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: `/transaction/verify/${reference}`,
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

    // Return Paystack verification result - all updates handled client-side
    if (paystackResponse.status && paystackResponse.data.status === 'success') {
      return res.status(200).json({
        status: 'completed',
        reference: paystackResponse.data.reference,
        amount: paystackResponse.data.amount / 100, // Convert from kobo
        paid_at: paystackResponse.data.paid_at,
        channel: paystackResponse.data.channel,
        currency: paystackResponse.data.currency,
        created_at: paystackResponse.data.created_at,
      });
    } else {
      return res.status(200).json({
        status: 'pending',
        reference: paystackResponse.data.reference,
        amount: paystackResponse.data.amount / 100,
        created_at: paystackResponse.data.created_at,
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
