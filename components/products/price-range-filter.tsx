'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Slider } from '@/components/ui/slider'
import { Suspense } from 'react'

interface PriceRangeFilterProps {
  minPrice: number
  maxPrice: number
}

function PriceRangeFilterContent({ minPrice, maxPrice }: PriceRangeFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = React.useState([
    Number(searchParams.get('minPrice')) || minPrice,
    Number(searchParams.get('maxPrice')) || maxPrice,
  ])

  const handlePriceChange = React.useCallback(
    (newValue: number[]) => {
      setValue(newValue)
      const params = new URLSearchParams(searchParams.toString())
      params.set('minPrice', newValue[0].toString())
      params.set('maxPrice', newValue[1].toString())
      router.push(`/products?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Price Range</h3>
      <Slider
        defaultValue={value}
        min={minPrice}
        max={maxPrice}
        step={1}
        onValueChange={handlePriceChange}
      />
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>${value[0]}</span>
        <span>${value[1]}</span>
      </div>
    </div>
  )
}

export function PriceRangeFilter(props: PriceRangeFilterProps) {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Price Range</h3>
        <div className="h-4 bg-muted rounded-full animate-pulse" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="h-4 w-12 bg-muted rounded animate-pulse" />
          <div className="h-4 w-12 bg-muted rounded animate-pulse" />
        </div>
      </div>
    }>
      <PriceRangeFilterContent {...props} />
    </Suspense>
  )
} 