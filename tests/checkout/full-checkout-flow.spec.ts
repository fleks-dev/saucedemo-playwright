import { test, BrowserContext, Page, expect } from '../base-test';
import { LoginPage, CartPage, ProductsPage, CheckoutPage } from '@/pages';
import * as allUsers from '@fixtures/users.json';

import { PRODUCTS } from '@/constants';

const productsArr = [PRODUCTS[2], PRODUCTS[3], PRODUCTS[4]];

const users = allUsers['staging'].default;

test.describe('[checkout] Full checkout flow', () => {
  test.describe.configure({ mode: 'serial' });

  let page: Page;
  let context: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.login({
      username: users.username,
    });
  });

  test.afterAll(async () => {
    page && (await page.close());
    context && (await context.close());
  });

  /**
   * Loop through products and add them to cart
   */
  for (let i = 0; i < productsArr.length; i++) {
    test(`add ${productsArr[i].name} to cart`, async () => {
      const productsPage = new ProductsPage(page);
      const cartPage = new CartPage(page);

      await productsPage.addProductToCart(productsArr[i].name);
      await cartPage.verifyCartBadgeNotEmpty(i + 1);
      await cartPage.openCart();
      await cartPage.verifyProductInCart(productsArr[i]);
      await cartPage.continueShopping();
    });
  }

  /**
   * Checkout
   */
  test('checkout', async () => {
    const cartPage = new CartPage(page);

    await cartPage.openCart();
    await cartPage.checkout();
  });

  test('verify checkout page is displayed correctly', async () => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.verifyCheckoutPageIsLoaded();
    await checkoutPage.clickContinueButton();
  });

  test('verify error messages and we stayed on the same page', async () => {
    const checkoutPage = new CheckoutPage(page);

    await expect(page).toHaveURL(url => url.toString().includes('/checkout-step-one.html'));
    await checkoutPage.verifyErrors();
  });

  test('fill checkout form', async () => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.fillFirstName('John');
    await checkoutPage.fillLastName('Doe');
    await checkoutPage.fillZipCode('12345');
    await checkoutPage.clickContinueButton();
  });

  test('verify checkout overview page is displayed correctly', async () => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.verifyOverviewDisplayedCorrectly(productsArr);
    await checkoutPage.clickFinishButton();
  });

  test('verify success', async () => {
    const checkoutPage = new CheckoutPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await checkoutPage.verifyCheckoutSuccess();
    await checkoutPage.homeButton.click();
    await productsPage.verifyProductsPageIsLoaded();
    await cartPage.verifyCartBadgeIsEmpty();
  });

  test('verify cart is empty', async () => {
    const cartPage = new CartPage(page);

    await cartPage.openCart();
    await cartPage.verifyCartIsEmpty();
    await cartPage.verifyCartBadgeIsEmpty();
  });
});
