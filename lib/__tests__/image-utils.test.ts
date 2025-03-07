import {
  getUnsplashUrl,
  getPlaceholderImage,
  getProductImage,
  getCategoryImage,
  getHeroImage,
  getFallbackImage,
  handleImageError,
  PRODUCT_IMAGES,
} from '../image-utils'

describe('Image Utilities', () => {
  describe('getUnsplashUrl', () => {
    it('should generate correct Unsplash URL with default quality', () => {
      const url = getUnsplashUrl('test-id', 800, 600)
      expect(url).toBe('https://images.unsplash.com/photo-test-id?auto=format&fit=crop&w=800&h=600&q=75')
    })

    it('should generate URL with custom quality', () => {
      const url = getUnsplashUrl('test-id', 800, 600, 90)
      expect(url).toBe('https://images.unsplash.com/photo-test-id?auto=format&fit=crop&w=800&h=600&q=90')
    })

    it('should return fallback URL for empty ID', () => {
      const url = getUnsplashUrl('', 800, 600)
      expect(url).toContain('1472851294608-062f824d29cc')
    })

    it('should handle URL construction errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const invalidId = { toString: () => { throw new Error('Invalid ID') } }
      const url = getUnsplashUrl(invalidId as any, 800, 600)
      expect(url).toContain('1472851294608-062f824d29cc')
      expect(consoleSpy).toHaveBeenCalledWith('Error constructing Unsplash URL:', expect.any(Error))
      consoleSpy.mockRestore()
    })
  })

  describe('getPlaceholderImage', () => {
    it('should return correct image config for known category', () => {
      const config = getPlaceholderImage('Books & Literature')
      expect(config.src).toContain('1544716278-ca5e3f4abd8c')
      expect(config.width).toBe(800)
      expect(config.height).toBe(600)
      expect(config.alt).toBe('Books & Literature category image')
    })

    it('should return default image for unknown category', () => {
      const config = getPlaceholderImage('Unknown Category')
      expect(config.src).toContain('1472851294608-062f824d29cc')
    })
  })

  describe('getProductImage', () => {
    it('should return correct image config for known product', () => {
      const config = getProductImage('Advanced Mathematics Textbook')
      expect(config.src).toContain('1532012197267-da84d127e765')
      expect(config.width).toBe(800)
      expect(config.height).toBe(600)
      expect(config.alt).toBe('Product image of Advanced Mathematics Textbook')
    })

    it('should return default image for unknown product', () => {
      const config = getProductImage('Unknown Product')
      expect(config.src).toContain('1472851294608-062f824d29cc')
    })
  })

  describe('getCategoryImage', () => {
    it('should return placeholder image config', () => {
      const config = getCategoryImage('Books & Literature')
      expect(config.src).toContain('1544716278-ca5e3f4abd8c')
    })
  })

  describe('getHeroImage', () => {
    it('should return hero image config', () => {
      const config = getHeroImage()
      expect(config.src).toContain('1472851294608-062f824d29cc')
      expect(config.width).toBe(1920)
      expect(config.height).toBe(600)
      expect(config.priority).toBe(true)
    })
  })

  describe('getFallbackImage', () => {
    it('should return fallback image config', () => {
      const config = getFallbackImage()
      expect(config.src).toContain('1472851294608-062f824d29cc')
      expect(config.width).toBe(800)
      expect(config.height).toBe(600)
    })
  })

  describe('Image Error Handling', () => {
    it('should handle image load errors', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation()
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      const mockEvent = {
        currentTarget: {
          src: 'https://example.com/invalid-image.jpg',
          classList: {
            add: jest.fn(),
          },
        },
      }

      // Test first failure (non-fallback image)
      handleImageError(mockEvent as any)
      expect(consoleWarnSpy).toHaveBeenCalledWith('Image load failed: https://example.com/invalid-image.jpg')
      expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringContaining('Falling back to default image'))
      expect(mockEvent.currentTarget.src).toContain('1472851294608-062f824d29cc')

      // Test fallback image failure
      mockEvent.currentTarget.src = getUnsplashUrl(PRODUCT_IMAGES.default, 800, 600)
      handleImageError(mockEvent as any)
      expect(consoleErrorSpy).toHaveBeenCalledWith('Fallback image also failed to load')

      expect(mockEvent.currentTarget.classList.add).toHaveBeenCalledWith('image-load-error')

      consoleWarnSpy.mockRestore()
      consoleInfoSpy.mockRestore()
      consoleErrorSpy.mockRestore()
    })
  })
}) 