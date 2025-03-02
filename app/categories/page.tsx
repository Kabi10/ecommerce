import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { CategoryCard } from '@/components/category/category-card'

export const metadata: Metadata = {
  title: 'Categories | EStore',
  description: 'Browse all product categories',
}

async function getCategories() {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  })
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Categories</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            productCount={category._count.products}
          />
        ))}
      </div>
    </div>
  )
} 