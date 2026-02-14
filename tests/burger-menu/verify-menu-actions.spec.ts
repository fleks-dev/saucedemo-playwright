import { test, expect, Page, BrowserContext } from '../base-test';
import { LoginPage, BurgerMenu, ProductsPage, CartPage } from '@/pages';
import * as allUsers from '@fixtures/users.json';
import { PRODUCTS } from '@/constants';

const users = allUsers['staging'].default;

test.describe('[burger] Verify burger menu actions', () => {
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

  test.beforeEach(async () => {
    await page.goto(`${process.env.BASE_URL}/inventory.html`);
  });

  test.afterAll(async () => {
    page && (await page.close());
    context && (await context.close());
  });

  test('verify menu and actions', async () => {
    const burgerMenu = new BurgerMenu(page);
    await burgerMenu.verifyVisible(burgerMenu.burgerMenu);
    await expect(burgerMenu.sidebar).toHaveAttribute('hidden', 'true');
    await burgerMenu.clickBurgerMenu();
    await burgerMenu.verifyMenuActionsAndSidebar();
  });

  test('verify "All items" link', async () => {
    const burgerMenu = new BurgerMenu(page);
    await burgerMenu.clickBurgerMenu();
    await burgerMenu.clickAllItems();
    await expect(page).toHaveURL(url => url.toString().includes('/inventory.html'));
  });

  test('verify "About" link', async () => {
    const burgerMenu = new BurgerMenu(page);
    await burgerMenu.clickBurgerMenu();
    await burgerMenu.clickAbout();
    await expect(page).toHaveURL(url => url.toString().includes('https://saucelabs.com/'));
  });

  test('verify "Logout" link', async () => {
    const burgerMenu = new BurgerMenu(page);
    await burgerMenu.clickBurgerMenu();
    await burgerMenu.clickLogout();
    await expect(page).toHaveURL(url => url.toString() === `${process.env.BASE_URL}/`);
  });

  test(`add ${PRODUCTS[0].name} to cart`, async () => {
    test.step('log in again', async () => {
      const loginPage = new LoginPage(page);
      await loginPage.login({
        username: users.username,
      });
    });

    const productsPage = new ProductsPage(page);
    await productsPage.addProductToCart(PRODUCTS[0].name);
  });

  test('verify shopping cart badge', async () => {
    const cartPage = new CartPage(page);
    await cartPage.verifyCartBadgeNotEmpty(1);
  });

  test('verify "Reset App State" link', async () => {
    const burgerMenu = new BurgerMenu(page);
    await burgerMenu.clickBurgerMenu();
    await burgerMenu.clickResetApp();
  });

  test('verify cart is empty', async () => {
    const cartPage = new CartPage(page);
    await cartPage.verifyCartBadgeIsEmpty();
    await cartPage.openCart();
    await cartPage.verifyCartIsEmpty();
  });
});
