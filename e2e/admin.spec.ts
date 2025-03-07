import { test, expect } from '@playwright/test'

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/auth/signin')
    await page.fill('input[name="email"]', 'admin@example.com')
    await page.fill('input[name="password"]', 'adminpass123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/admin')
  })

  test('should display key metrics', async ({ page }) => {
    await expect(page.locator('text=Total Revenue')).toBeVisible()
    await expect(page.locator('text=Total Orders')).toBeVisible()
    await expect(page.locator('text=Total Customers')).toBeVisible()
  })

  test('should manage products', async ({ page }) => {
    await page.click('text=Products')
    await page.click('button:has-text("Add Product")')
    
    // Fill product details
    await page.fill('input[name="name"]', 'Test Product')
    await page.fill('textarea[name="description"]', 'Test Description')
    await page.fill('input[name="price"]', '99.99')
    await page.fill('input[name="stock"]', '100')
    await page.selectOption('select[name="category"]', 'Electronics')
    
    await page.click('button:has-text("Save")')
    await expect(page.locator('text=Product created successfully')).toBeVisible()
  })

  test('should manage orders', async ({ page }) => {
    await page.click('text=Orders')
    await expect(page.locator('table')).toBeVisible()
    
    // Update order status
    await page.click('text=Processing')
    await page.click('text=Shipped')
    await expect(page.locator('text=Order status updated')).toBeVisible()
  })

  test('should show analytics data', async ({ page }) => {
    await page.click('text=Analytics')
    await expect(page.locator('canvas')).toHaveCount(3) // Charts
    
    // Date range selection
    await page.click('[aria-label="Date Range"]')
    await page.click('text=Last 30 Days')
    await expect(page.locator('text=Data updated')).toBeVisible()
  })

  test('should manage inventory', async ({ page }) => {
    await page.click('text=Inventory')
    
    // Update stock
    await page.click('text=Edit Stock')
    await page.fill('input[name="stock"]', '150')
    await page.click('button:has-text("Update")')
    await expect(page.locator('text=Stock updated successfully')).toBeVisible()
    
    // Low stock alerts
    await expect(page.locator('text=Low Stock Alert')).toBeVisible()
  })

  test('should handle customer management', async ({ page }) => {
    await page.click('text=Customers')
    
    // Search customer
    await page.fill('input[placeholder="Search customers..."]', 'test@example.com')
    await expect(page.locator('text=test@example.com')).toBeVisible()
    
    // View customer details
    await page.click('text=View Details')
    await expect(page.locator('text=Order History')).toBeVisible()
    await expect(page.locator('text=Customer Information')).toBeVisible()
  })
}) 