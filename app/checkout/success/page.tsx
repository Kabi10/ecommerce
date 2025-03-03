import { auth } from '@/app/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = {
  title: 'Order Confirmation | EStore',
  description: 'Thank you for your purchase',
}

interface PageProps {
  searchParams: Promise<{ session_id?: string }>
}

export default async function CheckoutSuccessPage({
  searchParams,
}: PageProps) {
  const session = await auth()
  const params = await searchParams

  if (!session) {
    redirect("/sign-in")
  }

  const session_id = params.session_id

  if (!session_id) {
    redirect("/")
  }

  const payment = await prisma.payment.findUnique({
    where: {
      stripeSessionId: session_id,
    },
    include: {
      order: {
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          shippingAddress: true,
        },
      },
    },
  })

  if (!payment || payment.order.userId !== session.user.id) {
    redirect("/")
  }

  const order = payment.order

  return (
    <div className="container max-w-4xl py-20">
      <div className="rounded-lg border p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-green-600">
            Thank you for your order!
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Your order has been confirmed and will be shipped soon.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Order ID: {order.id}
          </p>
        </div>

        <div className="mt-12">
          <h2 className="text-lg font-semibold">Order Details</h2>
          <div className="mt-4 divide-y">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex py-4">
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  ${Number(item.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between border-t pt-6">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">
              ${Number(order.total).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-lg font-semibold">Shipping Address</h2>
          <div className="mt-4 text-sm">
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 