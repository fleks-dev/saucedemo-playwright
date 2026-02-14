import { Page, BrowserContext, test } from '../base-test';
import { LoginPage, ProductsPage } from '@/pages';
import * as allUsers from '@fixtures/users.json';

const users = allUsers['staging'].default;

test.describe('[login] Standard user (login)', () => {
  test.describe.configure({ mode: 'serial' });

  let page: Page;
  let context: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
  });

  test.afterAll(async () => {
    page && (await page.close());
    context && (await context.close());
  });

  test('login with valid credentials', async () => {
    const loginPage = new LoginPage(page);
    await loginPage.login({
      username: users.username,
    });
  });

  test('verify products page is loaded', async () => {
    const productsPage = new ProductsPage(page);
    await productsPage.verifyProductsPageIsLoaded();
  });
});
