'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Slider } from '@/components/ui/slider'
import { formatPrice } from '@/lib/utils'
import { useDebounce } from '@/lib/hooks/use-debounce'

interface PriceRangeFilterProps {
  minPrice: number
  maxPrice: number
  defaultMin?: number
  defaultMax?: number
}

export function PriceRangeFilter({
  minPrice,
  maxPrice,
  defaultMin,
  defaultMax,
}: PriceRangeFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [priceRange, setPriceRange] = React.useState([
    defaultMin ?? minPrice,
    defaultMax ?? maxPrice,
  ])

  const debouncedPriceRange = useDebounce(priceRange, 500)

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('minPrice', debouncedPriceRange[0].toString())
    params.set('maxPrice', debouncedPriceRange[1].toString())
    router.push(`/products?${params.toString()}`)
  }, [debouncedPriceRange, router, searchParams])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
        </span>
      </div>
      
      <Slider
        min={minPrice}
        max={maxPrice}
        step={1}
        value={priceRange}
        onValueChange={setPriceRange}
        className="w-full"
      />
    </div>
  )
} 