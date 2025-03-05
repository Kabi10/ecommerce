import { Suspense } from "react"
import { headers } from "next/headers"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardMetrics } from "@/components/dashboard/metrics"
import { DashboardAnalytics } from "@/components/dashboard/analytics"
import { DashboardManagement } from "@/components/dashboard/management"
import { DashboardSkeleton } from "@/components/dashboard/skeleton"

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

export default async function AdminPage() {
  const analytics = await getAnalytics()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <DashboardHeader />
      
      <Suspense fallback={<DashboardSkeleton type="metrics" />}>
        <DashboardMetrics data={analytics} />
      </Suspense>
      
      <Suspense fallback={<DashboardSkeleton type="analytics" />}>
        <DashboardAnalytics data={analytics} />
      </Suspense>
      
      <Suspense fallback={<DashboardSkeleton type="management" />}>
        <DashboardManagement data={analytics} />
      </Suspense>
    </div>
  )
}
