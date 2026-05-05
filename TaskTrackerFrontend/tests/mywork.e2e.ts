import { test, expect } from '@playwright/test';

test.describe('My Work Page', () => {
  test.beforeEach(async ({ page }) => {
    // make sure in playwright.config.ts:   baseURL: 'http://localhost:4200',
    await page.goto('/login');

    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'abcd1234');

    await Promise.all([page.waitForURL('**/dashboard'), page.click('button[type=submit]')]);

    // 👇 chuyển sang my-work
    await page.goto('/my-work');

    // 👇 optional: đảm bảo page load xong
    await expect(page).toHaveURL(/my-work/);
  });

  // ✅ 1. Page loads
  test('should load my work text', async ({ page }) => {
    await page.waitForSelector('.title');
    await expect(page.locator('.title')).toBeVisible();
    await expect(page.locator('.title')).toContainText('My Work');
  });

  // ✅ 2. Summary
  test('should load summary', async ({ page }) => {
    await expect(page.locator('.section-title', { hasText: 'Summary' })).toBeVisible();

    await expect(page.locator('.card-title', { hasText: 'Active Tasks' })).toBeVisible();
    await expect(page.locator('.card-title', { hasText: 'Overdue' })).toBeVisible();
    await expect(page.locator('.card-title', { hasText: 'In Progress' })).toBeVisible();
    await expect(page.locator('.card-title', { hasText: 'To Do' })).toBeVisible();
  });

   // ✅ 3. Overdue Section
  test('should load overdue tasks', async ({ page }) => {
    await expect(page.locator('.section-title', { hasText: 'Overdue' })).toBeVisible();
  });

   // ✅ 4. In progress Section
  test('should load in progess tasks', async ({ page }) => {
    await expect(page.locator('.section-title', { hasText: 'In Progress' })).toBeVisible();
  });

   // ✅ 5. To do Section
  test('should load in to-do tasks', async ({ page }) => {
    await expect(page.locator('.section-title', { hasText: 'To Do' })).toBeVisible();
  });


  // ✅ 7. Activity feed pagination
  test('should paginate activities', async ({ page }) => {
    await expect(page.locator('.section-title', { hasText: 'My Activities' })).toBeVisible();
    const items = page.locator('.card.activity-item');

    await expect(items.first()).toBeVisible();

    const firstText = await items.first().textContent();

    const nextBtn = page.getByRole('button', { name: /next/i });

    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    await expect(items.first()).not.toHaveText(firstText!);
  });
});
