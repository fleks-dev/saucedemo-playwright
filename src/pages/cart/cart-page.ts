import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { Product } from '@/constants';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get cartButton(): Locator {
    return this.getEl('shopping-cart-link');
  }

  get title(): Locator {
    return this.getEl('title');
  }

  get continueShoppingButton(): Locator {
    return this.getEl('continue-shopping');
  }

  get checkoutButton(): Locator {
    return this.getEl('checkout');
  }

  get cartContentsContainer(): Locator {
    return this.getEl('cart-contents-container');
  }

  get cartItems(): Locator {
    return this.cartContentsContainer.locator('[data-test="inventory-item"]');
  }

  get cartItemByName(): (name: string) => Locator {
    return (name: string) => this.cartItems.filter({ hasText: name });
  }

  get cartItemPrice(): (name: string) => Locator {
    return (name: string) =>
      this.cartItemByName(name).locator('[data-test="inventory-item-price"]');
  }

  get cartItemDesc(): (name: string) => Locator {
    return (name: string) => this.cartItemByName(name).locator('[data-test="inventory-item-desc"]');
  }

  get cartItemRemoveButton(): (name: string) => Locator {
    return (name: string) => this.cartItemByName(name).getByText('Remove');
  }

  get cartBadge(): Locator {
    return this.cartButton.locator('[data-test="shopping-cart-badge"]');
  }

  async openCart(): Promise<void> {
    await this.cartButton.click();
    await this.verifyCartIsOpen();
  }

  async verifyCartIsOpen(): Promise<void> {
    await expect(this.page).toHaveURL(url => url.toString().includes('/cart.html'));
    await this.verifyText(this.title, 'Your Cart');
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async verifyProductInCart(product: Product): Promise<void> {
    await this.verifyVisible(this.cartItemByName(product.name));
    await expect(this.cartItemPrice(product.name)).toBeVisible();
    await expect(this.cartItemPrice(product.name)).toHaveText(`$${product.price.toString()}`);
    await expect(this.cartItemDesc(product.name)).toHaveText(product.description);
  }

  async removeProductFromCart(product: Product): Promise<void> {
    await this.verifyVisible(this.cartItemByName(product.name));
    await this.cartItemRemoveButton(product.name).click();
  }

  async verifyCartIsEmpty(): Promise<void> {
    await expect(this.cartItems).toHaveCount(0);
  }

  async verifyCartBadgeIsEmpty(): Promise<void> {
    await expect(this.cartBadge).not.toBeVisible();
  }

  async verifyCartBadgeNotEmpty(numberOfItems: number): Promise<void> {
    await this.verifyVisible(this.cartBadge);
    await expect(this.cartBadge).toHaveText(numberOfItems.toString());
  }
}
