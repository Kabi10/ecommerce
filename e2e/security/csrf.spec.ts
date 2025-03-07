import { test, expect } from '@playwright/test';

test.describe('CSRF Protection', () => {
  test('should include CSRF token in forms', async ({ page }) => {
    await page.goto('/auth/signin');
    const csrfToken = await page.getAttribute('input[name="csrfToken"]', 'value');
    expect(csrfToken).toBeTruthy();
  });

  test('should reject form submission without CSRF token', async ({ page }) => {
    // Attempt to submit form without CSRF token
    await page.route('/api/auth/callback/credentials', async (route) => {
      await route.fulfill({
        status: 403,
        body: 'Invalid CSRF token',
      });
    });

    await page.goto('/auth/signin');
    await page.evaluate(() => {
      document.querySelector('input[name="csrfToken"]')?.remove();
    });

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page.getByText('Invalid CSRF token')).toBeVisible();
  });

  test('should reject API requests without CSRF token', async ({ page }) => {
    await page.goto('/');
    
    const response = await page.request.post('/api/cart/add', {
      data: { productId: '1' },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(403);
    expect(await response.text()).toContain('Invalid CSRF token');
  });

  test('should accept valid CSRF token in API requests', async ({ page }) => {
    await page.goto('/');
    
    // Get CSRF token from meta tag
    const csrfToken = await page.getAttribute('meta[name="csrf-token"]', 'content');
    
    const response = await page.request.post('/api/cart/add', {
      data: { productId: '1' },
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken || '',
      },
    });

    expect(response.status()).toBe(200);
  });
}); 