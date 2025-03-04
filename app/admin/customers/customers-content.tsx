"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CustomerDataTable } from "@/components/customers/customer-data-table"
import { CustomerFilters } from "@/components/customers/customer-filters"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CustomerDetails } from "@/components/customers/customer-details"

// Mock data for demonstration
const mockCustomers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    totalOrders: 5,
    totalSpent: 549.95,
    lastOrder: new Date("2023-06-15"),
    createdAt: new Date("2023-01-10"),
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 234-5678",
    totalOrders: 3,
    totalSpent: 299.97,
    lastOrder: new Date("2023-06-18"),
    createdAt: new Date("2023-02-15"),
    status: "active",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "+1 (555) 345-6789",
    totalOrders: 1,
    totalSpent: 89.99,
    lastOrder: new Date("2023-06-20"),
    createdAt: new Date("2023-03-20"),
    status: "inactive",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 (555) 456-7890",
    totalOrders: 8,
    totalSpent: 874.92,
    lastOrder: new Date("2023-06-22"),
    createdAt: new Date("2023-01-05"),
    status: "active",
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    phone: "+1 (555) 567-8901",
    totalOrders: 2,
    totalSpent: 159.98,
    lastOrder: new Date("2023-06-25"),
    createdAt: new Date("2023-04-10"),
    status: "blocked",
  },
]

// Mock customer details
const mockCustomerDetails = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  status: "active",
  createdAt: new Date("2023-01-10"),
  lastLogin: new Date("2023-06-25"),
  addresses: [
    {
      id: "a1",
      type: "shipping",
      isDefault: true,
      line1: "123 Main St",
      line2: "Apt 4B",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
    },
    {
      id: "a2",
      type: "billing",
      isDefault: true,
      line1: "123 Main St",
      line2: "Apt 4B",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
    },
  ],
  orders: [
    {
      id: "o1",
      orderNumber: "ORD-001",
      date: new Date("2023-06-15"),
      total: 129.99,
      status: "delivered",
    },
    {
      id: "o2",
      orderNumber: "ORD-002",
      date: new Date("2023-05-20"),
      total: 89.99,
      status: "delivered",
    },
    {
      id: "o3",
      orderNumber: "ORD-003",
      date: new Date("2023-04-10"),
      total: 199.99,
      status: "delivered",
    },
  ],
  notes: "VIP customer, prefers email communication",
  preferences: {
    marketingEmails: true,
    smsNotifications: false,
    newsletter: true,
  },
}

export function CustomersContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [customers, setCustomers] = useState(mockCustomers)
  const [selectedCustomer, setSelectedCustomer] = useState<typeof mockCustomers[0] | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  
  // Filter customers based on search params
  const filteredCustomers = customers.filter(customer => {
    const searchTerm = searchParams.get("search")?.toLowerCase()
    const statusFilter = searchParams.get("status")
    const fromDate = searchParams.get("from") ? new Date(searchParams.get("from")!) : null
    const toDate = searchParams.get("to") ? new Date(searchParams.get("to")!) : null
    
    let matchesSearch = true
    let matchesStatus = true
    let matchesDateRange = true
    
    if (searchTerm) {
      matchesSearch = 
        customer.name.toLowerCase().includes(searchTerm) || 
        customer.email.toLowerCase().includes(searchTerm) ||
        customer.phone.toLowerCase().includes(searchTerm)
    }
    
    if (statusFilter) {
      matchesStatus = customer.status === statusFilter
    }
    
    if (fromDate) {
      matchesDateRange = customer.createdAt >= fromDate
    }
    
    if (toDate) {
      const nextDay = new Date(toDate)
      nextDay.setDate(nextDay.getDate() + 1)
      matchesDateRange = matchesDateRange && customer.createdAt < nextDay
    }
    
    return matchesSearch && matchesStatus && matchesDateRange
  })

  // Handle customer status update
  const handleUpdateStatus = async (customerId: string, status: string) => {
    try {
      // In a real app, you would call your API here
      // await updateCustomerStatus(customerId, status)
      
      // Update local state
      setCustomers(customers.map(customer => 
        customer.id === customerId ? { ...customer, status } : customer
      ))
      
      toast({
        title: "Customer status updated",
        description: `Customer ${customers.find(c => c.id === customerId)?.name} has been marked as ${status}.`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to update customer status.",
        variant: "destructive",
      })
    }
  }

  // Handle view customer details
  const handleViewDetails = (customer: typeof mockCustomers[0]) => {
    setSelectedCustomer(customer)
    setIsDetailsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <CustomerFilters />
      
      <CustomerDataTable 
        customers={filteredCustomers}
        onViewDetails={handleViewDetails}
        onUpdateStatus={handleUpdateStatus}
      />
      
      {/* Customer Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              View complete information about this customer.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <CustomerDetails customer={mockCustomerDetails} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 