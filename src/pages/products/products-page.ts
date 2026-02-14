import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { PRODUCTS, DEFAULT_FILTER, FILTERS } from '@/constants';
import { sleep } from '@/helpers';

export class ProductsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get inventoryContainer(): Locator {
    return this.getEl('inventory-container');
  }

  get inventoryItems(): Locator {
    return this.getEl('inventory-item');
  }

  get inventoryItemByName(): (name: string) => Locator {
    return (name: string) => this.inventoryItems.filter({ hasText: name });
  }

  get inventoryItemName(): (el: Locator) => Locator {
    return (el: Locator) => el.locator('[data-test="inventory-item-name"]');
  }

  get inventoryItemPrice(): (el: Locator) => Locator {
    return (el: Locator) => el.locator('[data-test="inventory-item-price"]');
  }

  get inventoryItemDescription(): (el: Locator) => Locator {
    return (el: Locator) => el.locator('[data-test="inventory-item-desc"]');
  }

  get inventoryItemImage(): (el: Locator) => Locator {
    return (el: Locator) => el.locator('img[class="inventory_item_img"]');
  }

  get addToCartButton(): (el: Locator) => Locator {
    return (el: Locator) => el.getByText('Add to Cart');
  }

  get removeButton(): (el: Locator) => Locator {
    return (el: Locator) => el.getByText('Remove');
  }

  get secondaryHeader(): Locator {
    return this.getEl('secondary-header');
  }

  get filterButton(): Locator {
    return this.secondaryHeader.locator('[class="right_component"]');
  }

  get filterOptionsDropdown(): Locator {
    return this.filterButton.locator('[data-test="product-sort-container"]');
  }

  get title(): Locator {
    return this.getEl('title');
  }

  async verifyProductsPageIsLoaded(): Promise<void> {
    await this.verifyVisible(this.inventoryContainer);
    await this.verifyText(this.title, 'Products');
    await this.verifyVisible(this.title);

    await expect(this.inventoryItems).toHaveCount(6);
  }

  async verifyProductsLoadedCorrectly(): Promise<void> {
    for (let i = 0; i < PRODUCTS.length; i++) {
      const product = PRODUCTS[i];
      const productEl = this.inventoryItemByName(product.name);

      await this.verifyVisible(productEl);
      await this.verifyText(this.inventoryItemName(productEl), product.name);
      await this.verifyText(this.inventoryItemPrice(productEl), `$${product.price}`);
      await this.verifyText(this.inventoryItemDescription(productEl), product.description);
      await this.verifyVisible(this.inventoryItemImage(productEl));
      await expect(this.inventoryItemImage(productEl)).toHaveAttribute(
        'src',
        new RegExp(product.image)
      );

      await this.verifyVisible(this.addToCartButton(productEl));
      await expect(this.addToCartButton(productEl)).toBeEnabled();
    }
  }

  async verifyFilters(): Promise<void> {
    await this.verifyVisible(this.filterButton);
    await expect(this.filterButton.locator('[data-test="active-option"]')).toHaveText(
      DEFAULT_FILTER
    );

    await expect(this.filterOptionsDropdown.locator('option')).toHaveCount(FILTERS.length);

    for (let i = 0; i < FILTERS.length; i++) {
      const option = this.filterOptionsDropdown.locator('option').nth(i);
      await this.verifyText(option, FILTERS[i]);

      await this.filterOptionsDropdown.selectOption(FILTERS[i]);
    }
  }

  async addProductToCart(productName: string): Promise<void> {
    const productEl = this.inventoryItemByName(productName);
    this.addToCartButton(productEl).click();
    await sleep(1000);

    await expect(this.removeButton(productEl)).toBeVisible();
    await expect(this.addToCartButton(productEl)).toBeHidden();
  }
}
