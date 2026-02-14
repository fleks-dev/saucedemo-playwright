import { defineConfig } from '@playwright/test';
import baseConfig from '../playwright.config';

export default defineConfig({
  ...baseConfig,
  testDir: '../tests/cart',
  retries: 2,

  // Use blob reporter in CI for merging into single unified report
  reporter: process.env.CI ? [['blob']] : baseConfig.reporter,

  use: {
    ...baseConfig.use,
    video: 'retain-on-failure',
    trace: 'retain-on-failure', // Always capture trace for debugging
  },
});
