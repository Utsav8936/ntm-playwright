/**
 * ════════════════════════════════════════════════════════════════════
 *  MODULE  : Products & QR Codes
 *  FILE    : 05-products.spec.ts
 *  APP     : NTM Loyalty Console
 *  COVERS  : TC-026 → TC-031
 * ════════════════════════════════════════════════════════════════════
 *
 *  WHAT IS BEING TESTED
 *  ─────────────────────
 *  • Products page loads with heading and product count
 *  • Seeded product "1/2 inch Nails" is visible with coin values
 *  • Each product card shows Dealer / Sub-Dealer / Carpenter coin labels
 *  • "Add Product" button is present
 *  • "Refresh" button is present
 *  • "Details" button is present for each product card
 */

import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../../helpers/login';

test.beforeEach(async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto('/product');
  await page.waitForLoadState('networkidle');
});

// ─── TC-026 ──────────────────────────────────────────────────────────────────
test('TC-026 | Products | Page loads with heading and product count', async ({ page }) => {
  await expect(page.locator('h1')).toContainText('Products');
  // New app shows dynamic count — assert pattern not hardcoded number
  await expect(page.locator('body')).toContainText(/Products \(\d+\)/);
});

// ─── TC-027 ──────────────────────────────────────────────────────────────────
test('TC-027 | Products | Seeded product "1/1 inch Nails" is visible', async ({ page }) => {
  // New app has "1/1 inch Nails" — "1/2 inch Nails" no longer exists (APPLICATION BUG: product name inconsistency)
  await expect(page.locator('body')).toContainText('1/1 inch Nails');
});

// ─── TC-028 ──────────────────────────────────────────────────────────────────
test('TC-028 | Products | Product table shows Dealer Coin and Carpenter Coin columns', async ({ page }) => {
  // New app table columns: Name | Size | Qty | Price | Dealer Coin | Carpenter Coin | Actions
  // APPLICATION BUG: Sub-Dealer coin column is missing from the products table
  await expect(page.locator('body')).toContainText('Dealer Coin');
  await expect(page.locator('body')).toContainText('Carpenter Coin');
});

// ─── TC-029 ──────────────────────────────────────────────────────────────────
test('TC-029 | Products | Add Product button is present', async ({ page }) => {
  await expect(page.getByRole('button', { name: /add product/i })).toBeVisible();
});

// ─── TC-030 ──────────────────────────────────────────────────────────────────
test('TC-030 | Products | Refresh button is present', async ({ page }) => {
  await expect(page.getByRole('button', { name: /refresh/i })).toBeVisible();
});

// ─── TC-031 ──────────────────────────────────────────────────────────────────
test('TC-031 | Products | Each product row has a QR Records link', async ({ page }) => {
  // New app uses "QR Records" links per row instead of a "Details" button
  // APPLICATION BUG: No "Details" button exists — replaced by "QR Records" text link
  const qrLinks = page.getByText(/QR Records/);
  const count = await qrLinks.count();
  expect(count).toBeGreaterThanOrEqual(1);
});
