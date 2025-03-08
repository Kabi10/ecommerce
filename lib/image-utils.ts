// Using Unsplash Source API for placeholder images
// Documentation: https://source.unsplash.com/

import { type ImageProps } from 'next/image'

// Stable Unsplash image IDs for different categories
const CATEGORY_IMAGES = {
  'Books & Literature': '1544716278-ca5e3f4abd8c',
  'Textbooks & Educational': '1532012197267-da84d127e765',
  'Industrial & Electrical Equipment': '1581091226825-a6a2a5aaa9df',
  'Coins & Collectibles': '1610375461246-d7e0fb438f70',
  default: '1472851294608-062f824d29cc'
} as const

export const PRODUCT_IMAGES = {
  'Advanced Mathematics Textbook': '1532012197267-da84d127e765',
  'The Art of Programming': '1555066931-4365d14bab8c',
  'Emerson Control System': '1581091226825-a6a2a5aaa9df',
  'EATON Circuit Breaker': '1581094794767-c8c2ec9f9678',
  'Rare Silver Dollar 1921': '1610375461246-d7e0fb438f70',
  default: '1472851294608-062f824d29cc'
} as const

// Cache for Google image search results
const GOOGLE_IMAGE_CACHE: Record<string, string> = {}

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

// Fetch product image from Google Custom Search API
export const fetchGoogleImage = async (query: string): Promise<string | null> => {
  // Check cache first
  if (GOOGLE_IMAGE_CACHE[query]) {
    return GOOGLE_IMAGE_CACHE[query]
  }
  
  // Use a fallback if no API key is available
  if (!process.env.GOOGLE_CSE_API_KEY || !process.env.GOOGLE_CSE_ID) {
    console.warn('Google CSE API key or ID not set, using fallback image')
    return null
  }
  
  try {
    const searchQuery = `${query} product`
    const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_CSE_API_KEY}&cx=${process.env.GOOGLE_CSE_ID}&q=${encodeURIComponent(searchQuery)}&searchType=image&num=1&imgSize=large&safe=active`
    
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.items && data.items.length > 0) {
      const imageUrl = data.items[0].link
      // Cache the result
      GOOGLE_IMAGE_CACHE[query] = imageUrl
      return imageUrl
    }
    
    return null
  } catch (error) {
    console.error('Error fetching Google image:', error)
    return null
  }
}

// Generate a deterministic image URL based on product name
export const getGeneratedImageUrl = (productName: string, width = 800, height = 600): string => {
  // Create a hash from the product name for deterministic results
  const hash = Array.from(productName)
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    .toString(16)
    .substring(0, 6)
  
  // Use a placeholder service with the hash for color
  return `https://placehold.co/${width}x${height}/${hash}/FFFFFF?text=${encodeURIComponent(productName)}`
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
  // Try to find a predefined image first
  const productKey = Object.keys(PRODUCT_IMAGES).find(key =>
    productName.toLowerCase().includes(key.toLowerCase())
  )

  if (productKey) {
    const id = PRODUCT_IMAGES[productKey as keyof typeof PRODUCT_IMAGES]
    return {
      src: getUnsplashUrl(id, 800, 600),
      width: 800,
      height: 600,
      alt: `Product image of ${productName}`,
      fallback: getUnsplashUrl(PRODUCT_IMAGES.default, 800, 600)
    }
  }
  
  // If no predefined image, use a generated placeholder
  // This ensures we always have an image even before Google search completes
  return {
    src: getGeneratedImageUrl(productName),
    width: 800,
    height: 600,
    alt: `Product image of ${productName}`,
    fallback: getUnsplashUrl(PRODUCT_IMAGES.default, 800, 600)
  }
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
  }
}

export const getFallbackImage = (): ImageConfig => {
  return {
    src: getUnsplashUrl(PRODUCT_IMAGES.default, 800, 600),
    width: 800,
    height: 600,
    alt: 'Fallback image',
  }
}

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