/**
 * ════════════════════════════════════════════════════════════════════
 *  MODULE  : Dynamic Values (Configuration)
 *  FILE    : 12-dynamic-values.spec.ts
 *  APP     : NTM Loyalty Console
 *  COVERS  : TC-071 → TC-074
 * ════════════════════════════════════════════════════════════════════
 *
 *  WHAT IS BEING TESTED
 *  ─────────────────────
 *  • Dynamic Values page loads with correct heading
 *  • All 3 configuration fields are visible
 *  • All 3 input fields accept numeric values
 *  • Sidebar navigation to Dynamic Values works via click
 */

import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../../helpers/login';

test.beforeEach(async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto('/dynamic-values');
  await page.waitForLoadState('networkidle');
});

// ─── TC-071 ──────────────────────────────────────────────────────────────────
test('TC-071 | Dynamic Values | Page loads with correct heading', async ({ page }) => {
  await expect(page.locator('h1')).toContainText('Dynamic Values');
  await expect(page.locator('body')).toContainText('Configure points and coin values');
});

// ─── TC-072 ──────────────────────────────────────────────────────────────────
test('TC-072 | Dynamic Values | All 3 configuration sections are visible', async ({ page }) => {
  await expect(page.locator('body')).toContainText('Referral Points');
  await expect(page.locator('body')).toContainText('Redeem Points');
  await expect(page.locator('body')).toContainText('Rupee to Coin Ratio');
});

// ─── TC-073 ──────────────────────────────────────────────────────────────────
test('TC-073 | Dynamic Values | All 3 number input fields are present', async ({ page }) => {
  const numberInputs = page.locator('input[type="number"]');
  const count = await numberInputs.count();
  expect(count).toBe(3);
});

// ─── TC-074 ──────────────────────────────────────────────────────────────────
test('TC-074 | Dynamic Values | Sidebar link navigates to /dynamic-values', async ({ page }) => {
  await page.goto('/dashboard');
  await page.locator('aside').getByRole('link', { name: 'Dynamic Values' }).click();
  await page.waitForURL('**/dynamic-values');
  await expect(page).toHaveURL(/dynamic-values/);
});
