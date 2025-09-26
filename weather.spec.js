import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://weather.com/login');
  await expect(page.locator('iframe[title="Кнопка \\"Войти с аккаунтом Google\\""]').contentFrame().getByRole('button', { name: 'Вход с аккаунтом Google' })).toBeVisible();
});