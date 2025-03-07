import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should allow user to sign in', async ({ page }) => {
    await page.goto('/auth/signin')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/signin')
    await page.fill('input[name="email"]', 'wrong@example.com')
    await page.fill('input[name="password"]', 'wrongpass')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Invalid credentials')).toBeVisible()
  })

  test('should allow user to sign up', async ({ page }) => {
    await page.goto('/auth/signup')
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'newuser@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
  })

  test('should allow password reset request', async ({ page }) => {
    await page.goto('/auth/reset-password')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Reset link sent')).toBeVisible()
  })
}) 