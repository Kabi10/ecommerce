'use client'

import * as React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, SlidersHorizontal } from 'lucide-react'

interface Category {
  id: string
  name: string
}

interface FilterProps {
  categories: Category[]
}

function ProductFilters({ categories }: FilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [priceRange, setPriceRange] = React.useState([0, 1000])
  const [showMobileFilters, setShowMobileFilters] = React.useState(false)

  // Create a new URLSearchParams instance to modify
  const createQueryString = (params: Record<string, string | string[]>) => {
    const newSearchParams = new URLSearchParams(searchParams?.toString())
    
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        newSearchParams.delete(key)
        value.forEach((v) => newSearchParams.append(key, v))
      } else {
        newSearchParams.set(key, value)
      }
    })

    return newSearchParams.toString()
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    router.push(
      pathname + '?' + createQueryString({
        minPrice: value[0].toString(),
        maxPrice: value[1].toString(),
      })
    )
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const currentCategories = searchParams?.getAll('category') || []
    const newCategories = checked
      ? [...currentCategories, categoryId]
      : currentCategories.filter(id => id !== categoryId)
    
    router.push(
      pathname + '?' + createQueryString({
        category: newCategories,
      })
    )
  }

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const searchQuery = formData.get('search')?.toString() || ''
    
    router.push(
      pathname + '?' + createQueryString({
        search: searchQuery,
      })
    )
  }

  const filters = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Search</h3>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            name="search"
            placeholder="Search products..."
            defaultValue={searchParams?.get('search') || ''}
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Price Range</h3>
        <div className="px-2">
          <Slider
            defaultValue={[
              parseInt(searchParams?.get('minPrice') || '0'),
              parseInt(searchParams?.get('maxPrice') || '1000'),
            ]}
            max={1000}
            step={10}
            onValueChange={handlePriceChange}
          />
          <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Categories</h3>
        <ScrollArea className="h-[200px]">
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={searchParams?.getAll('category')?.includes(category.id)}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(category.id, checked as boolean)
                  }
                />
                <label
                  htmlFor={category.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop filters */}
      <div className="hidden md:block sticky top-20 w-64 pr-8">
        {filters}
      </div>

      {/* Mobile filters */}
      <div className="md:hidden">
        <Button
          variant="outline"
          className="mb-4 w-full"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>
        {showMobileFilters && (
          <div className="mb-4">
            {filters}
          </div>
        )}
      </div>
    </>
  )
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // We'll fetch categories in the page component and pass them as a prop
  const [categories] = React.useState<Category[]>([])

  return (
    <div className="container py-8">
      <div className="flex gap-8">
        <ProductFilters categories={categories} />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
} 