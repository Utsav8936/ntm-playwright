/**
 * ════════════════════════════════════════════════════════════════════
 *  MODULE  : Users (Carpenters)
 *  FILE    : 04-users.spec.ts
 *  APP     : NTM Loyalty Console
 *  COVERS  : TC-020 → TC-025
 * ════════════════════════════════════════════════════════════════════
 *
 *  WHAT IS BEING TESTED
 *  ─────────────────────
 *  • Users page loads with heading and user count
 *  • Table shows correct column headers
 *  • Seeded carpenter data is visible
 *  • Status filter buttons exist
 *  • Refresh button is present
 *  • Sidebar navigation to Users works via click
 */

import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../helpers/login';

test.beforeEach(async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto('/users-list');
  await page.waitForLoadState('networkidle');
});

// ─── TC-020 ──────────────────────────────────────────────────────────────────
test('TC-020 | Users | Page loads with heading and user count', async ({ page }) => {
  await expect(page.locator('h1')).toContainText('Users');
  await expect(page.locator('body')).toContainText('users found');
});

// ─── TC-021 ──────────────────────────────────────────────────────────────────
test('TC-021 | Users | Table has correct column headers', async ({ page }) => {
  // New app table columns — Sub-Dealer column removed, columns are now:
  // User | Phone | Carpenter Code | Referral Code | City / State | Total Scans | Points | Status
  const columns = ['User', 'Phone', 'Carpenter Code', 'Referral Code', 'City / State', 'Total Scans', 'Points', 'Status'];
  for (const col of columns) {
    await expect(page.locator('table')).toContainText(col);
  }
});

// ─── TC-022 ──────────────────────────────────────────────────────────────────
test('TC-022 | Users | Seeded carpenter "ankit" is visible with correct code', async ({ page }) => {
  await expect(page.locator('body')).toContainText('ankit');
  await expect(page.locator('body')).toContainText('NTM-CARP-885394');
});

// ─── TC-023 ──────────────────────────────────────────────────────────────────
test('TC-023 | Users | Status filter buttons are all present', async ({ page }) => {
  // Scope to <main> and use exact:true to avoid matching status badges in table rows
  const main = page.locator('main');
  for (const status of ['ACTIVE', 'PENDING', 'DEACTIVE', 'SUSPENDED']) {
    await expect(main.getByRole('button', { name: status, exact: true }).first()).toBeVisible();
  }
});

// ─── TC-024 ──────────────────────────────────────────────────────────────────
test('TC-024 | Users | Refresh button is present', async ({ page }) => {
  await expect(page.getByRole('button', { name: /refresh/i })).toBeVisible();
});

// ─── TC-025 ──────────────────────────────────────────────────────────────────
test('TC-025 | Users | Sidebar link navigates to /users-list', async ({ page }) => {
  await page.goto('/dashboard');
  await page.locator('aside').getByRole('link', { name: 'Users' }).click();
  await page.waitForURL('**/users-list');
  await expect(page).toHaveURL(/users-list/);
});
