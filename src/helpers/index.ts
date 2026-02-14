/**
 * Core helper functions for test data generation
 */

import { test } from '@playwright/test';

/**
 * Log a test step for debugging and reporting
 * Can be used without a page instance
 * @param message - Step description
 */
export function logStep(message: string): void {
  test.info().annotations.push({
    type: 'step',
    description: message,
  });
  console.log(`📝 Step: ${message}`);
}

/**
 * Generate a random number between min and max (inclusive)
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns number - Random number
 */
export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Wait for a specified number of milliseconds
 * @param ms - Milliseconds to wait
 * @returns Promise<void>
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
