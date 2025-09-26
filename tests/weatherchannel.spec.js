import { test, expect } from '@playwright/test';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

test.use({
  permissions: ['geolocation'],
  geolocation: { longitude: 69.2401, latitude: 41.2995 },
});

test('Weather.com E2E: Sign in, Search City, Select City, Check temperature', async ({ page }) => {
  // Step 1: Open https://weather.com/
  await page.goto('https://weather.com', { waitUntil: 'domcontentloaded', timeout: 60000 });

  // Step 2: Sign In with Email and Password and check by heading
  await page.getByTestId('accountLinksSection').getByTestId('ctaButton').click();
  await expect(page.getByRole('heading', { name: 'Sign in to your account.' })).toBeVisible();
  await sleep(2000);//Wait render iframe page(Google account)
  await page.getByRole('textbox', { name: 'Email' }).fill(process.env.WEATHER_EMAIL);
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.WEATHER_PASSWORD);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();

  // Wait for login success and expect User Account Menu
  await sleep(3000);
  await expect(page.getByRole('button', { name: 'User Account Menu U' })).toBeVisible();

  // Step 3: Perform a search and expect search result list
  await page.getByRole('banner', { name: 'Menu' }).getByTestId('searchModalInputBox').click();
  await page.getByRole('banner', { name: 'Menu' }).getByTestId('searchModalInputBox').fill('Istanbul');
  await expect(page.getByRole('listbox', { name: 'Search Result List' })).toBeVisible();

  // Step 4: Select the first one on the list and expect Saved Location
  await page.getByRole('option', { name: 'Istanbul, Istanbul, Türkiye' }).click();
  await expect(page.getByLabel('Saved Locations').getByRole('link')).toContainText('Fatih, Istanbul, Türkiye');

  // Step 5: Check temperature is visible with "data-testid=TemperatureValue"
  const temp = page.locator('[data-testid="TemperatureValue"]').first();
  await expect(temp).toBeVisible({ timeout: 20000 });
});

