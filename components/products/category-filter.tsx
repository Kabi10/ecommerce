'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Suspense } from 'react'

interface CategoryFilterProps {
  categories: {
    id: string
    name: string
  }[]
}

function CategoryFilterContent({ categories }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category')

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryId) {
      params.set('category', categoryId)
    } else {
      params.delete('category')
    }
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div>
      <h3 className="text-sm font-medium mb-4">Categories</h3>
      <RadioGroup
        defaultValue={selectedCategory || ''}
        onValueChange={handleCategoryChange}
      >
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="all" />
            <Label htmlFor="all">All Categories</Label>
          </div>
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <RadioGroupItem value={category.id} id={category.id} />
              <Label htmlFor={category.id}>{category.name}</Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}

export function CategoryFilter(props: CategoryFilterProps) {
  return (
    <Suspense fallback={
      <div>
        <h3 className="text-sm font-medium mb-4">Categories</h3>
        <div className="space-y-3 animate-pulse">
          <div className="h-6 bg-muted rounded-md w-3/4" />
          <div className="h-6 bg-muted rounded-md w-2/3" />
          <div className="h-6 bg-muted rounded-md w-4/5" />
        </div>
      </div>
    }>
      <CategoryFilterContent {...props} />
    </Suspense>
  )
} 