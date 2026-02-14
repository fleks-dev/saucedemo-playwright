import { Page, Locator, expect, test } from '@playwright/test';
import { DEFAULT_TIMEOUT } from '../constants';

export class BasePage {
  protected readonly page: Page;

  /**
   * Constructor for BasePage
   * @param page - Playwright Page instance
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Get element by data-test attribute
   * @param selector - data-test attribute value
   * @returns Locator - Element locator
   */
  getEl(selector: string): Locator {
    return this.page.locator(`[data-test="${selector}"]`);
  }

  /**
   * Log expected step
   * Helps with test debugging and reporting
   * @param message - Step description
   */
  logStep(message: string): void {
    test.info().annotations.push({
      type: 'step',
      description: message,
    });
    console.log(`📝 Step: ${message}`);
  }

  /**
   * Wait for loading spinner to disappear
   * @param timeout - Optional timeout in milliseconds
   * @returns Promise<void>
   */
  async waitForLoader(timeout?: number): Promise<void> {
    const loaders = [
      '.loader',
      '[class*="loader"]',
      '[class*="Loader"]',
      '[class*="spinner"]',
      '[class*="Spinner"]',
      '[data-test="loader"]',
    ];

    for (const loader of loaders) {
      const element = this.page.locator(loader).first();
      if (await element.isVisible().catch(() => false)) {
        await element.waitFor({
          state: 'hidden',
          timeout: timeout || DEFAULT_TIMEOUT,
        });
      }
    }
  }

  /**
   * Navigate to a specific URL
   * @param url - URL path to navigate to
   * @returns Promise<BasePage> - Returns this instance for chaining
   */
  async goto(url: string): Promise<BasePage> {
    await this.page.goto(url);
    return this;
  }

  /**
   * Get current page URL
   * @returns Promise<string> - Current URL
   */
  async getUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get current page title
   * @returns Promise<string> - Page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Wait for a specific URL pattern
   * @param urlPattern - URL pattern to wait for (string or regex)
   * @param options - Wait options
   * @returns Promise<void>
   */
  async waitForUrl(urlPattern: string | RegExp, options?: { timeout?: number }): Promise<void> {
    await this.page.waitForURL(urlPattern, {
      timeout: options?.timeout || DEFAULT_TIMEOUT,
    });
  }

  /**
   * Verify element is visible
   * @param locator - Element locator
   * @param options - Expect options
   * @returns Promise<void>
   */
  async verifyVisible(locator: Locator, options?: { timeout?: number }): Promise<void> {
    await expect(locator).toBeVisible({
      timeout: options?.timeout || DEFAULT_TIMEOUT,
    });
  }

  /**
   * Verify element is enabled
   * @param locator - Element locator
   * @param options - Expect options
   * @returns Promise<void>
   */
  async verifyEnabled(locator: Locator, options?: { timeout?: number }): Promise<void> {
    await expect(locator).toBeEnabled({
      timeout: options?.timeout || DEFAULT_TIMEOUT,
    });
  }

  /**
   * Verify element has text
   * @param locator - Element locator
   * @param text - Expected text
   * @param options - Expect options
   * @returns Promise<void>
   */
  async verifyText(
    locator: Locator,
    text: string | RegExp,
    options?: { timeout?: number }
  ): Promise<void> {
    await expect(locator).toHaveText(text, {
      timeout: options?.timeout || DEFAULT_TIMEOUT,
    });
  }

  /**
   * Wait for element to be visible
   * @param locator - Element locator
   * @param timeout - Optional timeout in milliseconds
   * @returns Promise<void>
   */
  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({
      state: 'visible',
      timeout: timeout || DEFAULT_TIMEOUT,
    });
  }

  /**
   * Wait for element to be hidden
   * @param locator - Element locator
   * @param timeout - Optional timeout in milliseconds
   * @returns Promise<void>
   */
  async waitForElementHidden(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({
      state: 'hidden',
      timeout: timeout || DEFAULT_TIMEOUT,
    });
  }

  /**
   * Scroll page by specified amount
   * @param pixels - Number of pixels to scroll
   * @returns Promise<void>
   */
  async scrollPage(pixels: number): Promise<void> {
    await this.page.evaluate(px => window.scrollBy(0, px), pixels);
  }

  /**
   * Scroll element into view
   * @param locator - Element locator
   * @returns Promise<void>
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Take a screenshot
   * @param filename - Screenshot filename
   * @returns Promise<void>
   */
  async takeScreenshot(filename: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/${filename}`,
      fullPage: true,
    });
  }
}
