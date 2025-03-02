// Using Unsplash Source API for placeholder images
// Documentation: https://source.unsplash.com/

export const getPlaceholderImage = (category: string, size: string = '800x600') => {
  // Clean and encode the category name for the search query
  const query = encodeURIComponent(category.replace(/[^a-zA-Z0-9 ]/g, ''))
  return `https://source.unsplash.com/random/${size}/?${query}`
}

// Specific category image generators
export const getProductImage = (productName: string) => {
  return getPlaceholderImage(`product ${productName}`)
}

export const getCategoryImage = (categoryName: string) => {
  return getPlaceholderImage(categoryName)
}

export const getHeroImage = () => {
  return getPlaceholderImage('ecommerce store shopping retail', '1920x600')
}

// Fallback image in case of errors
export const getFallbackImage = () => {
  return 'https://source.unsplash.com/random/800x600/?product'
} 