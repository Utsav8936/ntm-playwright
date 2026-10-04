/**
 * ════════════════════════════════════════════════════════════════════
 *  MODULE  : Dealers
 *  FILE    : 03-dealers.spec.ts
 *  APP     : NTM Loyalty Console
 *  COVERS  : TC-013 → TC-019
 * ════════════════════════════════════════════════════════════════════
 *
 *  WHAT IS BEING TESTED
 *  ─────────────────────
 *  • Dealers page loads with correct heading and count
 *  • Table shows correct column headers
 *  • Seeded dealer data is visible
 *  • Status filter buttons (ACTIVE / PENDING / DEACTIVE / SUSPENDED) exist
 *  • Search by Dealer Code input is present and functional
 *  • Refresh button is present
 *  • Sidebar navigation to Dealers works via click
 */

import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../../helpers/login';

test.beforeEach(async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto('/dealers');
  await page.waitForLoadState('networkidle');
});

// ─── TC-013 ──────────────────────────────────────────────────────────────────
test('TC-013 | Dealers | Page loads with heading and dealer count', async ({ page }) => {
  await expect(page.locator('h1')).toContainText('Dealers');
  await expect(page.locator('body')).toContainText('dealers found');
});

// ─── TC-014 ──────────────────────────────────────────────────────────────────
test('TC-014 | Dealers | Table has correct column headers', async ({ page }) => {
  const columns = ['Dealer', 'Business', 'Phone', 'Dealer Code', 'City / State', 'Total Scans', 'Points', 'Status'];
  for (const col of columns) {
    await expect(page.locator('table')).toContainText(col);
  }
});

// ─── TC-015 ──────────────────────────────────────────────────────────────────
test('TC-015 | Dealers | Seeded dealer "Aman kumar singh" is visible', async ({ page }) => {
  await expect(page.locator('body')).toContainText('Aman kumar singh');
  await expect(page.locator('body')).toContainText('NTM-DLR-466683');
});

// ─── TC-016 ──────────────────────────────────────────────────────────────────
test('TC-016 | Dealers | Status filter buttons are all present', async ({ page }) => {
  // Scope to <main> and use exact:true to avoid matching status badges in table rows
  const main = page.locator('main');
  for (const status of ['ACTIVE', 'PENDING', 'DEACTIVE', 'SUSPENDED']) {
    await expect(main.getByRole('button', { name: status, exact: true }).first()).toBeVisible();
  }
});

// ─── TC-017 ──────────────────────────────────────────────────────────────────
test('TC-017 | Dealers | Search input is present and accepts text', async ({ page }) => {
  // The search input placeholder may vary — locate by type inside main
  const searchInput = page.locator('main input[type="text"], main input:not([type="hidden"])').first();
  await expect(searchInput).toBeVisible();

  // Type a known dealer code and verify the seeded dealer stays visible
  await searchInput.fill('NTM-DLR-466683');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('body')).toContainText('Aman kumar singh');
});

// ─── TC-018 ──────────────────────────────────────────────────────────────────
test('TC-018 | Dealers | Refresh button is present', async ({ page }) => {
  await expect(page.getByRole('button', { name: /refresh/i })).toBeVisible();
});

// ─── TC-019 ──────────────────────────────────────────────────────────────────
test('TC-019 | Dealers | Sidebar link navigates to /dealers', async ({ page }) => {
  await page.goto('/dashboard');
  await page.locator('aside').getByRole('link', { name: 'Dealers' }).click();
  await page.waitForURL('**/dealers');
  await expect(page).toHaveURL(/dealers/);
});
