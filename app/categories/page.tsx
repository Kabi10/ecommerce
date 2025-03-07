import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { CategoryCard } from '@/components/category/category-card'

export const metadata: Metadata = {
  title: 'Categories | EStore',
  description: 'Browse all product categories',
  openGraph: {
    title: 'Categories | EStore',
    description: 'Browse all product categories',
    type: 'website',
  }
}

async function getCategories() {
  const categories = await prisma.category.findMany()
  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const count = await prisma.product.count({
        where: { categoryId: category.id }
      })
      return { ...category, productCount: count }
    })
  )
  return categoriesWithCount
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Product Categories',
    description: 'Browse all product categories in our store',
    url: `${process.env.SITE_URL}/categories`,
    numberOfItems: categories.length,
    itemListElement: categories.map((category, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Thing',
        name: category.name,
        description: category.description,
        url: `${process.env.SITE_URL}/products?category=${category.id}`,
        image: category.image,
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <div className="container py-8 md:py-10">
        <h1 className="text-3xl font-bold mb-8">Categories</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              productCount={category.productCount}
            />
          ))}
        </div>
      </div>
    </>
  )
} 