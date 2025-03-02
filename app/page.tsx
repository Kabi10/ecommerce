'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getHeroImage, getCategoryImage, getProductImage } from '@/lib/image-utils'
import { Image } from '@/components/ui/image'

// Mock data for categories
const categories = [
  { id: '1', name: 'Books & Literature', description: 'Fiction, non-fiction, and more' },
  { id: '2', name: 'Textbooks & Educational', description: 'Academic and learning materials' },
  { id: '3', name: 'Industrial & Electrical Equipment', description: 'Professional grade equipment' },
  { id: '4', name: 'Coins & Collectibles', description: 'Rare and valuable items' },
]

// Mock data for featured products
const featuredProducts = [
  {
    id: '1',
    name: 'Advanced Mathematics Textbook',
    price: 79.99,
    description: 'Comprehensive guide for advanced mathematics',
  },
  {
    id: '2',
    name: 'The Art of Programming',
    price: 49.99,
    description: 'Learn programming from experts',
  },
  {
    id: '3',
    name: 'Emerson Control System',
    price: 599.99,
    description: 'Industrial-grade control system',
  },
]

// Transform data to include images
const categoriesWithImages = categories.map(category => ({
  ...category,
  image: getCategoryImage(category.name)
}))

const productsWithImages = featuredProducts.map(product => ({
  ...product,
  images: [getProductImage(product.name)],
}))

export default function Home() {
  const heroImage = getHeroImage()

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full">
        <Image {...heroImage} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/25">
          <div className="container mx-auto flex h-full items-center px-4">
            <div className="max-w-xl text-white">
              <h1 className="mb-4 text-4xl font-bold">Welcome to Our Store</h1>
              <p className="mb-6 text-lg">Discover amazing products at great prices</p>
              <Button asChild>
                <Link href="/products">Shop Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-3xl font-bold">Shop by Category</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categoriesWithImages.map((category) => (
              <Card key={category.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <Image {...category.image} className="h-48 w-full object-cover" />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button asChild variant="secondary" className="w-full">
                    <Link href={`/products?category=${category.name}`}>View Products</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-3xl font-bold">Featured Products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productsWithImages.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <Image {...product.images[0]} className="h-48 w-full object-cover" />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
                  <p className="mt-2 text-lg font-bold">${product.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button asChild className="w-full">
                    <Link href={`/products/${product.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
