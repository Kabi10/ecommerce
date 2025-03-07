import { test, expect } from '@playwright/test';
import { signIn, TEST_USER, waitForToast } from './helpers';

test.describe('User Profile', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await page.goto('/profile');
  });

  test('should display user profile information', async ({ page }) => {
    // Check profile sections
    await expect(page.getByTestId('profile-header')).toBeVisible();
    await expect(page.getByTestId('personal-info')).toBeVisible();
    await expect(page.getByTestId('order-history')).toBeVisible();
    await expect(page.getByTestId('addresses')).toBeVisible();
    
    // Verify user info is displayed
    await expect(page.getByText(TEST_USER.name)).toBeVisible();
    await expect(page.getByText(TEST_USER.email)).toBeVisible();
  });

  test('should update personal information', async ({ page }) => {
    // Click edit button
    await page.getByRole('button', { name: 'Edit Profile' }).click();
    
    // Update name
    await page.fill('[name="name"]', 'Updated Name');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify success message
    await waitForToast(page, 'Profile updated successfully');
    
    // Verify updated information is displayed
    await expect(page.getByText('Updated Name')).toBeVisible();
  });

  test('should change password', async ({ page }) => {
    // Navigate to password change section
    await page.getByRole('link', { name: 'Security' }).click();
    
    // Fill password form
    await page.fill('[name="currentPassword"]', TEST_USER.password);
    await page.fill('[name="newPassword"]', 'newpassword123');
    await page.fill('[name="confirmPassword"]', 'newpassword123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify success message
    await waitForToast(page, 'Password updated successfully');
  });

  test('should add new address', async ({ page }) => {
    // Click add address button
    await page.getByRole('button', { name: 'Add Address' }).click();
    
    // Fill address form
    await page.fill('[name="name"]', 'Home');
    await page.fill('[name="street"]', '123 Main St');
    await page.fill('[name="city"]', 'Test City');
    await page.fill('[name="state"]', 'Test State');
    await page.fill('[name="postalCode"]', '12345');
    await page.fill('[name="phone"]', '1234567890');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify success message
    await waitForToast(page, 'Address added successfully');
    
    // Verify new address is displayed
    await expect(page.getByText('123 Main St')).toBeVisible();
    await expect(page.getByText('Test City')).toBeVisible();
  });

  test('should delete address', async ({ page }) => {
    // Find delete button for first address
    const deleteButton = page.getByTestId('address-card').first().getByRole('button', { name: 'Delete' });
    
    // Click delete button
    await deleteButton.click();
    
    // Confirm deletion
    await page.getByRole('button', { name: 'Confirm' }).click();
    
    // Verify success message
    await waitForToast(page, 'Address deleted successfully');
  });

  test('should display order history', async ({ page }) => {
    // Navigate to orders section
    await page.getByRole('link', { name: 'Orders' }).click();
    
    // Check order list
    await expect(page.getByTestId('order-list')).toBeVisible();
    
    // Click on first order
    await page.getByTestId('order-item').first().click();
    
    // Verify order details
    await expect(page.getByTestId('order-details')).toBeVisible();
    await expect(page.getByTestId('order-items')).toBeVisible();
    await expect(page.getByTestId('order-summary')).toBeVisible();
  });

  test('should manage notification preferences', async ({ page }) => {
    // Navigate to notifications section
    await page.getByRole('link', { name: 'Notifications' }).click();
    
    // Toggle email notifications
    await page.getByLabel('Email notifications').click();
    
    // Toggle SMS notifications
    await page.getByLabel('SMS notifications').click();
    
    // Save preferences
    await page.getByRole('button', { name: 'Save Preferences' }).click();
    
    // Verify success message
    await waitForToast(page, 'Preferences updated successfully');
  });

  test('should display wishlist', async ({ page }) => {
    // Navigate to wishlist
    await page.getByRole('link', { name: 'Wishlist' }).click();
    
    // Check wishlist items
    await expect(page.getByTestId('wishlist-items')).toBeVisible();
    
    // Add item to cart from wishlist
    await page.getByTestId('wishlist-item').first().getByRole('button', { name: 'Add to Cart' }).click();
    
    // Verify success message
    await waitForToast(page, 'Product added to cart');
    
    // Remove item from wishlist
    await page.getByTestId('wishlist-item').first().getByRole('button', { name: 'Remove' }).click();
    
    // Verify success message
    await waitForToast(page, 'Product removed from wishlist');
  });
}); 