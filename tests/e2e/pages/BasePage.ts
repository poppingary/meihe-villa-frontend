import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page Object Model with common functionality
 */
export class BasePage {
  readonly page: Page;
  readonly header: Locator;
  readonly footer: Locator;
  readonly nav: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('header');
    this.footer = page.locator('footer');
    this.nav = page.locator('nav');
  }

  /**
   * Navigate to a path
   */
  async goto(path: string = '/') {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get navigation links
   */
  getNavLink(name: string): Locator {
    return this.nav.getByRole('link', { name });
  }

  /**
   * Click a navigation link
   */
  async clickNavLink(name: string) {
    await this.getNavLink(name).click();
  }

  /**
   * Verify the page title contains expected text
   */
  async verifyTitle(expectedText: string) {
    await expect(this.page).toHaveTitle(new RegExp(expectedText, 'i'));
  }

  /**
   * Verify current URL contains expected path
   */
  async verifyUrl(expectedPath: string) {
    await expect(this.page).toHaveURL(new RegExp(expectedPath));
  }

  /**
   * Take a screenshot with a descriptive name
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: false,
    });
  }
}
