import { auth } from '@/auth'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Truck, CreditCard, MapPin } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Order Details',
  description: 'View the details of your order.',
}

async function getOrder(id: string, userId: string) {
  const order = await prisma.order.findUnique({
    where: { 
      id,
      userId, // Ensure the order belongs to the user
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      shippingAddress: true,
      payment: true,
    },
  })
  
  if (!order) {
    return null
  }
  
  return order
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

function getPaymentStatusColor(status: string) {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'FAILED':
      return 'bg-red-100 text-red-800'
    case 'REFUNDED':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  
  if (!session?.user) {
    return null
  }
  
  const order = await getOrder(params.id, session.user.id)
  
  if (!order) {
    notFound()
  }
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Order #{order.id.substring(0, 8)}</h2>
          <Badge variant="outline" className={getOrderStatusColor(order.status)}>
            {order.status}
          </Badge>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Order Summary
            </CardTitle>
            <CardDescription>
              Placed on {formatDate(order.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="divide-y">
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
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-base">
                  <p>Subtotal</p>
                  <p>{formatCurrency(Number(order.total))}</p>
                </div>
                <div className="flex justify-between text-base">
                  <p>Shipping</p>
                  <p>Free</p>
                </div>
                <div className="flex justify-between text-base font-medium mt-2 pt-2 border-t">
                  <p>Total</p>
                  <p>{formatCurrency(Number(order.total))}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">{session.user.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.payment ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Payment Method</p>
                    <p className="text-sm">{order.payment.provider}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Payment Status</p>
                    <Badge variant="outline" className={getPaymentStatusColor(order.payment.status)}>
                      {order.payment.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Payment Date</p>
                    <p className="text-sm">{formatDate(order.payment.createdAt)}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No payment information available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 