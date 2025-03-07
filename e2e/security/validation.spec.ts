import { test, expect } from '@playwright/test';

test.describe('Input Validation', () => {
  test('should validate email format', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Test invalid email formats
    const invalidEmails = [
      'notanemail',
      'missing@domain',
      '@nodomain.com',
      'spaces@ domain.com',
      'multiple@@domain.com',
    ];

    for (const email of invalidEmails) {
      await page.fill('input[name="email"]', email);
      await page.click('button[type="submit"]');
      await expect(page.getByText('Invalid email address')).toBeVisible();
    }
  });

  test('should validate password requirements', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Test weak passwords
    const weakPasswords = [
      'short',           // Too short
      'nouppercasenum', // No uppercase or numbers
      'NoSpecialChar1', // No special characters
      'Only1234567890', // Only numbers
    ];

    for (const password of weakPasswords) {
      await page.fill('input[name="password"]', password);
      await page.click('button[type="submit"]');
      await expect(page.getByText(/Password must/)).toBeVisible();
    }
  });

  test('should validate product review inputs', async ({ page }) => {
    await page.goto('/products/1');
    
    // Test invalid ratings
    await page.fill('input[name="rating"]', '6');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Rating must be between 1 and 5')).toBeVisible();

    // Test review length
    await page.fill('textarea[name="review"]', 'a'.repeat(1001));
    await page.click('button[type="submit"]');
    await expect(page.getByText('Review must be less than 1000 characters')).toBeVisible();
  });

  test('should validate payment information', async ({ page }) => {
    await page.goto('/checkout');
    
    // Test invalid card numbers
    await page.fill('input[name="cardNumber"]', '1234');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Invalid card number')).toBeVisible();

    // Test invalid expiry date
    await page.fill('input[name="expiryDate"]', '13/25');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Invalid expiry date')).toBeVisible();

    // Test invalid CVV
    await page.fill('input[name="cvv"]', '12');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Invalid CVV')).toBeVisible();
  });

  test('should validate shipping address', async ({ page }) => {
    await page.goto('/checkout');
    
    // Test postal code format
    await page.fill('input[name="postalCode"]', 'invalid');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Invalid postal code')).toBeVisible();

    // Test phone number format
    await page.fill('input[name="phone"]', 'notanumber');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Invalid phone number')).toBeVisible();
  });
}); 