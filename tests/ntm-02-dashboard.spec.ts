/**
 * ════════════════════════════════════════════════════════════════════
 *  MODULE  : Dashboard
 *  FILE    : 02-dashboard.spec.ts
 *  APP     : NTM Loyalty Console
 *  COVERS  : TC-006 → TC-012
 * ════════════════════════════════════════════════════════════════════
 *
 *  WHAT IS BEING TESTED
 *  ─────────────────────
 *  • All 4 KPI stat cards are visible with numeric values
 *  • Scan activity chart section renders
 *  • Top carpenters leaderboard is visible
 *  • Pending redemptions panel is visible
 *  • All 16 sidebar navigation links are present
 *  • Sidebar shows "Signed in as Admin"
 *  • Page title is correct
 */

import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../helpers/login';

test.beforeEach(async ({ page }) => {
  await loginAsAdmin(page);
});

// ─── TC-006 ──────────────────────────────────────────────────────────────────
test('TC-006 | Dashboard | All 4 KPI stat cards are visible', async ({ page }) => {
  // The app renders labels in sentence-case inside <main> — scope there to avoid
  // strict-mode violations from sidebar links that share similar text
  const main = page.locator('main');
  await expect(main.getByText('Dealers',    { exact: true })).toBeVisible();
  await expect(main.getByText('Carpenters', { exact: true })).toBeVisible();
  await expect(main.getByText('QR products',{ exact: true })).toBeVisible();
  await expect(main.getByText('Coins issued',{ exact: true })).toBeVisible();
});

// ─── TC-007 ──────────────────────────────────────────────────────────────────
test('TC-007 | Dashboard | KPI cards show numeric values', async ({ page }) => {
  // Scope to <main> so the stat-value paragraphs are uniquely matched
  const main = page.locator('main');
  await expect(main.locator('p.stat-value, [class*="stat-value"]').first()).toBeVisible();
  await expect(main.getByText('1,545', { exact: true })).toBeVisible(); // COINS ISSUED
});

// ─── TC-008 ──────────────────────────────────────────────────────────────────
test('TC-008 | Dashboard | Scan activity chart section is rendered', async ({ page }) => {
  await expect(page.getByText(/scan activity/i)).toBeVisible();
  // Chart must render a canvas or SVG element
  await expect(page.locator('canvas, svg').first()).toBeVisible();
});

// ─── TC-009 ──────────────────────────────────────────────────────────────────
test('TC-009 | Dashboard | Top carpenters leaderboard shows ranked entries', async ({ page }) => {
  await expect(page.getByText('Top carpenters')).toBeVisible();
  // Seeded top carpenter
  await expect(page.getByText('ankit')).toBeVisible();
});

// ─── TC-010 ──────────────────────────────────────────────────────────────────
test('TC-010 | Dashboard | Pending redemptions panel is visible', async ({ page }) => {
  await expect(page.getByText(/pending redemptions/i)).toBeVisible();
  await expect(page.getByText('Suresh Patel')).toBeVisible();
  await expect(page.getByText('Vikram Singh')).toBeVisible();
});

// ─── TC-011 ──────────────────────────────────────────────────────────────────
test('TC-011 | Dashboard | Sidebar contains all 18 navigation links', async ({ page }) => {
  const navLinks = [
    'Dashboard', 'Dealers', 'Users', 'Products', 'Banners', 'Pages', 'Rewards Store', 'Redemptions',
    'Referrals', 'Languages', 'Notifications',
    'States', 'Cities', 'Districts', 'Orders', 'Dynamic Values',
    'Bulk SMS', 'App Store QR',
  ];
  for (const link of navLinks) {
    await expect(page.locator('aside').getByText(link)).toBeVisible();
  }
});

// ─── TC-012 ──────────────────────────────────────────────────────────────────
test('TC-012 | Dashboard | Sidebar shows "Signed in as Admin"', async ({ page }) => {
  await expect(page.locator('aside')).toContainText('Signed in as');
  await expect(page.locator('aside')).toContainText('Admin');
});
