"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { cn, formatDate } from "@/lib/utils"
import { Order } from "./order-data-table"

interface OrderFiltersProps {
  onReset?: () => void
}

export function OrderFilters({ onReset }: OrderFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [status, setStatus] = useState(searchParams.get("status") || "")
  const [paymentStatus, setPaymentStatus] = useState(searchParams.get("payment") || "")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined
  )
  const [dateTo, setDateTo] = useState<Date | undefined>(
    searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined
  )
  
  // Debounce search input
  const debouncedSearch = useCallback(
    (value: string) => {
      const timer = setTimeout(() => {
        updateFilters({ search: value })
      }, 500)
      
      return () => clearTimeout(timer)
    },
    [searchParams]
  )
  
  // Update search params and navigate
  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Update params based on the updates object
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    
    // Navigate to the new URL
    router.push(`?${params.toString()}`)
  }
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    debouncedSearch(value)
  }
  
  // Handle status change
  const handleStatusChange = (value: string) => {
    setStatus(value)
    updateFilters({ status: value })
  }
  
  // Handle payment status change
  const handlePaymentStatusChange = (value: string) => {
    setPaymentStatus(value)
    updateFilters({ payment: value })
  }
  
  // Handle date from change
  const handleDateFromChange = (date: Date | undefined) => {
    setDateFrom(date)
    updateFilters({ 
      from: date ? date.toISOString().split("T")[0] : null 
    })
  }
  
  // Handle date to change
  const handleDateToChange = (date: Date | undefined) => {
    setDateTo(date)
    updateFilters({ 
      to: date ? date.toISOString().split("T")[0] : null 
    })
  }
  
  // Reset all filters
  const resetFilters = () => {
    setSearch("")
    setStatus("")
    setPaymentStatus("")
    setDateFrom(undefined)
    setDateTo(undefined)
    
    router.push("/admin/orders")
    
    if (onReset) {
      onReset()
    }
  }
  
  // Check if any filters are active
  const hasActiveFilters = search || status || paymentStatus || dateFrom || dateTo
  
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
        
        <div>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Order Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select value={paymentStatus} onValueChange={handlePaymentStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Payments</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal flex-1",
                  !dateFrom && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? formatDate(dateFrom) : "From Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={handleDateFromChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal flex-1",
                  !dateTo && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? formatDate(dateTo) : "To Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={handleDateToChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-8 px-2 lg:px-3"
          >
            Reset Filters
            <X className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
} 