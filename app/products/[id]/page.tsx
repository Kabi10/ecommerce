'use client'

import { getProductImage } from '@/lib/image-utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Image } from '@/components/ui/image'

// Mock data for a single product
const product = {
  id: '1',
  name: 'Advanced Mathematics Textbook',
  price: 79.99,
  description: 'A comprehensive guide for advanced mathematics, covering topics from calculus to linear algebra. Perfect for university students and mathematics enthusiasts.',
  category: 'Textbooks & Educational',
  features: [
    'In-depth coverage of advanced mathematical concepts',
    'Includes practice problems and solutions',
    'Written by leading mathematics professors',
    'Updated with latest mathematical theories',
  ],
  specifications: {
    'Publisher': 'Academic Press',
    'Edition': '3rd Edition',
    'Pages': '850',
    'Language': 'English',
    'ISBN': '978-0-12-345678-9',
  },
}

// Transform data to include images
const productWithImages = {
  ...product,
  images: [
    getProductImage(product.name),
    getProductImage(product.name + ' 2'),
    getProductImage(product.name + ' 3'),
  ],
}

export default function ProductPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg">
            <Image {...productWithImages.images[0]} className="h-96 w-full object-cover" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {productWithImages.images.slice(1).map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg">
                <Image {...image} className="h-24 w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{productWithImages.name}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{productWithImages.category}</p>
          </div>

          <div>
            <p className="text-2xl font-bold">${productWithImages.price.toFixed(2)}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="mt-2 text-muted-foreground">{productWithImages.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Key Features</h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
              {productWithImages.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">Specifications</h2>
              <div className="mt-2 grid gap-2">
                {Object.entries(productWithImages.specifications).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2">
                    <span className="text-muted-foreground">{key}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button size="lg" className="w-full">
              Add to Cart
            </Button>
            <Button size="lg" variant="outline" className="w-full">
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 