'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ArrowDownIcon, ArrowUpIcon, DollarSign, Package, ShoppingCart, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface MetricsCardsProps {
  totalRevenue: number
  revenueChange: number
  totalOrders: number
  orderChange: number
  totalCustomers: number
  customerChange: number
  averageOrderValue: number
  aovChange: number
}

export function MetricsCards({
  totalRevenue,
  revenueChange,
  totalOrders,
  orderChange,
  totalCustomers,
  customerChange,
  averageOrderValue,
  aovChange,
}: MetricsCardsProps) {
  const metrics = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change: revenueChange,
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      change: orderChange,
      icon: ShoppingCart,
    },
    {
      title: "Total Customers",
      value: totalCustomers.toString(),
      change: customerChange,
      icon: Users,
    },
    {
      title: "Average Order Value",
      value: formatCurrency(averageOrderValue),
      change: aovChange,
      icon: Package,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-2">
                <span
                  className={cn(
                    "text-xs",
                    metric.change > 0
                      ? "text-green-500"
                      : metric.change < 0
                      ? "text-red-500"
                      : "text-gray-500"
                  )}
                >
                  {metric.change > 0 ? (
                    <ArrowUpIcon className="h-4 w-4" />
                  ) : metric.change < 0 ? (
                    <ArrowDownIcon className="h-4 w-4" />
                  ) : null}
                </span>
                <p
                  className={cn(
                    "text-xs",
                    metric.change > 0
                      ? "text-green-500"
                      : metric.change < 0
                      ? "text-red-500"
                      : "text-gray-500"
                  )}
                >
                  {Math.abs(metric.change)}%
                </p>
                <p className="text-xs text-muted-foreground">from last month</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
} 