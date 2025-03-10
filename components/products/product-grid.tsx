'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { Star } from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { ProductImage } from '@/components/ui/product-image'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: {
    id: string
    name: string
  }
  reviews: {
    rating: number
  }[]
}

interface ProductGridProps {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function ProductGrid({ products, pagination }: ProductGridProps) {
  const cart = useCart()

  const handleAddToCart = (product: Product) => {
    cart.addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: `/api/images/search?query=${encodeURIComponent(product.name)}`,
    })
  }

  const getAverageRating = (reviews: { rating: number }[]) => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return Math.round(sum / reviews.length)
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const averageRating = getAverageRating(product.reviews)

          return (
            <Card key={product.id} className="flex flex-col h-full overflow-hidden">
              <Link href={`/products/${product.id}`} className="block">
                <div className="aspect-square w-full overflow-hidden">
                  <ProductImage 
                    productName={product.name}
                    width={400}
                    height={400}
                    className="w-full h-full transition-transform hover:scale-105"
                  />
                </div>
              </Link>
              <div className="flex flex-col flex-1 p-4">
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-1.5">
                    {product.category.name}
                  </div>
                  <Link
                    href={`/products/${product.id}`}
                    className="block font-medium hover:text-primary line-clamp-1 mb-1"
                    prefetch={false}
                  >
                    {product.name}
                  </Link>
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 h-10 mb-2">
                      {product.description}
                    </p>
                  )}
                </div>
                <div className="mt-auto space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < averageRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviews.length})
                      </span>
                    </div>
                    <span className="font-medium">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <div className="inline-flex rounded-md shadow-sm">
            {[...Array(pagination.totalPages)].map((_, i) => {
              const page = i + 1
              const isCurrentPage = page === pagination.page

              return (
                <Link
                  key={page}
                  href={`/products?page=${page}`}
                  className={`relative inline-flex items-center px-3 py-2 text-sm font-medium ${
                    isCurrentPage
                      ? 'z-10 bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  } ${
                    i === 0 ? 'rounded-l-md' : ''
                  } ${
                    i === pagination.totalPages - 1 ? 'rounded-r-md' : ''
                  } border ${
                    i !== pagination.totalPages - 1 ? 'border-r-0' : ''
                  }`}
                >
                  {page}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
} 