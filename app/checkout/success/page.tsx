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

async function getLatestOrder(userId: string) {
  return prisma.order.findFirst({
    where: {
      userId,
      status: {
        in: ['PENDING', 'PROCESSING'],
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      shippingAddress: true,
    },
  })
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string }
}) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const order = await getLatestOrder(session.user.id)
  if (!order) {
    redirect('/')
  }

  return (
    <div className="container max-w-2xl py-8 md:py-10">
      <div className="space-y-8">
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold">Thank You!</h1>
          <p className="text-muted-foreground">
            Your order has been confirmed and will be shipped soon.
          </p>
        </div>

        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Order Details</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Order Number:</span> {order.id}
            </p>
            <p>
              <span className="font-medium">Status:</span>{' '}
              {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
            </p>
          </div>

          <div className="divide-y">
            {order.orderItems.map((item) => (
              <div key={item.id} className="py-4 flex justify-between">
                <div>
                  <p className="font-medium">{item.product.name}</p>
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

          <div className="border-t pt-4">
            <p className="flex justify-between font-medium">
              <span>Total</span>
              <span>${Number(order.total).toFixed(2)}</span>
            </p>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button asChild>
            <Link href="/account/orders">View Orders</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 