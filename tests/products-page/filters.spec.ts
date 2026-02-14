import { test } from '../base-test';
import { LoginPage, ProductsPage } from '@/pages';
import * as allUsers from '@fixtures/users.json';

const users = allUsers['staging'].default;

test.describe('[products-page] Verify filters', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login({
      username: users.username,
    });
  });

  test('verify filters', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.verifyFilters();
    // TODO: Check if products actually sorted
  });
});
