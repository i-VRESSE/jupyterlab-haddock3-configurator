import { expect, test } from '@jupyterlab/galata';

/**
 * Don't load JupyterLab webpage before running the tests.
 * This is required to ensure we capture all log messages.
 */
test.use({ autoGoto: false });

test('should have launch button', async ({ page }) => {
  await page.goto();

  const launcherButton = page.locator('p:has-text("Haddock3 config")');
  expect(await launcherButton.isVisible()).toBeTruthy();
});
