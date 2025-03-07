import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('should show search suggestions', async ({ page }) => {
    await page.goto('/');
    
    // Open search dialog
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Type search query
    await page.getByRole('combobox', { name: 'Search' }).fill('lap');
    
    // Wait for suggestions
    await page.waitForTimeout(500);
    
    // Check suggestions are shown
    const suggestions = page.getByTestId('search-suggestions');
    await expect(suggestions).toBeVisible();
    
    // Verify suggestion categories
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page.getByText('Categories')).toBeVisible();
  });

  test('should navigate to product from search', async ({ page }) => {
    await page.goto('/');
    
    // Open search dialog
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Type search query
    await page.getByRole('combobox', { name: 'Search' }).fill('laptop');
    
    // Wait for suggestions
    await page.waitForTimeout(500);
    
    // Click first product suggestion
    await page.getByTestId('search-suggestion-item').first().click();
    
    // Verify navigation to product page
    await expect(page).toHaveURL(/.*\/products\/.*/);
    await expect(page.getByTestId('product-title')).toBeVisible();
  });

  test('should show recent searches', async ({ page }) => {
    await page.goto('/');
    
    // Open search dialog
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Check recent searches section
    await expect(page.getByText('Recent Searches')).toBeVisible();
    
    // Type and submit search
    await page.getByRole('combobox', { name: 'Search' }).fill('phone');
    await page.keyboard.press('Enter');
    
    // Open search dialog again
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Verify recent search is shown
    await expect(page.getByText('phone')).toBeVisible();
  });

  test('should clear recent searches', async ({ page }) => {
    await page.goto('/');
    
    // Open search dialog
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Click clear recent searches
    await page.getByRole('button', { name: 'Clear recent searches' }).click();
    
    // Verify no recent searches
    await expect(page.getByText('No recent searches')).toBeVisible();
  });

  test('should show empty state for no results', async ({ page }) => {
    await page.goto('/');
    
    // Open search dialog
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Type non-existent query
    await page.getByRole('combobox', { name: 'Search' }).fill('nonexistentproduct123');
    
    // Wait for suggestions
    await page.waitForTimeout(500);
    
    // Verify no results message
    await expect(page.getByText('No results found')).toBeVisible();
  });

  test('should filter search by category', async ({ page }) => {
    await page.goto('/');
    
    // Open search dialog
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Select category filter
    await page.getByRole('combobox', { name: 'Category' }).selectOption('Electronics');
    
    // Type search query
    await page.getByRole('combobox', { name: 'Search' }).fill('phone');
    
    // Wait for suggestions
    await page.waitForTimeout(500);
    
    // Verify filtered results
    const suggestions = page.getByTestId('search-suggestion-item');
    await expect(suggestions.first()).toBeVisible();
    await expect(page.getByText('Electronics')).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Open search dialog
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Type search query
    await page.getByRole('combobox', { name: 'Search' }).fill('laptop');
    
    // Wait for suggestions
    await page.waitForTimeout(500);
    
    // Navigate with arrow keys
    await page.keyboard.press('ArrowDown');
    
    // Verify first item is focused
    const firstItem = page.getByTestId('search-suggestion-item').first();
    await expect(firstItem).toHaveAttribute('data-highlighted', 'true');
    
    // Press enter to select
    await page.keyboard.press('Enter');
    
    // Verify navigation
    await expect(page).toHaveURL(/.*\/products\/.*/);
  });

  test('should preserve search filters in URL', async ({ page }) => {
    await page.goto('/');
    
    // Open search dialog
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Select category filter
    await page.getByRole('combobox', { name: 'Category' }).selectOption('Electronics');
    
    // Type search query
    await page.getByRole('combobox', { name: 'Search' }).fill('phone');
    
    // Submit search
    await page.keyboard.press('Enter');
    
    // Verify URL parameters
    await expect(page).toHaveURL(/.*search=phone.*/);
    await expect(page).toHaveURL(/.*category=Electronics.*/);
  });
}); 