import { NextApiRequest, NextApiResponse } from 'next';
import { config } from 'dotenv';
import * as crypto from 'crypto';
config({ path: '.env.local' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { payload, signature } = req.body;

    // Validate required fields
    if (!payload || !signature) {
      return res.status(400).json({
        error: 'Missing required fields: payload, signature'
      });
    }

    // Get Paystack secret key
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return res.status(500).json({ error: 'Paystack secret key not configured' });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha512', secretKey)
      .update(payload)
      .digest('hex');

    const isValid = signature === expectedSignature;

    res.status(200).json({
      success: true,
      valid: isValid,
    });

  } catch (error) {
    console.error('Webhook verification API error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
