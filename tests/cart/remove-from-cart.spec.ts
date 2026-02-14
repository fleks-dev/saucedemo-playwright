import { test, BrowserContext, Page, expect } from '../base-test';
import { LoginPage, CartPage, ProductsPage } from '@/pages';
import * as allUsers from '@fixtures/users.json';

import { PRODUCTS } from '@/constants';

const users = allUsers['staging'].default;

test.describe('[cart] Remove from cart', () => {
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

  test('open cart and  verify it is open', async () => {
    const cartPage = new CartPage(page);
    await cartPage.openCart();
  });

  test('continue shopping', async () => {
    const cartPage = new CartPage(page);
    await cartPage.openCart();
    await cartPage.continueShopping();
  });

  test(`add ${PRODUCTS[2].name} to cart`, async () => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    await productsPage.addProductToCart(PRODUCTS[2].name);
    await cartPage.openCart();
    await cartPage.verifyProductInCart(PRODUCTS[2]);
    await cartPage.continueShopping();
  });

  test(`add ${PRODUCTS[3].name} to cart`, async () => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    await productsPage.addProductToCart(PRODUCTS[3].name);
    await cartPage.openCart();
    await cartPage.verifyProductInCart(PRODUCTS[3]);
  });

  test('verify both items can be removed', async () => {
    const cartPage = new CartPage(page);
    await cartPage.openCart();
    await cartPage.removeProductFromCart(PRODUCTS[2]);
    await cartPage.removeProductFromCart(PRODUCTS[3]);
    await expect(cartPage.cartItems).toHaveCount(0);
    // TODO: Check cart icon and numbers
  });
});
