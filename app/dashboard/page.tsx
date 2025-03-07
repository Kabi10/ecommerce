import { Suspense } from 'react'
import { auth } from '@/auth'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardSkeleton } from '@/components/dashboard/skeleton'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Clock, Package, CreditCard } from 'lucide-react'

export const metadata: Metadata = {
  title: 'User Dashboard',
  description: 'View your account overview, recent orders, and more.',
}

async function getRecentOrders(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  })
}

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    return null
  }
  
  const recentOrders = await getRecentOrders(session.user.id)
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime orders placed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Order</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentOrders[0] 
                ? formatDate(recentOrders[0].createdAt) 
                : 'No orders yet'}
            </div>
            <p className="text-xs text-muted-foreground">
              {recentOrders[0] 
                ? `Order #${recentOrders[0].id.substring(0, 8)}` 
                : 'Place your first order'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(recentOrders.reduce((acc, order) => acc + Number(order.total), 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all your orders
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="recent-orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent-orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="account-info">Account Info</TabsTrigger>
        </TabsList>
        <TabsContent value="recent-orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Your most recent orders and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<DashboardSkeleton type="metrics" />}>
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="font-medium">Order #{order.id.substring(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.createdAt)} · {order.status}
                          </p>
                          <p className="text-sm">
                            {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(Number(order.total))}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">No orders found</p>
                    </div>
                  </div>
                )}
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="account-info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">{session.user.name || 'Not provided'}</p>
                </div>
                <div className="grid gap-2">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{session.user.email}</p>
                </div>
                <div className="grid gap-2">
                  <p className="text-sm font-medium">Account Created</p>
                  <p className="text-sm text-muted-foreground">
                    {session.user.createdAt ? formatDate(new Date(session.user.createdAt)) : 'Not available'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 