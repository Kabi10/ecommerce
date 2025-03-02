'use server'

import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import { getProductImage } from '@/lib/image-utils'
import ProductDetails from './product-details'

const prisma = new PrismaClient()

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!product) {
    return null
  }

  return {
    ...product,
    price: Number(product.price),
    image: getProductImage(product.name),
    averageRating:
      product.reviews.length > 0
        ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
          product.reviews.length
        : 0,
  }
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      id: { not: currentProductId },
    },
    include: {
      category: true,
      reviews: {
        include: {
          user: true,
        },
      },
    },
    take: 4,
  })

  return products.map((product) => ({
    ...product,
    price: Number(product.price),
    image: getProductImage(product.name),
    averageRating:
      product.reviews.length > 0
        ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
          product.reviews.length
        : 0,
  }))
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: Props) {
  const id = (await params).id
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(
    product.categoryId,
    product.id
  )

  return <ProductDetails product={product} relatedProducts={relatedProducts} />
} 