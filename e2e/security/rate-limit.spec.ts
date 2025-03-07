import { test, expect } from '@playwright/test';

test.describe('Rate Limiting', () => {
  test('should limit login attempts', async ({ page }) => {
    await page.goto('/auth/signin');

    // Attempt multiple rapid login requests
    for (let i = 0; i < 5; i++) {
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
    }

    // Verify rate limit message
    await expect(page.getByText('Too many login attempts')).toBeVisible();
    
    // Wait for rate limit to expire
    await page.waitForTimeout(60000);
  });

  test('should limit API requests', async ({ page }) => {
    await page.goto('/products');
    
    // Attempt rapid API requests
    const responses = await Promise.all(
      Array(10).fill(0).map(() => 
        page.request.get('/api/products')
      )
    );

    // Verify rate limiting
    const lastResponse = responses[responses.length - 1];
    expect(lastResponse.status()).toBe(429);
    expect(await lastResponse.text()).toContain('Too Many Requests');
  });

  test('should limit password reset attempts', async ({ page }) => {
    await page.goto('/auth/reset-password');

    // Attempt multiple password reset requests
    for (let i = 0; i < 3; i++) {
      await page.fill('input[name="email"]', 'test@example.com');
      await page.click('button[type="submit"]');
    }

    // Verify rate limit message
    await expect(page.getByText('Too many reset attempts')).toBeVisible();
  });

  test('should limit search requests', async ({ page }) => {
    await page.goto('/');
    
    // Attempt rapid search requests
    for (let i = 0; i < 20; i++) {
      await page.fill('input[name="search"]', `test${i}`);
      await page.press('input[name="search"]', 'Enter');
    }

    // Verify rate limit message
    await expect(page.getByText('Search rate limit exceeded')).toBeVisible();
  });
}); 