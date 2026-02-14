import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';

export class BurgerMenu extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get primaryHeader(): Locator {
    return this.getEl('primary-header');
  }

  get burgerMenu(): Locator {
    return this.primaryHeader.locator('[class="bm-burger-button"]');
  }

  get sidebar(): Locator {
    return this.page.locator('[class="bm-menu-wrap"]');
  }

  get allItems(): Locator {
    return this.sidebar.locator('[data-test="inventory-sidebar-link"]');
  }

  get about(): Locator {
    return this.sidebar.locator('[data-test="about-sidebar-link"]');
  }

  get logout(): Locator {
    return this.sidebar.locator('[data-test="logout-sidebar-link"]');
  }

  get resetApp(): Locator {
    return this.sidebar.locator('[data-test="reset-sidebar-link"]');
  }

  async clickAllItems(): Promise<void> {
    await this.allItems.click();
  }

  async clickAbout(): Promise<void> {
    await this.about.click();
  }

  async clickLogout(): Promise<void> {
    await this.logout.click();
  }

  async clickResetApp(): Promise<void> {
    await this.resetApp.click();
  }

  async verifyMenuActionsAndSidebar(): Promise<void> {
    await expect(this.sidebar).not.toHaveAttribute('hidden');

    await this.verifyVisible(this.allItems);
    await expect(this.allItems).toHaveText('All Items');

    await this.verifyVisible(this.about);
    await expect(this.about).toHaveText('About');
    await expect(this.about).toHaveAttribute('href', 'https://saucelabs.com/');

    await this.verifyVisible(this.logout);
    await expect(this.logout).toHaveText('Logout');

    await this.verifyVisible(this.resetApp);
    await expect(this.resetApp).toHaveText('Reset App State');
  }

  async clickBurgerMenu(): Promise<void> {
    await this.burgerMenu.click();
  }
}
