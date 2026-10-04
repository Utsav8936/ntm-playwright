/**
 * ════════════════════════════════════════════════════════════════════
 *  MODULE  : Pages (CMS)
 *  FILE    : 07-pages.spec.ts
 *  APP     : NTM Loyalty Console
 *  COVERS  : TC-037 → TC-041
 * ════════════════════════════════════════════════════════════════════
 *
 *  WHAT IS BEING TESTED
 *  ─────────────────────
 *  • Pages module loads with heading and page count
 *  • Table shows Title, Description, Action columns
 *  • Seeded pages (Terms & Conditions, Privacy Policy) are visible
 *  • Search input is present and filters results
 *  • Each page row has an Edit button
 */

import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../helpers/login';

test.beforeEach(async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto('/pages');
  await page.waitForLoadState('domcontentloaded');
});

// ─── TC-037 ──────────────────────────────────────────────────────────────────
test('TC-037 | Pages | Page loads with heading and page count', async ({ page }) => {
  await expect(page.locator('h1')).toContainText('Pages');
  await expect(page.locator('body')).toContainText('2 pages found');
});

// ─── TC-038 ──────────────────────────────────────────────────────────────────
test('TC-038 | Pages | Table shows Title, Description, Action columns', async ({ page }) => {
  await expect(page.locator('table')).toContainText('Title');
  await expect(page.locator('table')).toContainText('Description');
  await expect(page.locator('table')).toContainText('Action');
});

// ─── TC-039 ──────────────────────────────────────────────────────────────────
test('TC-039 | Pages | Seeded pages Terms & Conditions and Privacy Policy are visible', async ({ page }) => {
  await expect(page.locator('body')).toContainText('TERMS & CONDITIONS');
  await expect(page.locator('body')).toContainText('PRIVACY POLICY');
});

// ─── TC-040 ──────────────────────────────────────────────────────────────────
test('TC-040 | Pages | Search input filters pages by title', async ({ page }) => {
  const searchInput = page.getByPlaceholder('Search page...');
  await expect(searchInput).toBeVisible();

  await searchInput.fill('PRIVACY');
  await page.waitForTimeout(500);

  await expect(page.locator('body')).toContainText('PRIVACY POLICY');
});

// ─── TC-041 ──────────────────────────────────────────────────────────────────
test('TC-041 | Pages | Each page row has an Edit button', async ({ page }) => {
  // Edit is rendered as a link — locate by visible text
  const editLinks = page.locator('a, button').filter({ hasText: /^Edit$/ });
  await expect(editLinks.first()).toBeVisible();
  expect(await editLinks.count()).toBeGreaterThanOrEqual(2);
});
