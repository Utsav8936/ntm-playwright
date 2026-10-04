/**
 * helpers/login.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared login helper — import this in every test file.
 *
 * Usage:
 *   import { loginAsAdmin } from '../helpers/login';
 *   test.beforeEach(async ({ page }) => { await loginAsAdmin(page); });
 */

import { Page, expect } from '@playwright/test';

export async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto('/');

  // The #loginId input is pre-filled with 'admin' and marked readonly by the app.
  // Use JavaScript to set the value and fire React's synthetic change event.
  await page.waitForSelector('#loginId');
  await page.evaluate(() => {
    const input = document.querySelector('#loginId') as HTMLInputElement;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!;
    nativeInputValueSetter.call(input, 'admin');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

  await page.locator('#password').fill('12345678');
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('**/dashboard');
  await expect(page.locator('aside')).toBeVisible();
}
