import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'

async function getCategories() {
  try {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      take: 3,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        category: true,
        reviews: true
      }
    })
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

export default async function Home() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts()
  ])

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full">
        <div className="relative h-full w-full">
          <Image
            src="/images/hero.webp"
            alt="Hero image"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            quality={90}
          />
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
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-3xl font-bold">Shop by Category</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Card key={category.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative aspect-video">
                    <Image
                      src={`/images/${category.name.toLowerCase().replace(/\s+/g, '-')}.webp`}
                      alt={category.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
                  <p className="mt-2 text-sm font-medium">
                    {category._count.products} {category._count.products === 1 ? 'Product' : 'Products'}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button asChild variant="secondary" className="w-full">
                    <Link href={`/products?category=${category.id}`}>View Products</Link>
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
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
                  <p className="mt-2 text-lg font-bold">{formatPrice(Number(product.price))}</p>
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
