import { Page, BrowserContext, test } from '../base-test';
import { LoginPage, InventoryPage } from '@/pages';
import * as allUsers from '@fixtures/users.json';
import { ERROR_MESSAGES } from '@constants';

const users = allUsers['staging'].lockedOutUser;

test.describe('[login] Locked out user (login)', () => {
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

  test('login with locked out user credentials', async () => {
    const loginPage = new LoginPage(page);
    await loginPage.login({
      username: users.username,
      waitForLoad: false,
    });
  });

  test('verify error messages are displayed correctly', async () => {
    const loginPage = new LoginPage(page);
    await loginPage.verifyLoginErrors(ERROR_MESSAGES.LOCKED_OUT);
  });
});
