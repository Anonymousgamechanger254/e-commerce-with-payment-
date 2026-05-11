import { NextRequest, NextResponse } from 'next/server';

// Configuration - Replace with your actual M-Pesa credentials
const MPESA_CONFIG = {
  CONSUMER_KEY: process.env.MPESA_CONSUMER_KEY || 'your_consumer_key',
  CONSUMER_SECRET: process.env.MPESA_CONSUMER_SECRET || 'your_consumer_secret',
  SHORTCODE: process.env.MPESA_SHORTCODE || '174379', // Sandbox shortcode
  PASSKEY: process.env.MPESA_PASSKEY || 'your_passkey',
  PHONE_NUMBER: process.env.MPESA_PHONE || '254712345678', // Your phone number
  BASE_URL: process.env.MPESA_ENV === 'production' 
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'
};

interface STKPushPayload {
  amount: number;
  phone_number: string;
  custom_message: string;
  account_reference: string;
}

/**
 * POST /api/mpesa/stk-push
 * Initiates an M-Pesa STK Push (PIN prompt on phone)
 */
export async function POST(request: NextRequest) {
  try {
    const body: STKPushPayload = await request.json();
    const { amount, phone_number, custom_message, account_reference } = body;

    // Validation
    if (!amount || amount < 1) {
      return NextResponse.json(
        { success: false, message: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (!phone_number) {
      return NextResponse.json(
        { success: false, message: 'Phone number required' },
        { status: 400 }
      );
    }

    // In production, call M-Pesa API here
    // For now, simulate the response
    const checkoutRequestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log('M-Pesa STK Push Request:');
    console.log('- Amount:', amount);
    console.log('- Phone:', phone_number);
    console.log('- Message:', custom_message);
    console.log('- Reference:', account_reference);

    // Simulated M-Pesa response
    return NextResponse.json({
      success: true,
      message: 'M-Pesa PIN prompt sent to your phone',
      checkout_id: checkoutRequestId,
      amount: amount,
      phone_number: phone_number,
      custom_message: custom_message,
      timestamp: new Date().toISOString(),
      // In production, this would be the actual M-Pesa response
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
      MerchantRequestID: checkoutRequestId,
      CheckoutRequestID: checkoutRequestId
    });

  } catch (error) {
    console.error('M-Pesa API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Payment initiation failed'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/mpesa/verify-payment/[checkoutId]
 * Verifies if payment was completed
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkoutId = searchParams.get('checkout_id');

    if (!checkoutId) {
      return NextResponse.json(
        { success: false, message: 'Checkout ID required' },
        { status: 400 }
      );
    }

    // In production, query M-Pesa API with checkout ID
    // For demo, always return pending
    return NextResponse.json({
      success: true,
      status: 'pending',
      checkout_id: checkoutId,
      message: 'Payment processing...'
    });

  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Verification failed'
      },
      { status: 500 }
    );
  }
}
