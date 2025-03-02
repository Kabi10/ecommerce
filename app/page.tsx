import Link from 'next/link'
import Image from 'next/image'
import { PrismaClient } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, ShoppingCart, Tag, Truck } from 'lucide-react'
import { getHeroImage, getCategoryImage, getProductImage } from '@/lib/image-utils'

const prisma = new PrismaClient()

async function getHomePageData() {
  const categories = await prisma.category.findMany({
    take: 4,
  })

  const featuredProducts = await prisma.product.findMany({
    take: 4,
    include: {
      category: true,
      reviews: {
        select: {
          rating: true,
        },
      },
    },
  })

  return {
    categories: categories.map(category => ({
      ...category,
      image: getCategoryImage(category.name)
    })),
    featuredProducts: featuredProducts.map(product => ({
      ...product,
      images: [getProductImage(product.name)],
      averageRating: product.reviews.length > 0
        ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
        : 0,
    })),
  }
}

export default async function Home() {
  const { categories, featuredProducts } = await getHomePageData()
  const heroImage = getHeroImage()

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={heroImage}
            alt="Hero background"
            fill
            className="object-cover opacity-50"
            priority
          />
        </div>
        <div className="relative z-10 text-center space-y-6 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold">Your One-Stop Shop for Everything</h1>
          <p className="text-xl">Discover amazing products at unbeatable prices</p>
          <Button size="lg" asChild>
            <Link href="/products">
              Shop Now <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
              <Truck className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-sm text-gray-600">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ShoppingCart className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Secure Shopping</h3>
                <p className="text-sm text-gray-600">100% secure payment</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Tag className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Best Prices</h3>
                <p className="text-sm text-gray-600">Price match guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Shop by Category</h2>
            <Button variant="outline" asChild>
              <Link href="/categories">View All Categories</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="relative h-48 w-full">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle>{category.name}</CardTitle>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button variant="outline" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="relative h-48 w-full">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500 mb-2">{product.category.name}</div>
                  <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                  <div className="mt-2 text-lg font-bold">${product.price.toString()}</div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
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
