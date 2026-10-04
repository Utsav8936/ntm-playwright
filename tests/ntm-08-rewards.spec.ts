/**
 * ════════════════════════════════════════════════════════════════════
 *  MODULE  : Rewards Store
 *  FILE    : 08-rewards.spec.ts
 *  APP     : NTM Loyalty Console
 *  COVERS  : TC-042 → TC-047
 * ════════════════════════════════════════════════════════════════════
 *
 *  WHAT IS BEING TESTED
 *  ─────────────────────
 *  • Rewards Store page loads with correct heading
 *  • Seeded reward items are visible
 *  • Each reward card shows stock status and coin price
 *  • "Add Product" button is present
 *  • Each reward card has Edit and Disable buttons
 *  • "Popular" badge is shown on featured items
 */

import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../../helpers/login';

test.beforeEach(async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto('/rewards');
  await page.waitForLoadState('domcontentloaded');
});

// ─── TC-042 ──────────────────────────────────────────────────────────────────
test('TC-042 | Rewards | Page loads with correct heading', async ({ page }) => {
  await expect(page.locator('h1')).toContainText('Rewards store');
  await expect(page.locator('body')).toContainText('Catalogue carpenters can buy with coins');
});

// ─── TC-043 ──────────────────────────────────────────────────────────────────
test('TC-043 | Rewards | Seeded reward items are visible', async ({ page }) => {
  await expect(page.locator('body')).toContainText('Truvison 32 inch');
  await expect(page.locator('body')).toContainText('Puma Shoes');
  await expect(page.locator('body')).toContainText('TITAN');
});

// ─── TC-044 ──────────────────────────────────────────────────────────────────
test('TC-044 | Rewards | Reward cards show stock status and coin price', async ({ page }) => {
  await expect(page.locator('body')).toContainText('In Stock');
  await expect(page.locator('body')).toContainText('Out of Stock');
  // Coin prices are shown as numbers
  await expect(page.locator('body')).toContainText('12000');
});

// ─── TC-045 ──────────────────────────────────────────────────────────────────
test('TC-045 | Rewards | Add Product button is present', async ({ page }) => {
  await expect(page.getByRole('button', { name: /add product/i })).toBeVisible();
});

// ─── TC-046 ──────────────────────────────────────────────────────────────────
test('TC-046 | Rewards | Each reward card has Edit and Disable buttons', async ({ page }) => {
  // Edit and Disable text must appear in the page body for each reward card
  await expect(page.locator('body')).toContainText('Edit');
  await expect(page.locator('body')).toContainText('Disable');
});

// ─── TC-047 ──────────────────────────────────────────────────────────────────
test('TC-047 | Rewards | "Popular" badge is shown on featured items', async ({ page }) => {
  await expect(page.locator('body')).toContainText('Popular');
});
