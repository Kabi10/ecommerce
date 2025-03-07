import { test, expect } from '@playwright/test';
import { signIn, addProductToCart, waitForToast } from './helpers';

test.describe('Product Catalog', () => {
  test('should display products grid with filters', async ({ page }) => {
    await page.goto('/products');
    
    // Check products grid
    await expect(page.getByTestId('products-grid')).toBeVisible();
    
    // Check filters
    await expect(page.getByRole('combobox', { name: 'Category' })).toBeVisible();
    await expect(page.getByRole('slider', { name: 'Price range' })).toBeVisible();
    await expect(page.getByRole('combobox', { name: 'Sort by' })).toBeVisible();
  });

  test('should filter products by category', async ({ page }) => {
    await page.goto('/products');
    
    // Select Electronics category
    await page.selectOption('select[name="category"]', 'Electronics');
    
    // Check URL contains category parameter
    await expect(page).toHaveURL(/.*category=Electronics/);
    
    // Verify filtered products
    const products = page.getByTestId('product-card');
    await expect(products.first()).toBeVisible();
    
    // Check category badge on products
    const categoryBadges = page.getByText('Electronics');
    await expect(categoryBadges.first()).toBeVisible();
  });

  test('should filter products by price range', async ({ page }) => {
    await page.goto('/products');
    
    // Set price range
    const priceSlider = page.getByRole('slider', { name: 'Price range' });
    await priceSlider.fill('50');
    
    // Check URL contains price parameter
    await expect(page).toHaveURL(/.*maxPrice=50/);
    
    // Verify filtered products
    const products = page.getByTestId('product-card');
    await expect(products.first()).toBeVisible();
    
    // Check product prices are within range
    const prices = await page.getByTestId('product-price').allInnerTexts();
    prices.forEach(price => {
      expect(parseFloat(price.replace('$', ''))).toBeLessThanOrEqual(50);
    });
  });

  test('should sort products by price', async ({ page }) => {
    await page.goto('/products');
    
    // Sort by price: low to high
    await page.selectOption('select[name="sort"]', 'price_asc');
    
    // Check URL contains sort parameter
    await expect(page).toHaveURL(/.*sort=price_asc/);
    
    // Get product prices
    const prices = await page.getByTestId('product-price').allInnerTexts();
    
    // Verify prices are in ascending order
    const numericPrices = prices.map(price => parseFloat(price.replace('$', '')));
    const sortedPrices = [...numericPrices].sort((a, b) => a - b);
    expect(numericPrices).toEqual(sortedPrices);
  });

  test('should search products by name', async ({ page }) => {
    await page.goto('/products');
    
    // Enter search query
    await page.fill('input[name="search"]', 'laptop');
    
    // Check URL contains search parameter
    await expect(page).toHaveURL(/.*search=laptop/);
    
    // Verify search results
    const products = page.getByTestId('product-card');
    await expect(products.first()).toBeVisible();
    
    // Check product names contain search query
    const names = await page.getByTestId('product-name').allInnerTexts();
    names.forEach(name => {
      expect(name.toLowerCase()).toContain('laptop');
    });
  });

  test('should show product details', async ({ page }) => {
    // Navigate to first product
    await page.goto('/products');
    await page.getByTestId('product-card').first().click();
    
    // Check product details page elements
    await expect(page.getByTestId('product-title')).toBeVisible();
    await expect(page.getByTestId('product-description')).toBeVisible();
    await expect(page.getByTestId('product-price')).toBeVisible();
    await expect(page.getByTestId('product-stock')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add to Cart' })).toBeVisible();
  });

  test('should add product to cart', async ({ page }) => {
    await signIn(page);
    await addProductToCart(page);
    await waitForToast(page, 'Product added to cart');
    
    // Verify cart badge updated
    const cartBadge = page.getByTestId('cart-count');
    await expect(cartBadge).toHaveText('1');
  });

  test('should show related products', async ({ page }) => {
    // Navigate to product details
    await page.goto('/products');
    await page.getByTestId('product-card').first().click();
    
    // Check related products section
    const relatedProducts = page.getByTestId('related-products');
    await expect(relatedProducts).toBeVisible();
    
    // Verify multiple related products are shown
    const productCards = relatedProducts.getByTestId('product-card');
    await expect(productCards).toHaveCount(4);
  });
}); 