"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { debounce } from "lodash"

interface Category {
  id: string
  name: string
}

interface ProductFiltersProps {
  categories: Category[]
  basePath?: string
}

export function ProductFilters({ categories, basePath = "/products" }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [stock, setStock] = useState(searchParams.get("stock") || "")
  const [open, setOpen] = useState(false)
  
  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      updateFilters({ search: value })
    }, 500),
    []
  )

  // Update search params and navigate
  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Update or remove params based on the updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    
    router.push(`${basePath}?${params.toString()}`)
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    debouncedSearch(value)
  }

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setCategory(value)
    updateFilters({ category: value })
  }

  // Handle stock filter change
  const handleStockChange = (value: string) => {
    setStock(value)
    updateFilters({ stock: value })
  }

  // Clear all filters
  const clearFilters = () => {
    setSearch("")
    setCategory("")
    setStock("")
    router.push(basePath)
  }

  // Sync state with URL params on mount
  useEffect(() => {
    setSearch(searchParams.get("search") || "")
    setCategory(searchParams.get("category") || "")
    setStock(searchParams.get("stock") || "")
  }, [searchParams])

  const hasActiveFilters = search || category || stock

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={handleSearchChange}
            className="pl-8"
          />
          {search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => {
                setSearch("")
                updateFilters({ search: "" })
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full md:w-[200px] justify-between"
            >
              {category
                ? categories.find((c) => c.id === category)?.name
                : "Select category"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full md:w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search category..." />
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    handleCategoryChange("")
                    setOpen(false)
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      !category ? "opacity-100" : "opacity-0"
                    )}
                  />
                  All Categories
                </CommandItem>
                {categories.map((c) => (
                  <CommandItem
                    key={c.id}
                    onSelect={() => {
                      handleCategoryChange(c.id)
                      setOpen(false)
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        category === c.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {c.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        
        <Select value={stock} onValueChange={handleStockChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Stock status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stock levels</SelectItem>
            <SelectItem value="in-stock">In stock</SelectItem>
            <SelectItem value="low-stock">Low stock (≤ 10)</SelectItem>
            <SelectItem value="out-of-stock">Out of stock</SelectItem>
          </SelectContent>
        </Select>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="w-full md:w-auto"
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  )
} 