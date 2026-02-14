import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { DEFAULT_USER_PASSWORD } from '@/constants';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get usernameInput(): Locator {
    return this.getEl('username');
  }

  get passwordInput(): Locator {
    return this.getEl('password');
  }

  get loginButton(): Locator {
    return this.getEl('login-button');
  }

  get loginContainer(): Locator {
    return this.page.locator('[id="login_button_container"]');
  }

  get errorMessage(): Locator {
    return this.loginContainer.locator('[data-test="error"]');
  }

  async login({
    username,
    password,
    waitForLoad = true,
  }: {
    username: string;
    password?: string;
    waitForLoad?: boolean;
  }) {
    await this.goto();

    await expect(this.usernameInput).toBeEnabled();
    await expect(this.passwordInput).toBeEnabled();
    await expect(this.loginButton).toBeEnabled();

    await this.fillUsername(username);
    await this.fillPassword(password || DEFAULT_USER_PASSWORD);

    await this.clickLogin();

    if (waitForLoad) {
      await this.page.waitForURL(url => url.toString().includes('/inventory.html'));
    } else {
      await this.page.waitForURL(url => url.toString() === `${process.env.BASE_URL}/`);
    }
  }

  /**
   * Navigate to login page
   * @returns Promise<LoginPage> - Returns this instance for chaining
   */
  async goto(): Promise<LoginPage> {
    await super.goto('/');
    await this.waitForPageLoad();
    return this;
  }

  /**
   * Wait for login page to load
   * @returns Promise<void>
   */
  async waitForPageLoad(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Fill username field
   * @param username - Username
   * @returns Promise<LoginPage> - Returns this instance for chaining
   */
  async fillUsername(username: string): Promise<LoginPage> {
    await this.usernameInput.clear();
    await this.usernameInput.fill(username);
    return this;
  }

  /**
   * Fill password field
   * @param password - Password
   * @returns Promise<LoginPage> - Returns this instance for chaining
   */
  async fillPassword(password: string): Promise<LoginPage> {
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
    return this;
  }

  /**
   * Click login button
   * @returns Promise<LoginPage> - Returns this instance for chaining
   */
  async clickLogin(): Promise<LoginPage> {
    await this.loginButton.click();
    return this;
  }

  async verifyUsernameError(): Promise<LoginPage> {
    await this.verifyVisible(
      this.usernameInput.locator('..').locator('svg[data-icon="times-circle"]')
    );
    return this;
  }

  async verifyPasswordError(): Promise<LoginPage> {
    await this.verifyVisible(
      this.passwordInput.locator('..').locator('svg[data-icon="times-circle"]')
    );
    return this;
  }

  async verifyErrorMessage(message: string): Promise<LoginPage> {
    await this.verifyVisible(this.errorMessage);
    await this.verifyText(this.errorMessage, message);
    return this;
  }

  async verifyLoginErrors(message: string): Promise<LoginPage> {
    await this.verifyUsernameError();
    await this.verifyPasswordError();
    await this.verifyErrorMessage(message);
    return this;
  }
}
