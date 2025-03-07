import { Product } from '@prisma/client'

export function generateProductSchema(product: Product & { 
  category: { name: string }, 
  reviews: { rating: number }[] 
}) {
  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images[0],
    sku: product.sku,
    category: product.category.name,
    offers: {
      '@type': 'Offer',
      price: Number(product.price),
      priceCurrency: 'USD',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${process.env.SITE_URL}/products/${product.id}`
    },
    ...(averageRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating.toFixed(1),
        reviewCount: product.reviews.length
      }
    })
  }
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'EStore',
    url: process.env.SITE_URL,
    logo: `${process.env.SITE_URL}/logo.png`,
    sameAs: [
      'https://facebook.com/estore',
      'https://twitter.com/estore',
      'https://instagram.com/estore',
      'https://youtube.com/estore'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-555-5555',
      contactType: 'customer service',
      availableLanguage: ['English']
    }
  }
}

export function generateBreadcrumbSchema(items: { name: string, item: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${process.env.SITE_URL}${item.item}`
    }))
  }
} 