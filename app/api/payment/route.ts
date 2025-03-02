import { NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { stripe, formatAmountForStripe, CURRENCY } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const paymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  orderId: z.string(),
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { amount, orderId } = paymentSchema.parse(body)

    // Verify the order belongs to the user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(amount, CURRENCY),
      currency: CURRENCY,
      metadata: {
        userId: session.user.id,
        orderId: orderId,
      },
    })

    // Create payment record
    await prisma.payment.create({
      data: {
        orderId: orderId,
        amount: amount,
        provider: 'stripe',
        paymentId: paymentIntent.id,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 