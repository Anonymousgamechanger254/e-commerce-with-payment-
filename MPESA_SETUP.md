# M-Pesa Integration Setup Guide

## Overview
This guide explains how to set up M-Pesa payment integration for the LuxeStore ecommerce platform using the Safaricom Daraja API.

## Features Implemented

✅ **Direct STK Push**: Sends M-Pesa PIN prompt directly to your phone
✅ **Custom Payment Messages**: Customize the text shown in the M-Pesa popup
✅ **One-Click Payment**: Skip confirmation screens, go straight to PIN entry
✅ **No Intermediate Steps**: Just click → Check phone → Enter PIN → Done
✅ **Phone Auto-fill**: Your phone number is pre-configured
✅ **Production Ready**: Easy transition from sandbox to production

## Understanding the Flow

### What Users Experience:
```
1. Click "Pay with M-Pesa" button
2. Website shows: "Sending to your phone..."
3. Phone buzzes with M-Pesa popup
4. Popup shows: "Hey [name], pay [amount] to [business]"
5. User enters PIN
6. Payment complete ✓
```

### What You Control:
```
Message shown on M-Pesa popup (up to 25 characters):
- Default: "Pay KSh 2500 - Product Name"
- Custom: "Hey Nick, pay 2500"
- Custom: "Complete your order"
- Custom: Anything you want!
```

## Getting M-Pesa API Credentials

### Step 1: Register on Safaricom Developer Portal

1. Go to: https://developer.safaricom.co.ke/
2. Sign up for a new account
3. Email verification

### Step 2: Create an App

1. Log in to your dashboard
2. Go to "My Apps" → "Create New App"
3. Choose "Lipa Na M-Pesa Online"
4. Fill in app details

### Step 3: Get Your Credentials

After creating your app, you'll get:
- **Consumer Key** - Your app's public identifier
- **Consumer Secret** - Your app's private key (keep secret!)
- **Shortcode** - Your business shortcode or till number
- **Passkey** - Your M-Pesa online API passkey

For **Sandbox (Testing)**:
- Shortcode: 174379
- Passkey: bfb279f9aa9bdbcf158e97dd1a503b06
- These are pre-provided by Safaricom

### Step 4: Register Your Business

To receive real payments, you need:
- **Till Number** - For direct till payments
  - Apply through: Safaricom M-Pesa Business
  - Fast approval process

- OR **Paybill Number** - For account-based payments
  - Ask your acquiring bank
  - Links to your business account

## Environment Variables Setup

Create a `.env.local` file in your project root:

```env
# M-Pesa API Credentials
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd1a503b06
MPESA_PHONE=254712345678

# Environment: sandbox or production
MPESA_ENV=sandbox

# Your callback URL (for webhooks)
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
```

## Running in Sandbox (Testing)

### 1. Install Dependencies

```bash
npm install axios dotenv
```

### 2. Update Environment Variables

```env
MPESA_ENV=sandbox
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd1a503b06
MPESA_PHONE=254712345678  # Your test phone number
```

### 3. Start Dev Server

```bash
npm run dev
```

### 4. Test Payment

1. Navigate to product
2. Add to cart
3. Click "Proceed to Checkout"
4. Enter amount
5. Click "Quick Pay"
6. Check your phone for M-Pesa prompt (simulated in sandbox)

## Custom Payment Messages

### Usage

The payment modal lets you customize the M-Pesa prompt:

```javascript
// Default message
"Pay KSh 2500"

// Custom messages (max 25 characters)
"Hey Nick, pay 2500"
"Complete your order"
"Confirm purchase now"
"Quick payment"
```

### Character Limit

The `TransactionDesc` field has a **25 character limit**. Examples:

✅ Valid (will display):
- "Nick pay 2500"
- "Complete order now"
- "Confirm purchase"

❌ Too long (might truncate):
- "Hey Nick, are you sure you want to pay 2500?" (46 chars)

### Recommended Messages

```javascript
const messages = {
  quick_purchase: "Quick payment",
  order: "Confirm your order",
  subscription: "Activate premium",
  donation: "Thank you!",
  custom: "Your custom message"
}
```

## Going Live (Production)

### Prerequisites

1. **Business Registration**: Register with Safaricom for M-Pesa Business
2. **Bank Account**: Link your business bank account
3. **SSL Certificate**: Your domain must have HTTPS
4. **Callback URL**: Set up webhook handler for payment confirmations

### Update Configuration

```env
# Switch to production
MPESA_ENV=production

# Use YOUR credentials
MPESA_CONSUMER_KEY=your_production_key
MPESA_CONSUMER_SECRET=your_production_secret
MPESA_SHORTCODE=YOUR_BUSINESS_TILL  # e.g., 5123456 or 247247
MPESA_PASSKEY=your_production_passkey

# Your actual phone number
MPESA_PHONE=254712345678

# Your production callback URL
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
```

