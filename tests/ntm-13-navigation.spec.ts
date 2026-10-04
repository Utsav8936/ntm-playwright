/**
 * ════════════════════════════════════════════════════════════════════
 *  MODULE  : Navigation & Security Guards
 *  FILE    : 13-navigation.spec.ts
 *  APP     : NTM Loyalty Console
 *  COVERS  : TC-075 → TC-079
 * ════════════════════════════════════════════════════════════════════
 *
 *  WHAT IS BEING TESTED
 *  ─────────────────────
 *  • Unauthenticated user cannot access /dashboard
 *  • Page title is "NTM Loyalty Console" on every page
 *  • Active sidebar link is highlighted on the current page
 *  • All 16 sidebar links navigate to the correct routes
 *  • Dashboard link in sidebar always returns to /dashboard
 */

import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../../helpers/login';

// ─── TC-075 ──────────────────────────────────────────────────────────────────
test('TC-075 | Navigation | Unauthenticated access to /dashboard redirects to login', async ({ page }) => {
  // Visit dashboard without logging in
  await page.goto('/dashboard');
  await page.waitForTimeout(2000);

  // Must be redirected to login (not stay on dashboard)
  await expect(page).not.toHaveURL(/dashboard/);
  await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
});

// ─── TC-076 ──────────────────────────────────────────────────────────────────
test('TC-076 | Navigation | Page title is "NTM Loyalty Console" on all pages', async ({ page }) => {
  await loginAsAdmin(page);

  const routes = ['/dashboard', '/dealers', '/users-list', '/product', '/orders', '/states'];
  for (const route of routes) {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle('NTM Loyalty Console');
  }
});

// ─── TC-077 ──────────────────────────────────────────────────────────────────
test('TC-077 | Navigation | Active sidebar link is highlighted on current page', async ({ page }) => {
  await loginAsAdmin(page);

  // On /dashboard the Dashboard link should have the active style (bg-sidebar-primary)
  const dashLink = page.locator('aside a[href="/dashboard"]');
  await expect(dashLink).toHaveClass(/bg-sidebar-primary/);
});

// ─── TC-078 ──────────────────────────────────────────────────────────────────
test('TC-078 | Navigation | All 16 sidebar links navigate to correct routes', async ({ page }) => {
  await loginAsAdmin(page);

  const navMap: Record<string, string> = {
    'Dashboard':      '/dashboard',
    'Dealers':        '/dealers',
    'Users':          '/users-list',
    'Products':       '/product',
    'QR Records':     '/qr-records',
    'Banners':        '/banners',
    'Pages':          '/pages',
    'Rewards Store':  '/rewards',
    'Redemptions':    '/redemptions',
    'Referrals':      '/referrals',
    'Languages':      '/languages',
    'Notifications':  '/notifications',
    'States':         '/states',
    'Cities':         '/city',
    'Districts':      '/district',
    'Orders':         '/orders',
    'Dynamic Values': '/dynamic-values',
    'Bulk SMS':       '/bulk-sms',
    'App Store QR':   '/app-store-qr',
  };

  for (const [label, expectedPath] of Object.entries(navMap)) {
    await page.locator('aside').getByRole('link', { name: label, exact: true }).click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain(expectedPath);
  }
});

// ─── TC-079 ──────────────────────────────────────────────────────────────────
test('TC-079 | Navigation | Dashboard sidebar link always returns to /dashboard', async ({ page }) => {
  await loginAsAdmin(page);

  // Navigate away first
  await page.goto('/orders');
  await page.waitForLoadState('networkidle');

  // Click Dashboard in sidebar
  await page.locator('aside').getByRole('link', { name: 'Dashboard', exact: true }).click();
  await page.waitForURL('**/dashboard');
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.locator('h1')).toContainText('Dashboard');
});
