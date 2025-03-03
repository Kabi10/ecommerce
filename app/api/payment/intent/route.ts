import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { items, addressId } = body

    if (!items?.length || !addressId) {
      return new NextResponse('Bad request', { status: 400 })
    }

    // Calculate total
    const total = items.reduce(
      (acc: number, item: { price: number; quantity: number }) =>
        acc + item.price * item.quantity,
      0
    )

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: session.user.id,
        addressId,
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('[PAYMENT_INTENT_ERROR]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 