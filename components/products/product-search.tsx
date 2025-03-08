'use client'

import * as React from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { Suspense } from 'react'

interface ProductSearchProps {
  className?: string
  placeholder?: string
}

function SearchInput({ className, placeholder = 'Search products...' }: ProductSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  
  const [searchQuery, setSearchQuery] = React.useState(
    searchParams.get('search') || ''
  )

  const debouncedSearch = useDebounce(searchQuery, 300)

  React.useEffect(() => {
    // Only update URL if we're searching or already on the products page
    if (debouncedSearch || pathname.startsWith('/products')) {
      const params = new URLSearchParams(searchParams.toString())
      if (debouncedSearch) {
        params.set('search', debouncedSearch)
      } else {
        params.delete('search')
      }
      router.push(`/products?${params.toString()}`)
    }
  }, [debouncedSearch, router, searchParams, pathname])

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-8 w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search products"
      />
    </div>
  )
}

export function ProductSearch(props: ProductSearchProps) {
  return (
    <Suspense fallback={
      <div className={`relative ${props.className}`}>
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={props.placeholder}
          className="pl-8 w-full"
          disabled
          aria-label="Search products"
        />
      </div>
    }>
      <SearchInput {...props} />
    </Suspense>
  )
} 