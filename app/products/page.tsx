import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ProductGrid } from '@/components/products/product-grid'
import { ProductFilters } from '@/components/products/product-filters'
import { ProductSearch } from '@/components/products/product-search'
import { Decimal } from '@prisma/client/runtime/library'
import { Prisma } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Products | EStore',
  description: 'Browse all products in our store',
  openGraph: {
    title: 'Products | EStore',
    description: 'Browse all products in our store',
    type: 'website',
  }
}

type SearchParams = {
  category?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
  page?: string
  search?: string
}

type PageProps = {
  params: Promise<Record<string, never>>
  searchParams: Promise<SearchParams>
}

async function getProducts(searchParams: SearchParams) {
  const page = Number(searchParams.page) || 1
  const limit = 12
  const skip = (page - 1) * limit

  const where: Prisma.ProductWhereInput = {
    ...(searchParams.category && {
      categoryId: searchParams.category,
    }),
    ...(searchParams.minPrice &&
      searchParams.maxPrice && {
        price: {
          gte: new Decimal(searchParams.minPrice),
          lte: new Decimal(searchParams.maxPrice),
        },
      }),
    ...(searchParams.search && {
      OR: [
        { name: { contains: searchParams.search, mode: Prisma.QueryMode.insensitive } },
        { description: { contains: searchParams.search, mode: Prisma.QueryMode.insensitive } },
      ],
    }),
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        reviews: true,
      },
      skip,
      take: limit,
      orderBy: {
        ...(searchParams.sort === 'price_asc' && { price: 'asc' }),
        ...(searchParams.sort === 'price_desc' && { price: 'desc' }),
        ...(searchParams.sort === 'name_asc' && { name: 'asc' }),
        ...(searchParams.sort === 'name_desc' && { name: 'desc' }),
        ...(!searchParams.sort && { createdAt: 'desc' }),
      },
    }),
    prisma.product.count({ where }),
  ])

  const productsWithNumberPrice = products.map(product => ({
    ...product,
    price: Number(product.price)
  }))

  const totalPages = Math.ceil(total / limit)

  return {
    products: productsWithNumberPrice,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  }
}

async function getMinMaxPrices() {
  const result = await prisma.product.aggregate({
    _min: { price: true },
    _max: { price: true },
  })

  return {
    minPrice: Number(result._min.price) || 0,
    maxPrice: Number(result._max.price) || 1000,
  }
}

async function getCategories() {
  return prisma.category.findMany()
}

export default async function ProductsPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const { products, pagination } = await getProducts(resolvedSearchParams)
  const { minPrice, maxPrice } = await getMinMaxPrices()
  const categories = await getCategories()

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Products | EStore',
    description: 'Browse all products in our store',
    url: `${process.env.SITE_URL}/products`,
    numberOfItems: pagination.total,
    hasPart: products.map(product => ({
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images[0],
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'USD',
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <div className="container py-8 md:py-10">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 flex-none">
            <div className="sticky top-4 space-y-6">
              <ProductSearch className="mb-6" />
              <ProductFilters
                minPrice={minPrice}
                maxPrice={maxPrice}
                categories={categories}
              />
            </div>
          </aside>
          <main className="flex-1">
            <ProductGrid
              products={products}
              pagination={pagination}
            />
          </main>
        </div>
      </div>
    </>
  )
} 