'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/app/types'
import { Suspense } from 'react'
import { Pagination } from './pagination'

interface ProductGridProps {
  products: Product[]
  totalPages: number
  currentPage: number
  searchParams: Record<string, string | string[]>
}

export default function ProductGrid({ products, totalPages, currentPage, searchParams }: ProductGridProps) {
  const cart = useCart()

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="group overflow-hidden">
            <Link href={`/products/${product.id}`}>
              <CardHeader className="p-0">
                <div className="relative aspect-square">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </CardHeader>
            </Link>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">
                {product.category.name}
              </div>
              <Link
                href={`/products/${product.id}`}
                className="hover:underline"
              >
                <h3 className="font-medium">{product.name}</h3>
              </Link>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-lg font-semibold">
                  {formatPrice(product.price)}
                </p>
                <div className="flex items-center">
                  {/* Star rating */}
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(product.averageRating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-1 text-sm text-muted-foreground">
                    ({product.reviews.length})
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button 
                className="w-full"
                onClick={() => 
                  cart.addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                  })
                }
              >
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <Suspense>
        <Pagination totalPages={totalPages} />
      </Suspense>
    </div>
  )
} 