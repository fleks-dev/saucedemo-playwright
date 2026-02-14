# Playwright Boilerplate

Automated end-to-end testing suites using Playwright.

**[View Manual Test Cases](TEST_CASES.md)**

## 📖 What You'll Learn

This guide will help you:

1. **[Understand the Framework](#-project-structure)** - Learn the framework architecture and file organization
2. **[Setup the Framework](#-quick-start)** - Install and configure the testing environment
3. **[Run Tests](#-running-tests)** - Execute tests in various modes
4. **[Write Tests](#writing-tests)** - Create new test cases using best practices
5. **[Generate Reports](#-reports-and-artifacts)** - View and analyze test results
6. **[Troubleshoot Issues](#-troubleshooting)** - Fix common problems

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm package manager

### Installation

1. **Clone the repository**

```bash
git clone git@github.com:fleks-dev/saucedemo.git
```

2. **Install dependencies**

   ```bash
   npm install
   ```

   This will automatically install Playwright and all browser engines.

3. **Verify installation**
   ```bash
   npx playwright --version
   ```

## 📁 Project Structure

```
playwright-boilerplate/
├── configs/                           # Playwright configuration files
│   └── [config-name].config.ts        # Team-specific test configs
├── fixtures/                          # Test data and files
│   ├── users.json
├── src/                               # Source code
│   ├── pages/                         # Page Object Model classes
│   ├── helpers/                       # Utility functions
│   └── constants.ts
├── tests/                             # Test files
│   ├── base-test.ts                   # Base test configuration
│   ├── global-setup.ts                # Global test setup
│   ├── global-teardown.ts             # Global test cleanup
│   └── team-[name]/                   # Team-specific test suites
│       └── [test-suite]/
├── playwright.config.ts               # Main Playwright configuration
└── package.json
```

## 🧪 Running Tests

### Basic Test Commands

| Command               | Description                                |
| --------------------- | ------------------------------------------ |
| `npm run test`        | Run all tests in headless mode             |
| `npm run test:headed` | Run all tests with browser UI visible      |
| `npm run test:debug`  | Run tests in debug mode                    |
| `npm run test:ui`     | Run tests with Playwright's interactive UI |

### Specific Test Suites

Run tests using specific configurations or test paths:

```bash
# Run specific config file
CONFIG_NAME=configName npm run test:config
CONFIG_NAME=configName npm run test:config:headed

# Run specific test suite
SUITE_PATH=feature-name/test-suite npm run test:suite
SUITE_PATH=feature-name/test-suite npm run test:suite:headed
```

### Mobile Device Testing

**By default, all tests run only on desktop browsers (chromium)** to ensure fast test execution. Mobile device testing is opt-in.

#### Running Tests on Mobile Devices

To run tests on mobile device emulators:

```bash
# Enable all mobile devices for test run
INCLUDE_MOBILE=true npx playwright test

# Run all tests on a specific mobile device (headless mode)
npx playwright test --project="Mobile Safari"
npx playwright test --project="iPhone 13 Pro"
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Pixel 7"

# Run specific test file on mobile device with visible browser (headed mode)
npx playwright test [relative path to test file] --project="Mobile Safari" --headed

# Run tests on multiple mobile devices simultaneously
npx playwright test --project="Mobile Safari" --project="Mobile Chrome"

# Run specific test in debug mode on mobile device
npx playwright test [relative path to the test file] --project="Mobile Safari" --debug

# Run with slower execution speed for easier viewing (1000ms delay between actions)
npx playwright test [relative path to the test file] --project="Mobile Safari" --headed --slow-mo=1000
```

#### Available Mobile Devices

| Device Name   | Platform     | Viewport Size | Description   |
| ------------- | ------------ | ------------- | ------------- |
| Mobile Safari | iOS (iPhone) | 390×844       | iPhone 13     |
| iPhone 13 Pro | iOS (iPhone) | 390×844       | iPhone 13 Pro |
| Mobile Chrome | Android      | 393×851       | Pixel 5       |
| Pixel 7       | Android      | 412×915       | Pixel 7       |

Mobile device testing includes:

- Correct viewport dimensions
- Touch event support
- Mobile-specific user agents
- Device pixel ratio emulation
- Mobile Safari/Chrome rendering engines

## 🔧 Configuration

For local development, create a `.env` file

```bash
cp .env.template .env
```

### Environment Variables

Set these environment variables to customize test behavior:

```bash
INCLUDE_MOBILE=true                          # Include mobile browsers in test runs (default: false)
SUITE_PATH=feature-name/suite-name              # Specify test suite path for test:suite commands
```

The `playwright.config.ts` automatically loads environment variables from `.env` using `dotenv`.

#### Browser Configuration

**Desktop-First Approach**: By default, all tests run only on desktop browsers (chromium) for faster test execution. This applies globally to all test files without any per-file configuration.

- **Default behavior**: Tests run on `chromium` (desktop) only
- **Enable mobile**: Set `INCLUDE_MOBILE=true` to include all mobile browser projects
- **Specific device**: Use `--project` flag to run on a specific mobile device

Example:

```bash
# Default: Desktop only (fast)
npx playwright test

# Include all mobile devices
INCLUDE_MOBILE=true npx playwright test

# Specific mobile device
npx playwright test --project="iPhone 13 Pro"
```

## 📊 Reports and Artifacts

### Generating Reports

Reports are **automatically generated** after running tests. When you execute any test command (`npm run test`, `npm run test:headed`, etc.), Playwright generates multiple report formats:

- **HTML Report**: `playwright-report/` - Interactive visual report
- **JUnit XML**: `playwright-reports/junit-results.xml` - For CI/CD integration
- **JSON**: `playwright-reports/test-results.json` - Machine-readable results
- **GitHub Actions**: Automatic annotations in pull requests when running on CI

### Viewing Reports

After running tests, view the interactive HTML report:

```bash
npm run show-report
```

This opens a browser with detailed test results, including:

- Test execution timeline
- Screenshots of failures
- Video recordings (if enabled)
- Trace viewer for debugging

### Cleaning Artifacts

```bash
npm run clean
```

Removes:

- `test-results/` - Screenshots, videos, traces
- `playwright-report/` - HTML reports
- `playwright-reports/` - JUnit XML and JSON result files
- `playwright-test-results/` - Additional test result files

## 🛠️ Development

### Writing Tests

Follow these steps to create a new test:

#### 1. Create a Test File

Create your test file in the appropriate feature directory:

```bash
tests/feature-[name]/[test-suite]/yourTest.spec.ts
```

#### 2. Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should perform specific action', async ({ page }) => {
    // Navigate to page
    await page.goto('/your-page');

    // Perform actions
    await page.click('button#submit');

    // Verify results
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

#### 3. Using Page Objects

For better maintainability, create page objects in `src/pages/`:

**Create Page Object** (`src/pages/LoginPage.ts`):

```typescript
import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}
```

#### 4. Organization Best Practices

- **Page Objects**: Create reusable page classes in `src/pages/`
- **Test Data**: Store test fixtures in `fixtures/`
- **Utilities**: Add helper functions in `src/helpers/`
- **Naming**: Use descriptive names: `featureName.spec.ts`

## 🐛 Troubleshooting

### Changing Base URL in UI Mode

When running tests in UI mode (`npx playwright test --ui`), you can change the `baseURL` by setting the `BASE_URL` environment variable before running the command:

```bash
BASE_URL=http://localhost:5173 npx playwright test --ui
```

This overrides the default `baseURL` defined in `playwright.config.ts`.

### Debug Mode

Use debug mode to step through tests:

```bash
npm run test:debug
```

This opens a browser with developer tools where you can:

- Step through test actions
- Inspect elements
- View console logs
- Take screenshots

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Test Configuration](https://playwright.dev/docs/test-configuration)
