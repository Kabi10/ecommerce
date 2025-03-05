import { useState } from "react"
import { toast } from "sonner"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Customer {
  name: string
  email: string
  image: string | null
}

export interface Order {
  id: string
  orderNumber: string
  customer: Customer
  items: OrderItem[]
  total: number
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  paymentStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"
  createdAt: string
}

interface OrdersResponse {
  orders: Order[]
  total: number
  totalPages: number
  currentPage: number
}

interface UseOrdersOptions {
  initialPage?: number
  limit?: number
}

export function useOrders(options: UseOrdersOptions = {}) {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(options.initialPage || 1)
  const [limit] = useState(options.limit || 10)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<Order["status"] | undefined>()
  const [sortBy, setSortBy] = useState<"createdAt" | "total" | "status">("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Fetch orders
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<OrdersResponse>({
    queryKey: ["orders", page, limit, search, status, sortBy, sortOrder],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(status && { status }),
        sortBy,
        sortOrder,
      })

      const response = await fetch(`/api/admin/orders?${searchParams}`)
      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }

      return response.json()
    },
  })

  // Update order status
  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      ids,
      status,
    }: {
      ids: string[]
      status: Order["status"]
    }) => {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids, status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order status")
      }
    },
    onSuccess: () => {
      toast.success("Order status updated successfully")
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return {
    orders: data?.orders || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || page,
    isLoading,
    isError,
    error,
    isUpdating,
    page,
    setPage,
    search,
    setSearch,
    status,
    setStatus,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    updateStatus,
  }
} 