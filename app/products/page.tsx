import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ProductGrid } from '@/components/products/product-grid'
import { ProductFilters } from '@/components/products/product-filters'
import { ProductSearch } from '@/components/products/product-search'
import { Decimal } from '@prisma/client/runtime/library'

export const metadata: Metadata = {
  title: 'Products | EStore',
  description: 'Browse all products in our store',
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

  const where = {
    ...(searchParams.category && {
      categoryId: searchParams.category,
    }),
    ...(searchParams.minPrice &&
      searchParams.maxPrice && {
        price: {
          gte: Number(searchParams.minPrice),
          lte: Number(searchParams.maxPrice),
        },
      }),
    ...(searchParams.search && {
      OR: [
        { name: { contains: searchParams.search, mode: 'insensitive' } },
        { description: { contains: searchParams.search, mode: 'insensitive' } },
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
  const [minPrice, maxPrice] = await Promise.all([
    prisma.product.findFirst({
      orderBy: { price: 'asc' },
      select: { price: true },
    }),
    prisma.product.findFirst({
      orderBy: { price: 'desc' },
      select: { price: true },
    }),
  ])

  return {
    minPrice: Number(minPrice?.price || 0),
    maxPrice: Number(maxPrice?.price || 1000),
  }
}

export default async function ProductsPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const { products, pagination } = await getProducts(resolvedSearchParams)
  const { minPrice, maxPrice } = await getMinMaxPrices()

  return (
    <div className="container py-8 md:py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-none">
          <div className="sticky top-4 space-y-6">
            <ProductSearch className="mb-6" />
            <ProductFilters
              minPrice={minPrice}
              maxPrice={maxPrice}
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
  )
} 