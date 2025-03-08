'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getProductImage, handleImageError } from '@/lib/image-utils'

interface ProductImageProps {
  productName: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
}

export function ProductImage({
  productName,
  width = 800,
  height = 600,
  priority = false,
  className = '',
}: ProductImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  
  // Get initial image from our utility
  useEffect(() => {
    const initialImage = getProductImage(productName)
    setImageSrc(initialImage.src)
    setIsLoading(false)
    
    // Try to fetch a better image from Google
    const fetchBetterImage = async () => {
      try {
        const response = await fetch(`/api/images/search?query=${encodeURIComponent(productName)}`)
        
        if (response.ok) {
          const data = await response.json()
          if (data.imageUrl) {
            setImageSrc(data.imageUrl)
          }
        }
      } catch (err) {
        console.error('Failed to fetch better image:', err)
        // Keep using the initial image, no need to set error
      }
    }
    
    fetchBetterImage()
  }, [productName])
  
  const handleError = () => {
    setError(true)
    // Fall back to a generated image
    const fallbackImage = getProductImage(productName)
    setImageSrc(fallbackImage.fallback || fallbackImage.src)
  }
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading ? (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      ) : (
        <Image
          src={imageSrc}
          alt={`Product image of ${productName}`}
          width={width}
          height={height}
          priority={priority}
          className={`object-cover w-full h-full transition-opacity duration-300 ${error ? 'opacity-80' : 'opacity-100'}`}
          onError={handleError}
        />
      )}
    </div>
  )
} 