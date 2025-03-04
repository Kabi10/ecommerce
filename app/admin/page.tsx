import { Suspense } from "react"
import { headers } from "next/headers"
import { Overview } from "@/components/dashboard/overview"
import { RecentSales } from "@/components/dashboard/recent-sales"
import { LowStockAlert } from "@/components/dashboard/low-stock-alert"
import { TopProducts } from "@/components/dashboard/top-products"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { SalesAnalytics } from "@/components/dashboard/sales-analytics"
import { RecentOrdersTable } from "@/components/dashboard/recent-orders-table"
import { Skeleton } from "@/components/ui/skeleton"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export const metadata = {
  title: "Admin Dashboard",
  description: "Example admin dashboard built using the components.",
}

async function getAnalytics() {
  try {
    const host = (await headers()).get("host")
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
    
    const response = await fetch(`${protocol}://${host}/api/admin/analytics`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch analytics")
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return {
      totalRevenue: 0,
      revenueChange: 0,
      totalOrders: 0,
      orderChange: 0,
      totalCustomers: 0,
      customerChange: 0,
      averageOrderValue: 0,
      aovChange: 0,
      dailySales: [],
      orderStatusStats: [],
      lowStockProducts: [],
      topProducts: [],
      recentOrders: []
    }
  }
}

function MetricsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-4" />
          </div>
          <Skeleton className="h-8 w-[120px] mt-4" />
          <div className="flex items-center mt-2">
            <Skeleton className="h-4 w-[60px]" />
            <Skeleton className="h-4 w-[100px] ml-2" />
          </div>
        </div>
      ))}
    </div>
  )
}

function SalesAnalyticsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <div className="col-span-4">
        <div className="rounded-xl border p-6">
          <Skeleton className="h-4 w-[180px]" />
          <div className="mt-4">
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </div>
      <div className="col-span-3">
        <div className="rounded-xl border p-6">
          <Skeleton className="h-4 w-[180px]" />
          <div className="mt-4">
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

function RecentOrdersTableSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="p-4 flex items-center justify-between">
        <Skeleton className="h-6 w-[120px]" />
        <Skeleton className="h-9 w-[80px]" />
      </div>
      <div className="p-4">
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function AdminPage() {
  const {
    totalRevenue,
    revenueChange,
    totalOrders,
    orderChange,
    totalCustomers,
    customerChange,
    averageOrderValue,
    aovChange,
    dailySales,
    orderStatusStats,
    lowStockProducts,
    topProducts,
    recentOrders,
  } = await getAnalytics()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Suspense fallback={<MetricsCardsSkeleton />}>
        <MetricsCards
          totalRevenue={totalRevenue}
          revenueChange={revenueChange}
          totalOrders={totalOrders}
          orderChange={orderChange}
          totalCustomers={totalCustomers}
          customerChange={customerChange}
          averageOrderValue={averageOrderValue}
          aovChange={aovChange}
        />
      </Suspense>
      <Suspense fallback={<SalesAnalyticsSkeleton />}>
        <SalesAnalytics
          dailySales={dailySales}
          orderStatusStats={orderStatusStats}
        />
      </Suspense>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <Suspense fallback={<div className="h-[400px] rounded-xl border" />}>
            <Overview />
          </Suspense>
        </div>
        <div className="col-span-3">
          <Suspense fallback={<div className="h-[400px] rounded-xl border" />}>
            <RecentSales orders={recentOrders} />
          </Suspense>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <Suspense fallback={<div className="h-[300px] rounded-xl border" />}>
            <TopProducts products={topProducts} />
          </Suspense>
        </div>
        <div className="col-span-3">
          <Suspense fallback={<div className="h-[300px] rounded-xl border" />}>
            <LowStockAlert products={lowStockProducts} />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={<RecentOrdersTableSkeleton />}>
        <RecentOrdersTable orders={recentOrders} />
      </Suspense>
    </div>
  )
}
