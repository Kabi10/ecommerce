import { test, expect } from '@playwright/test';

test.describe('XSS Prevention', () => {
  test('should sanitize user input in product reviews', async ({ page }) => {
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.goto('/products/1');
    const maliciousScript = '<script>alert("xss")</script>';
    await page.fill('textarea[name="review"]', maliciousScript);
    await page.click('button[type="submit"]');

    // Verify the script tag is escaped
    const reviewText = await page.textContent('[data-testid="review-content"]');
    expect(reviewText).not.toContain('<script>');
    expect(reviewText).toContain('&lt;script&gt;');
  });

  test('should sanitize user input in profile names', async ({ page }) => {
    await page.goto('/profile');
    const maliciousHTML = '<img src="x" onerror="alert(1)">';
    await page.fill('input[name="name"]', maliciousHTML);
    await page.click('button[type="submit"]');

    const displayedName = await page.textContent('[data-testid="profile-name"]');
    expect(displayedName).not.toContain('<img');
    expect(displayedName).toContain('&lt;img');
  });

  test('should prevent HTML injection in search queries', async ({ page }) => {
    await page.goto('/');
    const maliciousQuery = '<iframe src="javascript:alert(1)">';
    await page.fill('input[name="search"]', maliciousQuery);
    await page.press('input[name="search"]', 'Enter');

    const searchResults = await page.textContent('[data-testid="search-results"]');
    expect(searchResults).not.toContain('<iframe');
    expect(searchResults).toContain('&lt;iframe');
  });
}); 