import { test, expect } from '@playwright/test';
import { signIn } from '../helpers';

test.describe('Authentication Security', () => {
  test('should prevent access to protected routes when not authenticated', async ({ page }) => {
    // Try accessing protected routes
    const protectedRoutes = [
      '/profile',
      '/orders',
      '/admin',
      '/checkout',
    ];

    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL('/auth/signin');
    }
  });

  test('should prevent access to admin routes for non-admin users', async ({ page }) => {
    // Sign in as regular user
    await signIn(page, 'user@example.com', 'password123');
    
    // Try accessing admin routes
    const adminRoutes = [
      '/admin',
      '/admin/products',
      '/admin/orders',
      '/admin/users',
    ];

    for (const route of adminRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL('/');
      await expect(page.getByText('Access denied')).toBeVisible();
    }
  });

  test('should handle session expiration', async ({ page }) => {
    await signIn(page);
    
    // Simulate session expiration
    await page.evaluate(() => {
      localStorage.removeItem('session');
      sessionStorage.clear();
    });

    // Try accessing protected route
    await page.goto('/profile');
    await expect(page).toHaveURL('/auth/signin');
  });

  test('should prevent concurrent sessions', async ({ page, browser }) => {
    await signIn(page);

    // Sign in from another browser
    const newContext = await browser.newContext();
    const newPage = await newContext.newPage();
    await signIn(newPage);

    // Check if original session is invalidated
    await page.reload();
    await expect(page).toHaveURL('/auth/signin');
    await expect(page.getByText('Session expired')).toBeVisible();
  });

  test('should implement secure password reset flow', async ({ page }) => {
    // Request password reset
    await page.goto('/auth/reset-password');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button[type="submit"]');

    // Verify reset token requirements
    await page.goto('/auth/reset-password?token=invalid');
    await expect(page.getByText('Invalid or expired token')).toBeVisible();

    // Verify token expiration
    const expiredToken = 'expired_token_123';
    await page.goto(`/auth/reset-password?token=${expiredToken}`);
    await expect(page.getByText('Reset token has expired')).toBeVisible();
  });

  test('should enforce password change on first login', async ({ page }) => {
    // Sign in with temporary password
    await signIn(page, 'newuser@example.com', 'temporary123');
    
    // Should be redirected to password change
    await expect(page).toHaveURL('/auth/change-password');
    await expect(page.getByText('Please change your password')).toBeVisible();

    // Cannot skip password change
    await page.goto('/');
    await expect(page).toHaveURL('/auth/change-password');
  });

  test('should implement OAuth security measures', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Verify state parameter in OAuth URLs
    const googleButton = page.getByRole('button', { name: 'Sign in with Google' });
    const googleHref = await googleButton.getAttribute('href');
    expect(googleHref).toContain('state=');

    // Verify callback URL validation
    await page.goto('/api/auth/callback/google?state=invalid');
    await expect(page.getByText('Invalid state parameter')).toBeVisible();
  });
}); 