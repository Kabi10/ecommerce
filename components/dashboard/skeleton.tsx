'use client'

import { Skeleton } from "@/components/ui/skeleton"

interface DashboardSkeletonProps {
  type: "metrics" | "analytics" | "management"
}

export function DashboardSkeleton({ type }: DashboardSkeletonProps) {
  if (type === "metrics") {
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

  if (type === "analytics") {
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

  // Management skeleton (products and orders)
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <div className="rounded-xl border p-6">
            <Skeleton className="h-4 w-[140px] mb-4" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-8 w-[200px]" />
                  <Skeleton className="h-8 w-[100px]" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div className="rounded-xl border p-6">
            <Skeleton className="h-4 w-[140px] mb-4" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-8 w-[160px]" />
                  <Skeleton className="h-8 w-[80px]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <div className="p-4">
          <Skeleton className="h-8 w-full" />
          <div className="mt-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 