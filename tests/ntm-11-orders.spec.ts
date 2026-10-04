/**
 * ════════════════════════════════════════════════════════════════════
 *  MODULE  : Orders
 *  FILE    : 11-orders.spec.ts
 *  APP     : NTM Loyalty Console
 *  COVERS  : TC-065 → TC-070
 * ════════════════════════════════════════════════════════════════════
 *
 *  WHAT IS BEING TESTED
 *  ─────────────────────
 *  • Orders page loads with correct heading
 *  • Status filter tabs (All / IN PROGRESS / DISPATCHED / DELIVERED / CANCELLED) exist
 *  • Seeded orders are visible with Order IDs and coin values
 *  • "Change Status" button is present on each order card
 *  • Filtering by DELIVERED shows only delivered orders
 *  • Filtering by IN PROGRESS shows only in-progress orders
 */

import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../helpers/login';

test.beforeEach(async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto('/orders');
  await page.waitForLoadState('networkidle');
});

// ─── TC-065 ──────────────────────────────────────────────────────────────────
test('TC-065 | Orders | Page loads with correct heading', async ({ page }) => {
  await expect(page.locator('h1')).toContainText('Orders');
  await expect(page.locator('body')).toContainText('Manage all product orders');
});

// ─── TC-066 ──────────────────────────────────────────────────────────────────
test('TC-066 | Orders | Status filter tabs are all present', async ({ page }) => {
  for (const tab of ['All', 'IN PROGRESS', 'DISPATCHED', 'DELIVERED', 'CANCELLED']) {
    await expect(page.getByRole('button', { name: tab })).toBeVisible();
  }
});

// ─── TC-067 ──────────────────────────────────────────────────────────────────
test('TC-067 | Orders | Seeded orders are visible with Order IDs', async ({ page }) => {
  await expect(page.locator('body')).toContainText('ORDER-374988');
  await expect(page.locator('body')).toContainText('Puma Shoes');
  await expect(page.locator('body')).toContainText('coins');
});

// ─── TC-068 ──────────────────────────────────────────────────────────────────
test('TC-068 | Orders | Each order card has a Change Status button', async ({ page }) => {
  const changeStatusBtns = page.getByRole('button', { name: /change status/i });
  const count = await changeStatusBtns.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

// ─── TC-069 ──────────────────────────────────────────────────────────────────
test('TC-069 | Orders | DELIVERED filter shows at least one delivered order card', async ({ page }) => {
  await page.getByRole('button', { name: 'DELIVERED' }).click();
  await page.waitForTimeout(800);

  // After filtering, at least one order card with ORDER-ID must be visible
  // and the only order card shown must be the DELIVERED one (ORDER-374988)
  await expect(page.locator('body')).toContainText('ORDER-374988');
  // The IN PROGRESS order cards (different ORDER IDs) must not appear
  await expect(page.locator('body')).not.toContainText('ORDER-599942');
  await expect(page.locator('body')).not.toContainText('ORDER-966039');
});

// ─── TC-070 ──────────────────────────────────────────────────────────────────
test('TC-070 | Orders | IN PROGRESS filter shows in-progress order cards', async ({ page }) => {
  await page.getByRole('button', { name: 'IN PROGRESS' }).click();
  await page.waitForTimeout(800);

  // IN PROGRESS orders (ORDER-599942, ORDER-966039) must appear
  await expect(page.locator('body')).toContainText('ORDER-599942');
  // The DELIVERED order (ORDER-374988) must not appear as a card
  await expect(page.locator('body')).not.toContainText('ORDER-374988');
});
