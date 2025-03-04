import { Suspense } from "react"
import { Metadata } from "next"
import { ProductsContent } from "./products-content"
import { ProductsContentSkeleton } from "@/components/skeletons/products-content-skeleton"

export const metadata: Metadata = {
  title: "Products Management",
  description: "Manage your store's products, variants, and inventory.",
}

export default function ProductsPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground">
          Manage your store's products, variants, and inventory.
        </p>
      </div>
      
      <Suspense fallback={<ProductsContentSkeleton />}>
        <ProductsContent />
      </Suspense>
    </div>
  )
} 