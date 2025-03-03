'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PriceRangeFilter } from './price-range-filter'
import { CategoryFilter } from './category-filter'
import { Separator } from '@/components/ui/separator'

interface ProductFiltersProps {
  minPrice: number
  maxPrice: number
  categories: {
    id: string
    name: string
  }[]
}

export function ProductFilters({ minPrice, maxPrice, categories }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Sort By</h3>
        <Select
          value={searchParams.get('sort') || 'createdAt_desc'}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt_desc">Newest First</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="name_asc">Name: A to Z</SelectItem>
            <SelectItem value="name_desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-4" />

      <div>
        <h3 className="text-sm font-medium mb-2">Categories</h3>
        <CategoryFilter categories={categories} />
      </div>
      
      <Separator className="my-4" />
      
      <div>
        <h3 className="text-sm font-medium mb-2">Price Range</h3>
        <PriceRangeFilter
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
      </div>
    </div>
  )
} 