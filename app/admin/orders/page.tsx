import { Suspense } from "react"
import { Metadata } from "next"
import { OrdersContent } from "./orders-content"
import { OrdersContentSkeleton } from "@/components/skeletons/orders-content-skeleton"

export const metadata: Metadata = {
  title: "Orders Management",
  description: "Manage your store's orders, track shipments, and handle customer requests.",
}

export default function OrdersPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          Manage your store's orders, track shipments, and handle customer requests.
        </p>
      </div>

      <Suspense fallback={<OrdersContentSkeleton />}>
        <OrdersContent />
      </Suspense>
    </div>
  )
} 