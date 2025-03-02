'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Category {
  id: string
  name: string
  _count: {
    products: number
  }
}

export function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categories, setCategories] = React.useState<Category[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentCategories = params.getAll('category')
    
    if (checked) {
      params.append('category', categoryId)
    } else {
      const newCategories = currentCategories.filter(id => id !== categoryId)
      params.delete('category')
      newCategories.forEach(cat => params.append('category', cat))
    }
    
    router.push(`/products?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center space-x-2">
            <Checkbox
              id={category.id}
              checked={searchParams.getAll('category').includes(category.id)}
              onCheckedChange={(checked) => 
                handleCategoryChange(category.id, checked as boolean)
              }
            />
            <label
              htmlFor={category.id}
              className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {category.name}
              <span className="ml-1 text-muted-foreground">
                ({category._count.products})
              </span>
            </label>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
} 