import { Page, expect } from '@playwright/test';

// Auth helpers
export async function signIn(page: Page, email: string = 'test@example.com', password: string = 'password123') {
  await page.goto('/sign-in');
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/');
}

export async function signInAsAdmin(page: Page) {
  await signIn(page, 'admin@example.com', 'adminpass123');
  await expect(page).toHaveURL('/admin');
}

// Product helpers
export async function addProductToCart(page: Page, productId: string = '1') {
  await page.goto(`/products/${productId}`);
  await page.click('button:has-text("Add to Cart")');
  await expect(page.getByText('Product added to cart')).toBeVisible();
}

// Cart helpers
export async function clearCart(page: Page) {
  await page.goto('/cart');
  const removeButtons = await page.getByRole('button', { name: 'Remove' }).all();
  for (const button of removeButtons) {
    await button.click();
    // Wait for item to be removed
    await page.waitForTimeout(500);
  }
}

// Checkout helpers
export async function fillShippingDetails(page: Page) {
  await page.fill('[name="name"]', 'Test User');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="phone"]', '1234567890');
  await page.fill('[name="address"]', '123 Test St');
  await page.fill('[name="city"]', 'Test City');
  await page.fill('[name="state"]', 'Test State');
  await page.fill('[name="postalCode"]', '12345');
}

export async function fillPaymentDetails(page: Page) {
  // Get the Stripe iframe
  const frame = page.frameLocator('iframe[name^="__privateStripeFrame"]');
  
  // Fill card details
  await frame.locator('[placeholder="Card number"]').fill('4242424242424242');
  await frame.locator('[placeholder="MM / YY"]').fill('1234');
  await frame.locator('[placeholder="CVC"]').fill('123');
}

// Admin helpers
export async function createProduct(page: Page, {
  name = 'Test Product',
  description = 'Test Description',
  price = '99.99',
  stock = '10',
  category = 'Electronics'
} = {}) {
  await page.goto('/admin/products/new');
  await page.fill('[name="name"]', name);
  await page.fill('[name="description"]', description);
  await page.fill('[name="price"]', price);
  await page.fill('[name="stock"]', stock);
  await page.selectOption('select[name="category"]', category);
  await page.click('button[type="submit"]');
  await expect(page.getByText('Product created successfully')).toBeVisible();
}

export async function updateOrderStatus(page: Page, orderId: string, status: string) {
  await page.goto(`/admin/orders/${orderId}`);
  await page.selectOption('select[name="status"]', status);
  await page.click('button:has-text("Update Status")');
  await expect(page.getByText('Order status updated successfully')).toBeVisible();
}

// Utility functions
export async function waitForToast(page: Page, text: string) {
  await expect(page.getByRole('status').filter({ hasText: text })).toBeVisible();
}

export async function screenshot(page: Page, name: string) {
  await page.screenshot({ path: `./playwright-results/${name}.png` });
}

export const TEST_USER = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
};

export const ADMIN_USER = {
  email: 'admin@example.com',
  password: 'adminpass123',
  name: 'Admin User'
}; 