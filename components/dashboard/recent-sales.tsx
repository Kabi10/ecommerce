"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatCurrency } from '@/lib/utils'

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

interface RecentSalesProps {
  orders: Order[]
}

export function RecentSales({ orders }: RecentSalesProps) {
  if (!orders?.length) {
    return <div className="text-sm text-muted-foreground">No recent sales</div>
  }

  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {order.user.name || order.user.email}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {formatCurrency(order.total)}
          </div>
        </div>
      ))}
    </div>
  )
}
