// Using Unsplash Source API for placeholder images
// Documentation: https://source.unsplash.com/

import { type ImageProps } from 'next/image'

// Stable Unsplash image IDs for different categories
const CATEGORY_IMAGES = {
  'Books & Literature': '1497366216548-37526070297c',
  'Textbooks & Educational': '1532012197267-da84d127e765',
  'Industrial & Electrical Equipment': '1581091226825-a6a2a5aee158',
  'Coins & Collectibles': '1544711716-f5b5f667b1ef',
  default: '1481627834876-b7833e8f5570'
} as const

const PRODUCT_IMAGES = {
  'Advanced Mathematics Textbook': '1532012197267-da84d127e765',
  'The Art of Programming': '1516116412805-563d82d76e96',
  'Emerson Control System': '1581091226825-a6a2a5aee158',
  'EATON Circuit Breaker': '1581094794767-c8c2ec9f9678',
  'Rare Silver Dollar 1921': '1544711716-f5b5f667b1ef',
  default: '1481627834876-b7833e8f5570'
} as const

const HERO_IMAGE = '1556740758-90de374c12ad'

export interface ImageConfig {
  src: string
  width: number
  height: number
  alt: string
  quality?: number
  fallback?: string
}

// Use a CDN-backed URL for better performance and caching
export const getUnsplashUrl = (id: string, width: number, height: number, quality: number = 80): string => {
  if (!id) return getUnsplashUrl(PRODUCT_IMAGES.default, width, height, quality)
  
  // Use Unsplash's CDN URL format
  const baseUrl = 'https://images.unsplash.com/photo-'
  const params = new URLSearchParams({
    auto: 'format',
    fit: 'crop',
    w: width.toString(),
    h: height.toString(),
    q: quality.toString(),
  })
  
  return `${baseUrl}${id}?${params.toString()}`
}

export const getPlaceholderImage = (category: string, size: string = '800x600'): ImageConfig => {
  const [width, height] = size.split('x').map(Number)
  const categoryKey = Object.keys(CATEGORY_IMAGES).find(key => 
    category.toLowerCase().includes(key.toLowerCase())
  ) || 'default'
  
  const id = CATEGORY_IMAGES[categoryKey as keyof typeof CATEGORY_IMAGES]
  return {
    src: getUnsplashUrl(id, width, height),
    width,
    height,
    alt: `${category} category image`,
    fallback: CATEGORY_IMAGES.default
  }
}

export const getProductImage = (productName: string): ImageConfig => {
  const productKey = Object.keys(PRODUCT_IMAGES).find(key =>
    productName.toLowerCase().includes(key.toLowerCase())
  ) || 'default'

  const id = PRODUCT_IMAGES[productKey as keyof typeof PRODUCT_IMAGES]
  const config = {
    src: getUnsplashUrl(id, 800, 600),
    width: 800,
    height: 600,
    alt: `Product image of ${productName}`,
    fallback: PRODUCT_IMAGES.default
  }

  // Pre-warm the image by creating a new Image object
  if (typeof window !== 'undefined') {
    const img = new Image()
    img.src = config.src
  }

  return config
}

export const getCategoryImage = (categoryName: string): ImageConfig => {
  return getPlaceholderImage(categoryName)
}

export const getHeroImage = (): ImageConfig => {
  return {
    src: getUnsplashUrl(HERO_IMAGE, 1920, 600),
    width: 1920,
    height: 600,
    alt: 'Ecommerce store hero image',
    fallback: PRODUCT_IMAGES.default
  }
}

// Fallback image in case of errors
export const getFallbackImage = (): ImageConfig => {
  return {
    src: getUnsplashUrl(PRODUCT_IMAGES.default, 800, 600),
    width: 800,
    height: 600,
    alt: 'Product image placeholder',
    fallback: PRODUCT_IMAGES.default
  }
}

// Enhanced error handling with logging
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = event.currentTarget
  const fallbackUrl = getUnsplashUrl(PRODUCT_IMAGES.default, 800, 600)
  
  console.warn(`Image load failed: ${target.src}`)
  
  if (target.src !== fallbackUrl) {
    console.info(`Falling back to default image: ${fallbackUrl}`)
    target.src = fallbackUrl
  } else {
    console.error('Fallback image also failed to load')
  }
  
  // Add error class for styling
  target.classList.add('image-load-error')
} 