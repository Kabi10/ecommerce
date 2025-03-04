"use client"

import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/utils"
import { 
  Eye, 
  MoreHorizontal, 
  Package, 
  RefreshCw, 
  Truck, 
  XCircle 
} from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  total: number
  status: string
  createdAt: string
  user: {
    name: string | null
    email: string
  }
}

interface RecentOrdersTableProps {
  orders: Order[]
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  if (!orders?.length) {
    return (
      <div className="rounded-md border p-8 text-center">
        <h3 className="text-lg font-medium">No recent orders</h3>
        <p className="text-sm text-muted-foreground mt-2">
          New orders will appear here when customers make purchases.
        </p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
      case 'processing':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
      case 'shipped':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
      case 'pending':
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Package className="h-4 w-4 mr-2" />
      case 'processing':
        return <RefreshCw className="h-4 w-4 mr-2" />
      case 'shipped':
        return <Truck className="h-4 w-4 mr-2" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 mr-2" />
      case 'pending':
      default:
        return <RefreshCw className="h-4 w-4 mr-2" />
    }
  }

  return (
    <div className="rounded-md border">
      <div className="p-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Recent Orders</h3>
        <Link href="/admin/orders">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">
                #{order.id.substring(0, 8)}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{order.user.name || 'Guest'}</span>
                  <span className="text-xs text-muted-foreground">{order.user.email}</span>
                </div>
              </TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge className={`flex items-center ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{formatCurrency(order.total)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href={`/admin/orders/${order.id}`} className="flex items-center w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/admin/orders/${order.id}/update`} className="flex items-center w-full">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Update status
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 