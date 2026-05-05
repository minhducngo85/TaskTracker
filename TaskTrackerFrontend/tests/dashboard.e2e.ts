import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    // make sure in playwright.config.ts:   baseURL: 'http://localhost:4200',
    await page.goto('/login');

    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'abcd1234');

    await Promise.all([page.waitForURL('**/dashboard'), page.click('button[type=submit]')]);

    // await page.goto('http://localhost:4200'); // adjust nếu cần
  });

  // ✅ 1. Page loads
  test('should load dashboard text', async ({ page }) => {
    await page.waitForSelector('.title');
    await expect(page.locator('.title')).toBeVisible();
    await expect(page.locator('.title')).toContainText('Dashboard');
  });

  // ✅ 2. Stats cards render
  test('should display stats cards', async ({ page }) => {
    // 👇 wait cho data load xong
    await page.waitForSelector('.card.total', {
      state: 'visible',
      timeout: 15000,
    });

    await expect(page.locator('.card.total')).toBeVisible();
    await expect(page.locator('.card.todo')).toBeVisible();
    await expect(page.locator('.card.progress')).toBeVisible();
    await expect(page.locator('.card.done')).toBeVisible();
  });

  // ✅ 3. Click TODO → navigate
  test('should filter tasks when clicking TODO card', async ({ page }) => {
    await page.waitForSelector('.card.total', {
      state: 'visible',
      timeout: 15000,
    });

    await page.locator('.card.todo').click();
    await expect(page).toHaveURL(/tasks/);
    await expect(page).toHaveURL(/status=TODO/);
  });

  // ✅ 4. Progress bar
  test('should show progress bar', async ({ page }) => {
    const progress = page.locator('.progress-fill');

    await expect(progress).toBeVisible();

    const width = await progress.getAttribute('style');
    expect(width).toContain('%');
  });

  // ✅ 5. My Work section
  test('should display my work cards', async ({ page }) => {
    await expect(page.getByText('My Work')).toBeVisible();
    await expect(page.getByText('Overdue')).toBeVisible();
    await expect(page.getByText('Due Today')).toBeVisible();
    await expect(page.getByText('This Week')).toBeVisible();
  });

  // ✅ 6. Top tags click
  test('should filter by tag when clicking tag', async ({ page }) => {
    const tag = page.locator('.tag-item').first();

    if (await tag.isVisible()) {
      await tag.click();

      await expect(page).toHaveURL(/.*tasks/);
      await expect(page).toHaveURL(/tag=/);
    }
  });

  // ✅ 7. Activity feed pagination
  test('should paginate activities', async ({ page }) => {
    const items = page.locator('.card.activity-item');

    await expect(items.first()).toBeVisible();

    const firstText = await items.first().textContent();

    const nextBtn = page.getByRole('button', { name: /next/i });

    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    await expect(items.first()).not.toHaveText(firstText!);
  });
});
