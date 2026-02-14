import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

if (!process.env.BASE_URL) {
  process.env.BASE_URL = 'https://www.saucedemo.com';
}

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  /* Match test files */
  testMatch: '**/*.spec.ts',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: require('path').join(__dirname, 'playwright-report'), open: 'never' }],
    [
      'junit',
      { outputFile: require('path').join(__dirname, 'playwright-reports/junit-results.xml') },
    ],
    [
      'json',
      { outputFile: require('path').join(__dirname, 'playwright-reports/test-results.json') },
    ],
    ['list'],
    ...(process.env.CI ? [['github'] as const] : []),
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com/',

    /* Set timezone for browser context */
    timezoneId: 'Europe/Sarajevo',

    /* Set locale for consistent date formatting */
    locale: 'en-US',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Record video on failure */
    video: 'off',

    /* Global timeout for each action */
    actionTimeout: 30000,

    /* Global timeout for navigation */
    navigationTimeout: 30000,

    /* Accept downloads */
    acceptDownloads: true,

    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--disable-blink-features=AutomationControlled',
          ],
        },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
      // Only run tests tagged with @cross-browser
      testMatch: /.*cross-browser.*\.spec\.ts/,
    },
    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
        viewport: { width: 1920, height: 1080 },
        channel: 'msedge',
      },
      // Only run tests tagged with @cross-browser
      testMatch: /.*cross-browser.*\.spec\.ts/,
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
      // Only run tests tagged with @cross-browser
      testMatch: /.*cross-browser.*\.spec\.ts/,
    },
    // Mobile projects - only included when INCLUDE_MOBILE=true or --project flag is used
    ...(process.env.INCLUDE_MOBILE === 'true'
      ? [
          {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
          },
          {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 13'] },
          },
          {
            name: 'iPhone 13 Pro',
            use: { ...devices['iPhone 13 Pro'] },
          },
          {
            name: 'Pixel 7',
            use: { ...devices['Pixel 7'] },
          },
        ]
      : []),
  ],

  /* Global setup and teardown */
  globalSetup: require.resolve('./tests/global-setup.ts'),
  globalTeardown: require.resolve('./tests/global-teardown.ts'),

  /* Test timeout */
  timeout: 600000,

  /* Expect timeout */
  expect: {
    timeout: 10000,
  },

  /* Output directory for test artifacts - absolute path to ensure consistency */
  outputDir: require('path').join(__dirname, 'test-results'),
});
