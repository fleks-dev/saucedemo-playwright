import { test as base } from '@playwright/test';
import * as path from 'path';

/**
 * Custom test fixture that automatically logs test file names
 * Import this instead of '@playwright/test' to get automatic file logging
 *
 * Usage:
 *   import { test, expect } from './base-test';
 */

// Global test environment storage
export const testEnv = {
  // Add your global variables here
  data: {} as Record<string, any>,

  set(key: string, value: any) {
    this.data[key] = value;
  },

  get(key: string) {
    return this.data[key];
  },

  has(key: string) {
    return key in this.data;
  },

  clear() {
    this.data = {};
  },
};

// Use auto-fixture to track and log file headers
type TestFixtures = {
  autoFileLogger: void;
};

type FileTestResults = {
  passed: number;
  failed: number;
  skipped: number;
  total: number;
};

type WorkerFixtures = {
  workerLoggedFiles: Set<string>;
  workerTestResults: Map<string, FileTestResults>;
};

// Track last file to detect file changes
let lastFilePath = '';
let lastFileName = '';

// Function to log file results
function logFileResults(fileName: string, results: FileTestResults) {
  console.log(`\n${'─'.repeat(80)}`);
  console.log(`📊 File Results: ${fileName}`);
  console.log(`   ✅ Passed: ${results.passed}`);
  if (results.failed > 0) console.log(`   ❌ Failed: ${results.failed}`);
  if (results.skipped > 0) console.log(`   ⊘ Skipped: ${results.skipped}`);
  console.log(`   📝 Total: ${results.total}`);
  console.log(`${'─'.repeat(80)}\n`);
}

export const test = base.extend<TestFixtures, WorkerFixtures>({
  // Worker-scoped storage for logged files
  workerLoggedFiles: [
    async ({}, use) => {
      const loggedFiles = new Set<string>();
      await use(loggedFiles);
    },
    { scope: 'worker' },
  ],

  // Worker-scoped storage for test results per file
  workerTestResults: [
    async ({}, use) => {
      const testResults = new Map<string, FileTestResults>();
      await use(testResults);

      // Worker teardown: log the final file's results
      if (lastFilePath && testResults.has(lastFilePath)) {
        const results = testResults.get(lastFilePath)!;
        logFileResults(lastFileName, results);
      }
    },
    { scope: 'worker' },
  ],

  // Auto-fixture that runs before every test and tracks results after
  autoFileLogger: [
    async ({ workerLoggedFiles, workerTestResults }, use, testInfo) => {
      const filePath = testInfo.file;
      const relativeFilePath = path.relative(process.cwd(), filePath);
      const fileName = path.basename(filePath);

      // Check if we're starting a new file (BEFORE logging new file header)
      if (lastFilePath && lastFilePath !== filePath) {
        // Log summary for the previous file first
        const prevResults = workerTestResults.get(lastFilePath);
        if (prevResults) {
          logFileResults(lastFileName, prevResults);
        }
      }

      // Log file header if this is the first test from this file
      if (!workerLoggedFiles.has(filePath)) {
        workerLoggedFiles.add(filePath);

        const separator = '='.repeat(80);
        console.log(`\n${separator}`);
        console.log(`📄 Test File: ${relativeFilePath}`);
        console.log(`${separator}\n`);
      }

      // Always log the test name
      console.log(`🧪 Test: ${testInfo.title}`);

      // Add annotation for better reporting
      testInfo.annotations.push({
        type: 'test-info',
        description: `[${fileName}] ${testInfo.title}`,
      });

      // Run the test
      await use();

      // AFTER test completes - track results
      // Initialize results for this file if not exists
      if (!workerTestResults.has(filePath)) {
        workerTestResults.set(filePath, { passed: 0, failed: 0, skipped: 0, total: 0 });
      }

      const results = workerTestResults.get(filePath)!;
      results.total++;

      // Track test status
      if (testInfo.status === 'passed') {
        results.passed++;
      } else if (testInfo.status === 'failed') {
        results.failed++;
      } else if (testInfo.status === 'skipped') {
        results.skipped++;
      }

      // Update last file tracker
      lastFilePath = filePath;
      lastFileName = fileName;
    },
    { auto: true },
  ],
});

// Re-export expect and other utilities
export { expect, Page, Browser, BrowserContext, Locator } from '@playwright/test';
