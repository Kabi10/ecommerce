import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductDetails from './product-details'
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/schema'

interface PageProps {
  params: {
    id: string
  }
}

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: true,
    }
  })

  if (!product) {
    notFound()
  }

  return product
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  return prisma.product.findMany({
    where: {
      categoryId,
      id: { not: currentProductId }
    },
    include: {
      category: true,
      reviews: true,
    },
    take: 4
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.id)
  
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.map(image => ({
        url: image,
        width: 800,
        height: 600,
        alt: product.name
      }))
    }
  }
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProduct(params.id)
  const relatedProducts = await getRelatedProducts(product.categoryId, product.id)

  const productSchema = generateProductSchema(product)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Products', item: '/products' },
    { name: product.category.name, item: `/products?category=${product.categoryId}` },
    { name: product.name, item: `/products/${product.id}` }
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetails product={product} relatedProducts={relatedProducts} />
    </>
  )
} 