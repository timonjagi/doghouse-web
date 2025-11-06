/**
 * DEPRECATED: Paystack API integration moved to API routes
 *
 * All Paystack functionality has been moved to server-side API routes:
 * - /api/payments/initialize - Transaction initialization
 * - /api/payments/verify/[reference] - Transaction verification
 * - /api/payments/list - List transactions
 * - /api/payments/[id] - Get transaction details
 * - /api/payments/recipients - Create transfer recipients
 * - /api/payments/transfers - Initiate transfers
 * - /api/payments/webhooks/verify - Verify webhook signatures
 *
 * This file is kept for reference but should not be used.
 */
import { config } from 'dotenv';
import * as https from 'https';
config({ path: '.env.local' }); // or .env.local

export interface PaystackConfig {
  secretKey: string;
  publicKey: string;
  baseUrl: string;
}

export interface InitializeTransactionParams {
  amount: number; // Amount in kobo (multiply Naira by 100)
  email: string;
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
}

export interface InitializeTransactionResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface VerifyTransactionResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    reference: string;
    amount: number;
    currency: string;
    status: 'success' | 'failed' | 'abandoned';
    paid_at: string;
    created_at: string;
    channel: string;
    customer: {
      id: number;
      email: string;
    };
    metadata?: Record<string, any>;
  };
}

export class PaystackAPI {
  private config: PaystackConfig;

  constructor() {
    this.config = {
      secretKey: process.env.PAYSTACK_SECRET_KEY || '',
      publicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
      baseUrl: 'https://api.paystack.co',
    };

    if (!this.config.secretKey) {
      throw new Error('PAYSTACK_SECRET_KEY environment variable is required');
    } else {
      console.log('Paystack Secret Key: ', process.env.PAYSTACK_SECRET_KEY)
      console.log('Paystack Public Key: ', process.env.PAYSTACK_PUBLIC_KEY)
    }
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' = 'GET', data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const postData = data ? JSON.stringify(data) : '';

      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: endpoint,
        method: method,
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`,
          'Content-Type': 'application/json',
        },
      };

      if (method === 'POST' && postData) {
        options.headers['Content-Length'] = Buffer.byteLength(postData);
      }

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

      if (method === 'POST' && postData) {
        req.write(postData);
      }

      req.end();
    });
  }

  /**
   * Initialize a transaction
   */
  async initializeTransaction(params: InitializeTransactionParams): Promise<InitializeTransactionResponse> {
    // Convert amount to kobo (smallest currency unit)
    const amountInKobo = Math.round(params.amount * 100);

    const payload = {
      amount: amountInKobo,
      email: params.email,
      reference: params.reference,
      callback_url: params.callback_url,
      metadata: params.metadata,
    };

    return this.makeRequest('/transaction/initialize', 'POST', payload);
  }

  /**
   * Verify a transaction
   */
  async verifyTransaction(reference: string): Promise<VerifyTransactionResponse> {
    return this.makeRequest(`/transaction/verify/${reference}`);
  }

  /**
   * List transactions with optional filters
   */
  async listTransactions(params: {
    reference?: string;
    status?: string;
    from?: string;
    to?: string;
    page?: number;
    perPage?: number;
  } = {}) {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/transaction${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest(endpoint);
  }

  /**
   * Get transaction details
   */
  async getTransaction(id: number) {
    return this.makeRequest(`/transaction/${id}`);
  }

  /**
   * Create a transfer recipient
   */
  async createTransferRecipient(params: {
    type: 'nuban' | 'mobile_money' | 'basa';
    name: string;
    account_number: string;
    bank_code?: string;
    currency?: string;
    mobile_money?: {
      phone: string;
      provider: 'mtn' | 'airtel' | 'tigo' | 'vodafone';
    };
  }) {
    return this.makeRequest('/transferrecipient', 'POST', params);
  }

  /**
   * Initiate a transfer
   */
  async initiateTransfer(params: {
    source: 'balance';
    amount: number;
    recipient: string;
    reference?: string;
    reason?: string;
  }) {
    return this.makeRequest('/transfer', 'POST', params);
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha512', this.config.secretKey)
      .update(payload)
      .digest('hex');

    return signature === expectedSignature;
  }
}

// Export singleton instance
export const paystack = new PaystackAPI();
