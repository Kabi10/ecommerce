import Stripe from 'stripe'

// Create a mock Stripe implementation for environments without API keys
const createMockStripeClient = () => {
  console.warn('STRIPE_SECRET_KEY is not set, using mock Stripe client')
  
  return {
    paymentIntents: {
      create: async (options: any) => {
        console.log('Mock payment intent created:', options)
        return {
          id: 'mock_payment_intent_id',
          client_secret: 'mock_client_secret',
          amount: options.amount,
          currency: options.currency,
          status: 'succeeded',
        }
      },
    },
    checkout: {
      sessions: {
        create: async (options: any) => {
          console.log('Mock checkout session created:', options)
          return {
            id: 'mock_session_id',
            url: 'https://mock-checkout-url.com',
          }
        },
      },
    },
    webhooks: {
      constructEvent: (payload: string, signature: string, secret: string) => {
        console.log('Mock webhook event constructed')
        return {
          id: 'mock_event_id',
          type: 'mock.event',
          data: { object: {} },
        }
      },
    },
  } as unknown as Stripe
}

// Use the real Stripe client if API key is available, otherwise use mock
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    })
  : createMockStripeClient()

export const CURRENCY = 'usd'

export function formatAmountForStripe(
  amount: number,
  currency: string
): number {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })
  const parts = numberFormat.formatToParts(amount)
  let zeroDecimalCurrency = true
  for (const part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100)
}

export function formatAmountFromStripe(
  amount: number,
  currency: string
): number {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })
  const parts = numberFormat.formatToParts(amount)
  let zeroDecimalCurrency = true
  for (const part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false
    }
  }
  return zeroDecimalCurrency ? amount : amount / 100
} 