### Update API Endpoint

In `src/app/api/mpesa/route.ts`, the code will automatically use production URLs when `MPESA_ENV=production`.

## Money Flow in Your Setup

### Sandbox (Testing - No Real Money):
```
Your Phone → PIN Popup → No money actually moves → Test complete
```

### Production (Real Money):
```
Your Personal M-Pesa Account
         ↓ (you pay)
    Your Till Number / Paybill Number
         ↓ (money arrives)
    Your Business Account
```

You're essentially paying yourself - money moves from your personal M-Pesa to your business account.

## Webhook/Callback Setup

### What It Does

After payment, Safaricom sends a callback to confirm payment status:

```json
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "...",
      "CheckoutRequestID": "...",
      "ResultCode": 0,
      "ResultDesc": "The service request has been processed successfully.",
      "CallbackMetadata": {
        "Item": [
          {"Name": "Amount", "Value": 2500},
          {"Name": "MpesaReceiptNumber", "Value": "LHD7414A59P"},
          {"Name": "TransactionDate", "Value": 20231201093600},
          {"Name": "PhoneNumber", "Value": 254712345678}
        ]
      }
    }
  }
}
```

### Implementing Callback

Create `src/app/api/mpesa/callback/route.ts`:

```typescript
export async function POST(request: NextRequest) {
  const data = await request.json();
  const { Body } = data;
  
  const resultCode = Body.stkCallback.ResultCode;
  const checkoutId = Body.stkCallback.CheckoutRequestID;
  
  if (resultCode === 0) {
    // Payment successful!
    // Update your database, send confirmation email, etc.
    console.log('Payment successful:', checkoutId);
  } else {
    // Payment failed
    console.log('Payment failed:', Body.stkCallback.ResultDesc);
  }
  
  return NextResponse.json({ success: true });
}
```

## Testing Checklist

- [ ] Environment variables configured
- [ ] Dev server running (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Add product to cart
- [ ] Click checkout
- [ ] Enter amount
- [ ] See payment modal
- [ ] Custom message appears
- [ ] Can enter custom message
- [ ] "Quick Pay" button visible
- [ ] Payment processed successfully

## Troubleshooting

### "Invalid Consumer Key/Secret"
- Check environment variables in `.env.local`
- Ensure no extra spaces or quotes
- Restart dev server after changes

### "Shortcode not registered"
- Verify MPESA_SHORTCODE is correct
- In sandbox, use: 174379
- In production, use your actual till/paybill

### "Payment not processing"
- Check network tab for API errors
- Verify callback URL is reachable
- Ensure HTTPS in production

### "Custom message not appearing"
- Keep message under 25 characters
- Remove special characters (except spaces)
- Use clear, simple text

## Security Best Practices

1. **Never commit credentials**: Use `.env.local` (in .gitignore)
2. **HTTPS Only**: Always use SSL/TLS in production
3. **Validate Input**: Validate amount and phone before sending
4. **Rate Limiting**: Prevent payment spam with rate limiting
5. **Error Handling**: Don't expose sensitive errors to users

## API Reference

### Endpoint: POST /api/mpesa/stk-push

**Request:**
```json
{
  "amount": 2500,
  "phone_number": "254712345678",
  "custom_message": "Pay for your order",
  "account_reference": "ORDER-12345"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "M-Pesa PIN prompt sent to your phone",
  "checkout_id": "...",
  "ResponseCode": "0"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error description here"
}
```

## Support & Resources

- Safaricom Docs: https://developer.safaricom.co.ke/
- M-Pesa API Docs: https://developer.safaricom.co.ke/lipa-na-mpesa-online/apis
- Test Credentials: https://developer.safaricom.co.ke/sandbox

## File Structure

```
ecommerce/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── mpesa/
│   │   │       ├── route.ts          # STK Push endpoint
│   │   │       └── callback/
│   │   │           └── route.ts      # Callback handler
│   │   └── page.tsx                  # Main page
│   ├── components/
│   │   └── MPesaPaymentModal.tsx     # Payment UI
│   └── data/
│       └── products.ts
├── .env.local                        # Your credentials (DON'T COMMIT!)
├── .env.example                      # Template for credentials
└── README.md
```

## Next Steps

1. Sign up on Safaricom Developer Portal
2. Create an app and get credentials
3. Add credentials to `.env.local`
4. Test in sandbox mode
5. Register your business for production
6. Update credentials to production
7. Deploy with HTTPS enabled

---

**Congratulations!** You now have a complete M-Pesa payment system with:
- ✅ Direct STK Push (PIN popup)
- ✅ Custom payment messages
- ✅ One-click checkout
- ✅ Minimal user friction
- ✅ Production-ready code

Happy selling! 🎉
