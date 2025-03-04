"use client"

import { useCallback, useEffect, useState } from "react"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export function CustomerFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [status, setStatus] = useState(searchParams.get("status") || "")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined
  )
  const [dateTo, setDateTo] = useState<Date | undefined>(
    searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined
  )
  const [isFromOpen, setIsFromOpen] = useState(false)
  const [isToOpen, setIsToOpen] = useState(false)

  // Update filters with debounce for search
  const updateFilters = useCallback((newSearch?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Update search
    if (newSearch !== undefined) {
      if (newSearch) {
        params.set("search", newSearch)
      } else {
        params.delete("search")
      }
    } else if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }
    
    // Update status
    if (status) {
      params.set("status", status)
    } else {
      params.delete("status")
    }
    
    // Update dates
    if (dateFrom) {
      params.set("from", dateFrom.toISOString().split("T")[0])
    } else {
      params.delete("from")
    }
    
    if (dateTo) {
      params.set("to", dateTo.toISOString().split("T")[0])
    } else {
      params.delete("to")
    }
    
    router.push(`?${params.toString()}`)
  }, [router, searchParams, search, status, dateFrom, dateTo])

  // Debounce search updates
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters()
    }, 500)

    return () => clearTimeout(timer)
  }, [search, updateFilters])

  // Update filters immediately for non-search changes
  const handleStatusChange = (value: string) => {
    setStatus(value)
    updateFilters()
  }

  const handleDateFromChange = (date: Date | undefined) => {
    setDateFrom(date)
    setIsFromOpen(false)
    updateFilters()
  }

  const handleDateToChange = (date: Date | undefined) => {
    setDateTo(date)
    setIsToOpen(false)
    updateFilters()
  }

  // Clear all filters
  const handleClearFilters = () => {
    setSearch("")
    setStatus("")
    setDateFrom(undefined)
    setDateTo(undefined)
    router.push(window.location.pathname)
  }

  // Check if any filters are active
  const hasActiveFilters = search || status || dateFrom || dateTo

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="flex-1">
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-[300px]"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>

        <Popover open={isFromOpen} onOpenChange={setIsFromOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[120px] justify-start text-left font-normal",
                !dateFrom && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFrom ? format(dateFrom, "PPP") : "From date"}
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

        <Popover open={isToOpen} onOpenChange={setIsToOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[120px] justify-start text-left font-normal",
                !dateTo && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateTo ? format(dateTo, "PPP") : "To date"}
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

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="h-10 px-3"
          >
            <X className="mr-2 h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  )
} 