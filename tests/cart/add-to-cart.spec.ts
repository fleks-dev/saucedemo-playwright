import { test, BrowserContext, Page, expect } from '../base-test';
import { LoginPage, CartPage, ProductsPage } from '@/pages';
import * as allUsers from '@fixtures/users.json';

import { PRODUCTS } from '@/constants';

const users = allUsers['staging'].default;

test.describe('[cart] Add to cart', () => {
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

  test('verify cart badge is empty', async () => {
    const cartPage = new CartPage(page);
    await cartPage.verifyCartBadgeIsEmpty();
  });

  test('open cart and  verify it is open', async () => {
    const cartPage = new CartPage(page);
    await cartPage.openCart();
  });

  test('click continue shopping', async () => {
    const cartPage = new CartPage(page);
    await cartPage.continueShopping();
  });

  test(`add ${PRODUCTS[0].name} to cart`, async () => {
    const productsPage = new ProductsPage(page);
    await productsPage.addProductToCart(PRODUCTS[0].name);
  });

  test('verify one item is in cart', async () => {
    const cartPage = new CartPage(page);
    await cartPage.verifyCartBadgeNotEmpty(1);
    await cartPage.openCart();
    await cartPage.verifyProductInCart(PRODUCTS[0]);
    await cartPage.continueShopping();
  });

  test(`add ${PRODUCTS[1].name} to cart`, async () => {
    const productsPage = new ProductsPage(page);
    await productsPage.addProductToCart(PRODUCTS[1].name);
  });

  test('verify two items are in cart', async () => {
    const cartPage = new CartPage(page);
    await cartPage.verifyCartBadgeNotEmpty(2);
    await cartPage.openCart();

    await expect(cartPage.cartItems).toHaveCount(2);
  });
});
