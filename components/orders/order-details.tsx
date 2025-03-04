import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  total: number
  image: string
}

interface Address {
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
}

export interface OrderDetailsData {
  id: string
  orderNumber: string
  customer: Customer
  status: string
  paymentStatus: string
  paymentMethod: string
  shippingAddress: Address
  billingAddress: Address
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

interface OrderDetailsProps {
  order: OrderDetailsData
}

export function OrderDetails({ order }: OrderDetailsProps) {
  // Format date to readable string
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Generate status badge
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      pending: { variant: "outline", label: "Pending" },
      processing: { variant: "secondary", label: "Processing" },
      shipped: { variant: "default", label: "Shipped" },
      delivered: { variant: "default", label: "Delivered" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    }

    const statusConfig = statusMap[status] || { variant: "outline", label: status }
    
    return (
      <Badge variant={statusConfig.variant}>
        {statusConfig.label}
      </Badge>
    )
  }

  // Generate payment status badge
  const getPaymentStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      pending: { variant: "outline", label: "Pending" },
      paid: { variant: "default", label: "Paid" },
      refunded: { variant: "secondary", label: "Refunded" },
      failed: { variant: "destructive", label: "Failed" },
    }

    const statusConfig = statusMap[status] || { variant: "outline", label: status }
    
    return (
      <Badge variant={statusConfig.variant}>
        {statusConfig.label}
      </Badge>
    )
  }

  // Format address to string
  const formatAddress = (address: Address) => {
    const parts = [
      address.line1,
      address.line2,
      `${address.city}, ${address.state} ${address.postalCode}`,
      address.country,
    ].filter(Boolean)
    
    return parts.join(", ")
  }

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Order Number</p>
                <p className="font-medium">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date Placed</p>
                <p>{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="mt-1">{getStatusBadge(order.status)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payment</p>
                <div className="mt-1">{getPaymentStatusBadge(order.paymentStatus)}</div>
              </div>
            </div>
            
            {order.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="text-sm mt-1">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="font-medium">{order.customer.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{order.customer.email}</p>
            </div>
            {order.customer.phone && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p>{order.customer.phone}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{formatAddress(order.shippingAddress)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Billing Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{formatAddress(order.billingAddress)}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-md overflow-hidden bg-muted">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(item.price)} × {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(item.total)}</p>
                </div>
              </div>
            ))}
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Subtotal</p>
                <p className="font-medium">{formatCurrency(order.subtotal)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Shipping</p>
                <p className="font-medium">{formatCurrency(order.shipping)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Tax</p>
                <p className="font-medium">{formatCurrency(order.tax)}</p>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Discount</p>
                  <p className="font-medium text-green-600">-{formatCurrency(order.discount)}</p>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between">
                <p className="font-medium">Total</p>
                <p className="font-bold">{formatCurrency(order.total)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 