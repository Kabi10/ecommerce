'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/use-debounce'

interface ProductSearchProps {
  className?: string
  placeholder?: string
}

export function ProductSearch({ className, placeholder = 'Search products...' }: ProductSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = React.useState(
    searchParams.get('search') || ''
  )

  const debouncedSearch = useDebounce(searchQuery, 300)

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (debouncedSearch) {
      params.set('search', debouncedSearch)
    } else {
      params.delete('search')
    }
    router.push(`/products?${params.toString()}`)
  }, [debouncedSearch, router, searchParams])

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Search</h3>
      <div className={`relative ${className}`}>
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  )
} 