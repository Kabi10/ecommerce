import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail } from '@/lib/email'
import Stripe from 'stripe'

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set')
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      // Get the order from metadata
      const order = await prisma.order.findFirst({
        where: {
          payment: {
            paymentId: paymentIntent.id,
          },
        },
        include: {
          payment: true,
          user: true,
          orderItems: {
            include: {
              product: true,
            },
          },
          shippingAddress: true,
        },
      })

      if (!order) {
        console.error('Order not found for payment intent:', paymentIntent.id)
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        )
      }

      // Update order and payment status
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { status: 'PROCESSING' },
        }),
        prisma.payment.update({
          where: { id: order.payment!.id },
          data: { status: 'COMPLETED' },
        }),
      ])

      // Send order confirmation email
      try {
        await sendOrderConfirmationEmail({
          orderNumber: order.id,
          customerName: order.user.name || order.user.email,
          total: Number(order.total),
          items: order.orderItems.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: Number(item.price),
          })),
          shippingAddress: {
            street: order.shippingAddress.street,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            postalCode: order.shippingAddress.postalCode,
            country: order.shippingAddress.country,
          },
        })
      } catch (error) {
        console.error('Error sending order confirmation email:', error)
        // Don't throw error here, as we don't want to affect the order process
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    )
  }
} 