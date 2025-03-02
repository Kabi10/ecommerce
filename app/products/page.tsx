'use server'

import { PrismaClient } from '@prisma/client'
import { getProductImage } from '@/lib/image-utils'
import ProductGrid from './product-grid'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const prisma = new PrismaClient()

type Props = {
  searchParams: Promise<{
    search?: string
    category?: string[]
    minPrice?: string
    maxPrice?: string
    page?: string
  }>
}

async function getProducts(searchParams: Awaited<Props['searchParams']>) {
  const page = Number(searchParams.page) || 1
  const pageSize = 12

  // Build the where clause based on search params
  const where = {
    AND: [
      // Search query
      searchParams.search
        ? {
            OR: [
              { name: { contains: searchParams.search, mode: 'insensitive' as const } },
              { description: { contains: searchParams.search, mode: 'insensitive' as const } },
            ],
          }
        : {},
      // Category filter
      searchParams.category?.length
        ? { categoryId: { in: searchParams.category } }
        : {},
      // Price range
      searchParams.minPrice || searchParams.maxPrice
        ? {
            price: {
              ...(searchParams.minPrice && { gte: parseFloat(searchParams.minPrice) }),
              ...(searchParams.maxPrice && { lte: parseFloat(searchParams.maxPrice) }),
            },
          }
        : {},
    ].filter(condition => Object.keys(condition).length > 0),
  }

  // Get products with pagination
  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      reviews: {
        include: {
          user: true,
        },
      },
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  })

  // Get total count for pagination
  const total = await prisma.product.count({ where })

  return {
    products: products.map(product => ({
      ...product,
      price: Number(product.price),
      image: getProductImage(product.name),
      averageRating: product.reviews.length > 0
        ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
        : 0,
    })),
    totalPages: Math.ceil(total / pageSize),
    currentPage: page,
  }
}

function ProductGridSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function ProductsPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const { products, totalPages, currentPage } = await getProducts(resolvedParams);
  return (
    <div>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid 
          products={products} 
          totalPages={totalPages} 
          currentPage={currentPage} 
          searchParams={resolvedParams}
        />
      </Suspense>
    </div>
  )
} 