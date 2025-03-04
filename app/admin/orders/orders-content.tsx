"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { OrderDataTable, Order } from "@/components/orders/order-data-table"
import { OrderFilters } from "@/components/orders/order-filters"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { OrderDetails } from "@/components/orders/order-details"
import { FileText, Printer } from "lucide-react"

// Mock data for demonstration
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-001",
    customer: {
      id: "c1",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    status: "pending",
    paymentStatus: "pending",
    total: 129.99,
    items: 2,
    createdAt: new Date("2023-06-15"),
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    customer: {
      id: "c2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
    status: "processing",
    paymentStatus: "paid",
    total: 249.98,
    items: 3,
    createdAt: new Date("2023-06-18"),
  },
  {
    id: "3",
    orderNumber: "ORD-003",
    customer: {
      id: "c3",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
    },
    status: "shipped",
    paymentStatus: "paid",
    total: 89.99,
    items: 1,
    createdAt: new Date("2023-06-20"),
  },
  {
    id: "4",
    orderNumber: "ORD-004",
    customer: {
      id: "c4",
      name: "Emily Davis",
      email: "emily.davis@example.com",
    },
    status: "delivered",
    paymentStatus: "paid",
    total: 174.97,
    items: 4,
    createdAt: new Date("2023-06-22"),
  },
  {
    id: "5",
    orderNumber: "ORD-005",
    customer: {
      id: "c5",
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
    },
    status: "cancelled",
    paymentStatus: "refunded",
    total: 59.99,
    items: 1,
    createdAt: new Date("2023-06-25"),
  },
]

// Mock order details
const mockOrderDetails = {
  id: "1",
  orderNumber: "ORD-001",
  customer: {
    id: "c1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
  },
  status: "pending",
  paymentStatus: "pending",
  paymentMethod: "Credit Card",
  shippingAddress: {
    line1: "123 Main St",
    line2: "Apt 4B",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "United States",
  },
  billingAddress: {
    line1: "123 Main St",
    line2: "Apt 4B",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "United States",
  },
  items: [
    {
      id: "p1",
      name: "Wireless Headphones",
      price: 79.99,
      quantity: 1,
      total: 79.99,
      image: "https://placehold.co/100x100/png",
    },
    {
      id: "p2",
      name: "Phone Case",
      price: 24.99,
      quantity: 2,
      total: 49.98,
      image: "https://placehold.co/100x100/png",
    },
  ],
  subtotal: 129.97,
  shipping: 9.99,
  tax: 10.40,
  discount: 0,
  total: 150.36,
  notes: "Please leave package at the door",
  createdAt: new Date("2023-06-15"),
  updatedAt: new Date("2023-06-15"),
}

export function OrdersContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [orders, setOrders] = useState(mockOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false)
  
  // Filter orders based on search params
  const filteredOrders = orders.filter(order => {
    const searchTerm = searchParams.get("search")?.toLowerCase()
    const statusFilter = searchParams.get("status")
    const paymentFilter = searchParams.get("payment")
    const fromDate = searchParams.get("from") ? new Date(searchParams.get("from")!) : null
    const toDate = searchParams.get("to") ? new Date(searchParams.get("to")!) : null
    
    let matchesSearch = true
    let matchesStatus = true
    let matchesPayment = true
    let matchesDateRange = true
    
    if (searchTerm) {
      matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm) || 
        order.customer.name.toLowerCase().includes(searchTerm) ||
        order.customer.email.toLowerCase().includes(searchTerm)
    }
    
    if (statusFilter) {
      matchesStatus = order.status === statusFilter
    }
    
    if (paymentFilter) {
      matchesPayment = order.paymentStatus === paymentFilter
    }
    
    if (fromDate) {
      matchesDateRange = order.createdAt >= fromDate
    }
    
    if (toDate) {
      const nextDay = new Date(toDate)
      nextDay.setDate(nextDay.getDate() + 1)
      matchesDateRange = matchesDateRange && order.createdAt < nextDay
    }
    
    return matchesSearch && matchesStatus && matchesPayment && matchesDateRange
  })

  // Handle order status update
  const handleUpdateStatus = async (orderId: string, status: Order["status"]) => {
    try {
      // In a real app, you would call your API here
      // await updateOrderStatus(orderId, status)
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ))
      
      toast({
        title: "Order status updated",
        description: `Order ${orders.find(o => o.id === orderId)?.orderNumber} has been marked as ${status}.`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      })
    }
  }

  // Handle view order details
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailsDialogOpen(true)
  }

  // Handle generate invoice
  const handleGenerateInvoice = async (orderId: string) => {
    try {
      setIsGeneratingInvoice(true)
      
      // In a real app, you would call your API here to generate the invoice
      // const invoiceUrl = await generateInvoice(orderId)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Invoice generated",
        description: `Invoice for order ${orders.find(o => o.id === orderId)?.orderNumber} has been generated.`,
      })
      
      // In a real app, you might open the invoice in a new tab or download it
      // window.open(invoiceUrl, '_blank')
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to generate invoice.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingInvoice(false)
    }
  }

  return (
    <div className="space-y-6">
      <OrderFilters />
      
      <OrderDataTable 
        orders={filteredOrders}
        onViewDetails={handleViewDetails}
        onUpdateStatus={handleUpdateStatus}
        onGenerateInvoice={handleGenerateInvoice}
      />
      
      {/* Order Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              View complete information about this order.
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleGenerateInvoice(selectedOrder.id)}
                  disabled={isGeneratingInvoice}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {isGeneratingInvoice ? "Generating..." : "Generate Invoice"}
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Order
                </Button>
              </div>
              
              <OrderDetails order={mockOrderDetails} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 