import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login and add item to cart
    await page.goto('/auth/signin')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.goto('/products/test-product')
    await page.click('button:has-text("Add to Cart")')
  })

  test('should complete checkout process', async ({ page }) => {
    await page.goto('/cart')
    await page.click('button:has-text("Checkout")')
    
    // Shipping details
    await page.fill('input[name="street"]', '123 Test St')
    await page.fill('input[name="city"]', 'Test City')
    await page.fill('input[name="state"]', 'Test State')
    await page.fill('input[name="postalCode"]', '12345')
    await page.fill('input[name="country"]', 'Test Country')
    await page.click('button:has-text("Continue to Payment")')
    
    // Payment details (using test card)
    const stripeFrame = page.frameLocator('iframe[name*="stripe"]')
    await stripeFrame.locator('[placeholder="Card number"]').fill('4242424242424242')
    await stripeFrame.locator('[placeholder="MM / YY"]').fill('1234')
    await stripeFrame.locator('[placeholder="CVC"]').fill('123')
    
    await page.click('button:has-text("Complete Order")')
    await expect(page.locator('text=Order Confirmed')).toBeVisible()
  })

  test('should show error for invalid payment', async ({ page }) => {
    await page.goto('/cart')
    await page.click('button:has-text("Checkout")')
    
    // Fill shipping details
    await page.fill('input[name="street"]', '123 Test St')
    await page.fill('input[name="city"]', 'Test City')
    await page.fill('input[name="state"]', 'Test State')
    await page.fill('input[name="postalCode"]', '12345')
    await page.fill('input[name="country"]', 'Test Country')
    await page.click('button:has-text("Continue to Payment")')
    
    // Use invalid card
    const stripeFrame = page.frameLocator('iframe[name*="stripe"]')
    await stripeFrame.locator('[placeholder="Card number"]').fill('4000000000000002')
    await stripeFrame.locator('[placeholder="MM / YY"]').fill('1234')
    await stripeFrame.locator('[placeholder="CVC"]').fill('123')
    
    await page.click('button:has-text("Complete Order")')
    await expect(page.locator('text=Your card was declined')).toBeVisible()
  })

  test('should update cart quantities', async ({ page }) => {
    await page.goto('/cart')
    await page.click('button:has-text("+")')
    await expect(page.locator('input[type="number"]')).toHaveValue('2')
    await page.click('button:has-text("-")')
    await expect(page.locator('input[type="number"]')).toHaveValue('1')
  })

  test('should remove items from cart', async ({ page }) => {
    await page.goto('/cart')
    await page.click('button:has-text("Remove")')
    await expect(page.locator('text=Your cart is empty')).toBeVisible()
  })
}) 