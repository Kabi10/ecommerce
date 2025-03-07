import { auth } from '@/auth'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Your Orders',
  description: 'View and manage your order history.',
}

async function getOrders(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  })
}

function getOrderStatusColor(status: string) {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-800'
    case 'SHIPPED':
      return 'bg-purple-100 text-purple-800'
    case 'DELIVERED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default async function OrdersPage() {
  const session = await auth()
  
  if (!session?.user) {
    return null
  }
  
  const orders = await getOrders(session.user.id)
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Your Orders</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            View and manage all your past orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="space-y-8">
              {orders.map((order) => (
                <div key={order.id} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">Order #{order.id.substring(0, 8)}</h3>
                        <Badge variant="outline" className={getOrderStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{formatCurrency(Number(order.total))}</p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 divide-y">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 py-4">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                          {item.product.images[0] && (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="h-full w-full object-cover object-center"
                            />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between text-base font-medium">
                            <h3>{item.product.name}</h3>
                            <p className="ml-4">{formatCurrency(Number(item.price))}</p>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Qty {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">You haven't placed any orders yet</p>
                <Button className="mt-4" asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 