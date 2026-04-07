import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  
  // Check if the page title is correct (Ukrainian title)
  await expect(page).toHaveTitle(/СУШИDОМ/);
  
  // Check if the main heading in header is visible (more specific selector)
  await expect(page.getByRole('banner').getByRole('heading', { name: 'СУШИDОМ' })).toBeVisible();
});

test('menu items are displayed', async ({ page }) => {
  await page.goto('/');
  
  // Check if menu items are visible (using more specific selectors)
  await expect(page.getByRole('heading', { name: 'Філадельфія', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Каліфорнія з креветкою в кунжуті' })).toBeVisible();
});

test('cart functionality works', async ({ page }) => {
  await page.goto('/');
  
  // Click on a menu item to add to cart (using actual button text)
  await page.getByRole('button', { name: /Додати/i }).first().click();
  
  // Check if the toast notification appears (more specific)
  await expect(page.getByText('Додано до кошика', { exact: true })).toBeVisible();
});
