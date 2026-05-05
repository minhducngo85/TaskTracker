import { test, expect } from '@playwright/test';

test.describe('Kanban Page', () => {
  test.beforeEach(async ({ page }) => {
    // make sure in playwright.config.ts:   baseURL: 'http://localhost:4200',
    await page.goto('/login');

    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'abcd1234');

    await Promise.all([page.waitForURL('**/dashboard'), page.click('button[type=submit]')]);

    await page.goto('/kanbanboard');

    // 👇 optional: page is ready
    await expect(page).toHaveURL(/kanbanboard/);
  });

  // ✅ 1. Page loads
  test('should load kanban text', async ({ page }) => {
    await page.waitForSelector('.title');
    await expect(page.locator('.title')).toBeVisible();
    await expect(page.locator('.title')).toContainText('Kanban Board');
  });

  // ✅ 2. Page has 3 cols
  test('should load kanban cols', async ({ page }) => {
    await expect(page.locator('h3', { hasText: 'To Do' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'In Progress' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Done' })).toBeVisible();
  });

  // ✅ 2. Move first item from to do to done
  test('should move first item from todo to done', async ({ page }) => {
    const task = page.locator('#TODO .task-card').first();
    const doneColumn = page.locator('#DONE');

    // 👇 ensure ready
    await expect(task).toBeVisible();
    await expect(doneColumn).toBeVisible();

    const taskBox = await task.boundingBox();
    const targetBox = await doneColumn.boundingBox();

    if (!taskBox || !targetBox) throw new Error('Element not found');

    // 👇 drag
    await page.mouse.move(taskBox.x + taskBox.width / 2, taskBox.y + taskBox.height / 2);

    await page.mouse.down();

    await page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2,
      { steps: 15 }, // 🔥 Inportant
    );

    await page.mouse.up();

    // ✅ verify moved
    await expect(page.locator('#DONE .task-card')).not.toHaveCount(0);
  });
});
