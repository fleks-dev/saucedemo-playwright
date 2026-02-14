import { FullConfig } from '@playwright/test';

/**
 * Global teardown for Playwright tests
 * Runs once after all tests
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting Playwright test suite teardown...');

  const testStartTime = process.env.TEST_START_TIME;
  const testRunId = process.env.TEST_RUN_ID;
  const endTime = new Date();
  const endTimeISO = endTime.toISOString();

  console.log(`🆔 Test Run ID: ${testRunId}`);
  console.log(`⏰ Test started: ${testStartTime}`);
  console.log(`⏰ Test ended: ${endTimeISO}`);
  console.log(
    `⏰ Test ended (CET): ${endTime.toLocaleString('en-US', { timeZone: 'Europe/Sarajevo' })}`
  );

  if (testStartTime) {
    const startTime = new Date(testStartTime);
    const duration = Date.now() - startTime.getTime();
    const durationMinutes = Math.round((duration / 1000 / 60) * 100) / 100;
    console.log(`⏱️  Total duration: ${durationMinutes} minutes`);
  }

  // Cleanup operations
  console.log('🧹 Performing cleanup operations...');
  console.log('✅ Global teardown completed successfully');
}

export default globalTeardown;
