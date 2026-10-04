import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',

  // Run tests sequentially — safer for a shared demo app
  fullyParallel: false,
  workers: 1,

  // Retry once on failure before marking as failed
  retries: 1,

  // 45 s per test
  timeout: 45_000,

  // HTML report  →  open with: npx playwright show-report
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'https://appadmin.wirenails.in',

    // Capture screenshot on every failure (visible in the HTML report)
    screenshot: 'only-on-failure',

    // Record video on first retry so failures are easy to replay
    video: 'on-first-retry',

    // Full trace on first retry (viewable in the HTML report)
    trace: 'on-first-retry',

    actionTimeout:     20_000,
    navigationTimeout: 60_000,
  },

  projects: [
    {
      name: 'NTM Loyalty Console – Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'HelloDriver Admin',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.HD_BASE_URL ?? 'https://admindrls.swcapp.in',
        // OTP entry needs enough time — 2 minutes per test
        actionTimeout:     30_000,
        navigationTimeout: 60_000,
      },
      testMatch: '**/hellodriver/**/*.spec.ts',
    },
  ],
});
