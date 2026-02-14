import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for Playwright tests
 * Runs once before all tests
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Playwright test suite setup...');

  // Set environment variables
  const baseURL =
    process.env.BASE_URL || config.projects[0].use?.baseURL || 'https://www.saucedemo.com/';
  const environment = process.env.NODE_ENV || 'staging';

  console.log(`📍 Environment: ${environment}`);
  console.log(`🌐 Base URL: ${baseURL}`);

  // Check if base URL is accessible
  try {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('🔍 Checking base URL accessibility...');
    await page.goto(baseURL, { timeout: 30000 });

    const title = await page.title();
    console.log(`✅ Base URL accessible - Page title: ${title}`);

    await browser.close();
  } catch (error) {
    console.error(`❌ Failed to access base URL: ${baseURL}`);
    console.error('Error:', error);
    throw new Error(`Base URL ${baseURL} is not accessible`);
  }

  // Set timezone for consistent test execution
  process.env.TZ = 'Europe/Sarajevo';

  // Set global test data
  const startTime = new Date();
  process.env.TEST_START_TIME = startTime.toISOString();
  process.env.TEST_RUN_ID = `playwright-${Date.now()}`;

  console.log(`🆔 Test Run ID: ${process.env.TEST_RUN_ID}`);
  console.log(
    `⏰ Test start time (CET): ${startTime.toLocaleString('en-US', { timeZone: 'Europe/Sarajevo' })}`
  );
  console.log('✅ Global setup completed successfully');
}

export default globalSetup;
