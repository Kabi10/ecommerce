// Using Unsplash Source API for placeholder images
// Documentation: https://source.unsplash.com/

import { type ImageProps } from 'next/image'

// Stable Unsplash image IDs for different categories
const CATEGORY_IMAGES = {
  'Books & Literature': '1495446968020-f0f95c221cdc',
  'Textbooks & Educational': '1497633762106-0aef74e45c21',
  'Industrial & Electrical Equipment': '1581093806997-87c6d06d2da2',
  'Coins & Collectibles': '1622188686217-c8fdfc6ec066',
  default: '1517842645767-c639042777db'
} as const

const PRODUCT_IMAGES = {
  'Advanced Mathematics Textbook': '1497633762106-0aef74e45c21',
  'The Art of Programming': '1517842645767-c639042777db',
  'Emerson Control System': '1581093806997-87c6d06d2da2',
  'EATON Circuit Breaker': '1581094794767-c8c2ec9f9678',
  'Rare Silver Dollar 1921': '1622188686217-c8fdfc6ec066',
  default: '1517842645767-c639042777db'
} as const

const HERO_IMAGE = '1472851294608-062f824d29cc'

export interface ImageConfig extends Pick<ImageProps, 'priority'> {
  src: string
  width: number
  height: number
  alt: string
  quality?: number
  fallback?: string
}

// Use a CDN-backed URL for better performance and caching
export const getUnsplashUrl = (id: string, width: number, height: number, quality: number = 75): string => {
  if (!id) return getUnsplashUrl(PRODUCT_IMAGES.default, width, height, quality)
  
  try {
    // Ensure the ID starts with https:// for Next.js Image component
    const imageUrl = `https://images.unsplash.com/photo-${id}`
    const params = new URLSearchParams({
      auto: 'format',
      fit: 'crop',
      w: width.toString(),
      h: height.toString(),
      q: quality.toString()
    })
    
    return `${imageUrl}?${params.toString()}`
  } catch (error) {
    console.error('Error constructing Unsplash URL:', error)
    // Return default image URL if there's an error
    return getUnsplashUrl(PRODUCT_IMAGES.default, width, height, quality)
  }
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
    fallback: getUnsplashUrl(CATEGORY_IMAGES.default, width, height)
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
    fallback: getUnsplashUrl(PRODUCT_IMAGES.default, 800, 600)
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
    priority: true,
    fallback: getUnsplashUrl(PRODUCT_IMAGES.default, 1920, 600)
  }
}

// Fallback image in case of errors
export const getFallbackImage = (): ImageConfig => {
  return {
    src: getUnsplashUrl(PRODUCT_IMAGES.default, 800, 600),
    width: 800,
    height: 600,
    alt: 'Product image placeholder',
    fallback: getUnsplashUrl(PRODUCT_IMAGES.default, 800, 600)
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