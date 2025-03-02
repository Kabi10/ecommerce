'use client'

import * as React from 'react'
import NextImage, { ImageProps as NextImageProps } from 'next/image'
import { cn } from '@/lib/utils'
import { getFallbackImage, handleImageError } from '@/lib/image-utils'

interface ImageProps extends Omit<NextImageProps, 'onError'> {
  fallback?: string
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, alt, fallback, ...props }, ref) => {
    const [error, setError] = React.useState(false)
    const fallbackImage = getFallbackImage()

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      console.warn(`Image load failed for: ${props.src}`)
      setError(true)
      handleImageError(e)
    }

    return (
      <div className={cn('relative overflow-hidden', className)}>
        <NextImage
          ref={ref}
          alt={alt}
          className={cn(
            'object-cover transition-opacity duration-300',
            error ? 'opacity-0' : 'opacity-100'
          )}
          onError={handleError}
          {...props}
        />
        {error && (
          <NextImage
            alt={`Fallback for ${alt}`}
            src={fallback || fallbackImage.src}
            className="absolute inset-0 object-cover"
            fill
            sizes="100vw"
            priority={false}
          />
        )}
      </div>
    )
  }
)
Image.displayName = 'Image'

export { Image }
export type { ImageProps } 