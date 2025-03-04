import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"

interface Address {
  id: string
  type: string
  isDefault: boolean
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface Order {
  id: string
  orderNumber: string
  date: Date
  total: number
  status: string
}

interface CustomerPreferences {
  marketingEmails: boolean
  smsNotifications: boolean
  newsletter: boolean
}

interface CustomerDetailsData {
  id: string
  name: string
  email: string
  phone?: string
  status: string
  createdAt: Date
  lastLogin: Date
  addresses: Address[]
  orders: Order[]
  notes?: string
  preferences: CustomerPreferences
}

interface CustomerDetailsProps {
  customer: CustomerDetailsData
}

export function CustomerDetails({ customer }: CustomerDetailsProps) {
  // Format date to readable string
  const formatDate = (date: Date) => {
    return format(date, "PPP")
  }

  // Generate status badge
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      active: { variant: "default", label: "Active" },
      inactive: { variant: "secondary", label: "Inactive" },
      blocked: { variant: "destructive", label: "Blocked" },
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

  // Generate order status badge
  const getOrderStatusBadge = (status: string) => {
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

  return (
    <div className="space-y-6">
      {/* Customer Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="font-medium">{customer.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="mt-1">{getStatusBadge(customer.status)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{customer.email}</p>
              </div>
              {customer.phone && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p>{customer.phone}</p>
                </div>
              )}
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Member Since</p>
              <p>{formatDate(customer.createdAt)}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Login</p>
              <p>{formatDate(customer.lastLogin)}</p>
            </div>
            
            {customer.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="text-sm mt-1">{customer.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Communication Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Marketing Emails</p>
              <p>{customer.preferences.marketingEmails ? "Subscribed" : "Not subscribed"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">SMS Notifications</p>
              <p>{customer.preferences.smsNotifications ? "Enabled" : "Disabled"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Newsletter</p>
              <p>{customer.preferences.newsletter ? "Subscribed" : "Not subscribed"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Addresses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {customer.addresses.map((address) => (
              <div key={address.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="font-medium capitalize">{address.type} Address</p>
                  {address.isDefault && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                </div>
                <p>{formatAddress(address)}</p>
                {address !== customer.addresses[customer.addresses.length - 1] && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Order History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customer.orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(order.date)}</p>
                </div>
                <div className="flex items-center gap-4">
                  {getOrderStatusBadge(order.status)}
                  <p className="font-medium">{formatCurrency(order.total)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 