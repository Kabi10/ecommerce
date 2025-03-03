import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"
import { sendOrderConfirmationEmail } from "@/lib/email"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
})

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    )
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      const payment = await prisma.payment.findUnique({
        where: {
          stripeSessionId: session.id,
        },
        include: {
          order: true,
        },
      })

      if (!payment) {
        return NextResponse.json(
          { error: "Payment not found" },
          { status: 404 }
        )
      }

      const order = await prisma.order.update({
        where: {
          id: payment.orderId,
        },
        data: {
          status: "PROCESSING",
        },
        include: {
          user: true,
          orderItems: {
            include: {
              product: true,
            },
          },
          shippingAddress: true,
        },
      })

      if (order && order.user?.email) {
        try {
          await sendOrderConfirmationEmail({
            orderNumber: order.id,
            customerName: order.user.email,
            total: Number(order.total),
            items: order.orderItems.map((item) => ({
              name: item.product.name,
              quantity: item.quantity,
              price: Number(item.price),
            })),
            shippingAddress: order.shippingAddress,
          })
        } catch (error) {
          console.error("Failed to send order confirmation email:", error)
          // Continue processing even if email fails
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    )
  }
} 