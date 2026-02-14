import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { Product } from '@/constants';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get title(): Locator {
    return this.getEl('title');
  }

  get firstNameInput(): Locator {
    return this.getEl('firstName');
  }

  get lastNameInput(): Locator {
    return this.getEl('lastName');
  }

  get zipCodeInput(): Locator {
    return this.getEl('postalCode');
  }

  get continueButton(): Locator {
    return this.getEl('continue');
  }

  get errorMessage(): Locator {
    return this.getEl('error');
  }

  get cancelButton(): Locator {
    return this.getEl('cancel');
  }

  get finishButton(): Locator {
    return this.getEl('finish');
  }

  get paymentInfoLabel(): Locator {
    return this.getEl('payment-info-label');
  }

  get paymentInfoValue(): Locator {
    return this.getEl('payment-info-value');
  }

  get shippingInfoLabel(): Locator {
    return this.getEl('shipping-info-label');
  }

  get shippingInfoValue(): Locator {
    return this.getEl('shipping-info-value');
  }

  get totalInfoLabel(): Locator {
    return this.getEl('total-info-label');
  }

  get totalInfoValue(): Locator {
    return this.getEl('subtotal-label');
  }

  get taxInfoValue(): Locator {
    return this.getEl('tax-label');
  }

  get totalLabel(): Locator {
    return this.getEl('total-label');
  }

  get homeButton(): Locator {
    return this.getEl('back-to-products');
  }

  async verifyCheckoutPageIsLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(url => url.toString().includes('/checkout-step-one.html'));
    await this.verifyText(this.title, 'Checkout: Your Information');

    await this.verifyVisible(this.firstNameInput);
    await this.verifyVisible(this.lastNameInput);
    await this.verifyVisible(this.zipCodeInput);
    await this.verifyVisible(this.continueButton);

    await expect(this.firstNameInput).toHaveValue('');
    await expect(this.lastNameInput).toHaveValue('');
    await expect(this.zipCodeInput).toHaveValue('');
    await expect(this.continueButton).toHaveValue('Continue');

    await this.verifyEnabled(this.firstNameInput);
    await this.verifyEnabled(this.lastNameInput);
    await this.verifyEnabled(this.zipCodeInput);
    await this.verifyEnabled(this.continueButton);
  }

  async clickContinueButton(): Promise<void> {
    await this.continueButton.click();
  }

  async verifyErrors(): Promise<void> {
    await this.verifyFirstNameError();
    await this.verifyLastNameError();
    await this.verifyZipCodeError();
    await this.verifyErrorMessage();
  }

  async verifyFirstNameError(): Promise<CheckoutPage> {
    await this.verifyVisible(
      this.firstNameInput.locator('..').locator('svg[data-icon="times-circle"]')
    );
    return this;
  }

  async verifyLastNameError(): Promise<CheckoutPage> {
    await this.verifyVisible(
      this.lastNameInput.locator('..').locator('svg[data-icon="times-circle"]')
    );
    return this;
  }

  async verifyZipCodeError(): Promise<CheckoutPage> {
    await this.verifyVisible(
      this.zipCodeInput.locator('..').locator('svg[data-icon="times-circle"]')
    );
    return this;
  }

  async verifyErrorMessage(): Promise<CheckoutPage> {
    await this.verifyVisible(this.errorMessage);
    await this.verifyText(this.errorMessage, 'Error: First Name is required');
    return this;
  }

  async fillFirstName(firstName: string): Promise<CheckoutPage> {
    await this.firstNameInput.clear();
    await this.firstNameInput.fill(firstName);
    return this;
  }

  async fillLastName(lastName: string): Promise<CheckoutPage> {
    await this.lastNameInput.clear();
    await this.lastNameInput.fill(lastName);
    return this;
  }

  async fillZipCode(zipCode: string): Promise<CheckoutPage> {
    await this.zipCodeInput.clear();
    await this.zipCodeInput.fill(zipCode);
    return this;
  }

  async verifyOverviewDisplayedCorrectly(productsArr: Product[]): Promise<void> {
    await this.verifyText(this.title, 'Checkout: Overview');
    await this.verifyVisible(this.finishButton);
    await this.verifyVisible(this.cancelButton);
    await this.verifyVisible(this.paymentInfoLabel);
    await this.verifyVisible(this.paymentInfoValue);
    await this.verifyVisible(this.shippingInfoLabel);
    await this.verifyVisible(this.shippingInfoValue);
    await this.verifyVisible(this.totalInfoLabel);
    await this.verifyVisible(this.totalInfoValue);
    await this.verifyVisible(this.taxInfoValue);
    await this.verifyVisible(this.totalLabel);

    await this.verifyText(this.paymentInfoLabel, 'Payment Information:');
    await this.verifyText(this.shippingInfoLabel, 'Shipping Information:');
    await this.verifyText(this.totalInfoLabel, 'Price Total');

    await this.verifyText(this.paymentInfoValue, 'SauceCard #31337');
    await this.verifyText(this.shippingInfoValue, 'Free Pony Express Delivery!');

    const totalPrice = productsArr.reduce((acc, product) => acc + product.price, 0);

    await expect(this.totalInfoValue).toHaveText(`Item total: $${totalPrice.toFixed(2)}`);
    await expect(this.taxInfoValue).toHaveText(`Tax: $${(totalPrice * 0.08).toFixed(2)}`);
    await expect(this.totalLabel).toHaveText(`Total: $${(totalPrice * 1.08).toFixed(2)}`);
  }

  async clickFinishButton(): Promise<void> {
    await this.finishButton.click();
  }

  async verifyCheckoutSuccess(): Promise<void> {
    await this.verifyText(this.title, 'Checkout: Complete!');
    await this.verifyVisible(this.page.getByText('Thank you for your order!'));
    await this.verifyVisible(
      this.page.getByText(
        'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
      )
    );
  }
}
