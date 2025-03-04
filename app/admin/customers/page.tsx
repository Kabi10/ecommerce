import { Suspense } from "react"
import { Metadata } from "next"
import { CustomersContent } from "./customers-content"
import { CustomersContentSkeleton } from "@/components/skeletons/customers-content-skeleton"

export const metadata: Metadata = {
  title: "Customers Management",
  description: "Manage your store's customers and their information.",
}

export default function CustomersPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">
          Manage your store's customers and their information.
        </p>
      </div>

      <Suspense fallback={<CustomersContentSkeleton />}>
        <CustomersContent />
      </Suspense>
    </div>
  )
} 