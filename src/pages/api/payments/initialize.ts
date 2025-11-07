import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'lib/supabase/client';
import * as https from 'https';
import { config } from 'dotenv';
config({ path: '.env.local' });
import { v4 as uuidv4 } from 'uuid';

interface PaymentInitParams {
  amount: number;
  type: 'reservation' | 'final';
  applicationId: string;
  description: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, type, applicationId, description, listingId, breederId, seekerEmail } = req.body;

    // Validate required fields for Paystack
    if (!amount || !type || !applicationId || !listingId || !breederId || !seekerEmail) {
      return res.status(400).json({
        error: 'Missing required fields for payment processing'
      });
    }

    // Generate unique reference
    const reference = `doghouse_${type}_${applicationId}_${uuidv4().slice(0, 8)}`;

    // Initialize Paystack transaction directly - all validation done client-side
    const paystackResponse = await new Promise<any>((resolve, reject) => {
      const postData = JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        email: seekerEmail,
        reference,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/applications/${applicationId}?payment=success`,
        metadata: {
          application_id: applicationId,
          listing_id: listingId,
          payment_type: type,
          seeker_id: 'validated-client-side',
          breeder_id: breederId,
          custom_description: description,
        },
      });

      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
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

    if (!paystackResponse.status) {
      return res.status(400).json({
        error: 'Failed to initialize payment',
        details: paystackResponse.message
      });
    }

    // Return Paystack response - all validation and transaction creation done client-side
    res.status(200).json({
      success: true,
      data: {
        authorization_url: paystackResponse.data.authorization_url,
        reference: paystackResponse.data.reference,
      },
    });

  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
