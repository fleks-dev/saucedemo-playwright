import { test } from '../base-test';
import { LoginPage, ProductsPage } from '@/pages';
import * as allUsers from '@fixtures/users.json';

const users = allUsers['staging'].default;

test.describe('[products-page] Verify products page', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login({
      username: users.username,
    });
  });

  test('verify products page is displayed correctly', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.verifyProductsPageIsLoaded();
    await productsPage.verifyProductsLoadedCorrectly();
  });
});
