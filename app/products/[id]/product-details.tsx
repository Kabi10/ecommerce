'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Star } from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/app/types'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface ProductDetailsProps {
  product: Product
  relatedProducts: Product[]
}

export default function ProductDetails({ product, relatedProducts }: ProductDetailsProps) {
  const cart = useCart()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  // This ensures hydration issues don't cause flickering
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleAddToCart = () => {
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  if (!isClient) {
    return <div className="container py-10">Loading...</div>
  }

  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {product.category.name}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(product.averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.reviews.length} reviews
            </span>
          </div>

          <p className="text-3xl font-bold">{formatPrice(product.price)}</p>

          <p className="text-muted-foreground">{product.description}</p>

          <Button 
            size="lg" 
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white" 
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <Separator className="my-8" />
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <div className="mt-6 grid gap-6">
          {product.reviews.length > 0 ? (
            product.reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.user.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-1 flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4">{review.comment || 'No comment provided'}</p>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <Separator className="my-8" />
          <h2 className="text-2xl font-bold">Related Products</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/products/${relatedProduct.id}`}
                prefetch={false}
                className="block"
              >
                <Card
                  className="group overflow-hidden h-full"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{relatedProduct.name}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-lg font-semibold">
                        {formatPrice(relatedProduct.price)}
                      </p>
                      <div className="flex items-center">
                        <Star
                          className={`h-4 w-4 ${
                            relatedProduct.averageRating > 0
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                        <span className="ml-1 text-sm text-muted-foreground">
                          ({relatedProduct.reviews.length})
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 