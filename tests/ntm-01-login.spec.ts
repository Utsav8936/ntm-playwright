/**
 * ════════════════════════════════════════════════════════════════════
 *  MODULE  : Authentication / Login
 *  FILE    : ntm-01-login.spec.ts
 *  APP     : NTM Loyalty Console
 *  COVERS  : TC-001 → TC-005
 * ════════════════════════════════════════════════════════════════════
 *
 *  BUG FOUND & FIXED
 *  ──────────────────
 *  The #loginId input is rendered as readonly + disabled by the app
 *  (pre-filled with "admin"). Playwright's fill() fails on readonly
 *  elements. Fix: use page.evaluate() to set the value via the native
 *  HTMLInputElement setter and fire a React-compatible 'input' event.
 */

import { test, expect, Page } from '@playwright/test';

// ─── Shared helper: fills the readonly loginId input ─────────────────────────
async function fillLoginId(page: Page, value: string) {
  await page.waitForSelector('#loginId');
  await page.evaluate((val) => {
    const input = document.querySelector('#loginId') as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    )!.set!;
    setter.call(input, val);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, value);
}

// ─── TC-001 ──────────────────────────────────────────────────────────────────
test('TC-001 | Login | Page renders title, inputs and Sign-in button', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('h1')).toContainText('Sign in');
  await expect(page.locator('body')).toContainText('NTM');
  await expect(page.locator('#loginId')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();
  await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
});

// ─── TC-002 ──────────────────────────────────────────────────────────────────
test('TC-002 | Login | Valid credentials (admin / 12345678) redirect to Dashboard', async ({ page }) => {
  await page.goto('/');
  await fillLoginId(page, 'admin');
  await page.locator('#password').fill('12345678');
  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL('**/dashboard');
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.locator('h1')).toContainText('Dashboard');
});

// ─── TC-003 ──────────────────────────────────────────────────────────────────
test('TC-003 | Login | Wrong password keeps user on login page', async ({ page }) => {
  await page.goto('/');
  await fillLoginId(page, 'admin');
  await page.locator('#password').fill('wrongpassword');
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForTimeout(2000);

  // Must NOT navigate to dashboard
  await expect(page).not.toHaveURL(/dashboard/);
});

// ─── TC-004 ──────────────────────────────────────────────────────────────────
test('TC-004 | Login | Empty password field stays on login page', async ({ page }) => {
  await page.goto('/');
  // loginId is pre-filled with "admin" by the app — only password is empty
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForTimeout(1500);

  await expect(page).not.toHaveURL(/dashboard/);
});

// ─── TC-005 ──────────────────────────────────────────────────────────────────
test('TC-005 | Login | Sign-out returns user to login page', async ({ page }) => {
  await page.goto('/');
  await fillLoginId(page, 'admin');
  await page.locator('#password').fill('12345678');
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('**/dashboard');

  await page.getByRole('button', { name: /sign out/i }).click();
  await page.waitForTimeout(1500);

  await expect(page).not.toHaveURL(/dashboard/);
  await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
});
