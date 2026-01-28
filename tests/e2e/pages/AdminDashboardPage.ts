import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for the Admin Dashboard page
 */
export class AdminDashboardPage extends BasePage {
  readonly sidebar: Locator;
  readonly mainContent: Locator;
  readonly dashboardTitle: Locator;
  readonly logoutButton: Locator;
  readonly sidebarLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.sidebar = page.locator('aside, [class*="sidebar"]');
    this.mainContent = page.locator('main');
    this.dashboardTitle = page.locator('h1, h2').first();
    this.logoutButton = page.getByRole('button', { name: /logout|登出/i });
    this.sidebarLinks = this.sidebar.getByRole('link');
  }

  /**
   * Navigate to admin dashboard
   */
  async goto() {
    await super.goto('/admin');
  }

  /**
   * Verify dashboard is loaded (user is authenticated)
   */
  async verifyDashboardLoaded() {
    await expect(this.mainContent).toBeVisible();
    // Should not be on login page
    await expect(this.page).not.toHaveURL(/\/admin\/login/);
  }

  /**
   * Click a sidebar navigation link
   */
  async clickSidebarLink(name: string) {
    await this.sidebar.getByRole('link', { name: new RegExp(name, 'i') }).click();
  }

  /**
   * Navigate to heritage management
   */
  async goToHeritage() {
    await this.clickSidebarLink('heritage|古蹟|歷史建築');
    await this.page.waitForURL(/\/admin\/heritage/);
  }

  /**
   * Navigate to news management
   */
  async goToNews() {
    await this.clickSidebarLink('news|新聞|最新消息');
    await this.page.waitForURL(/\/admin\/news/);
  }

  /**
   * Navigate to timeline management
   */
  async goToTimeline() {
    await this.clickSidebarLink('timeline|時間軸|歷史');
    await this.page.waitForURL(/\/admin\/timeline/);
  }

  /**
   * Navigate to visit info management
   */
  async goToVisitInfo() {
    await this.clickSidebarLink('visit|參觀|資訊');
    await this.page.waitForURL(/\/admin\/visit-info/);
  }

  /**
   * Navigate to media management
   */
  async goToMedia() {
    await this.clickSidebarLink('media|媒體|圖片');
    await this.page.waitForURL(/\/admin\/media/);
  }

  /**
   * Perform logout
   */
  async logout() {
    if (await this.logoutButton.isVisible()) {
      await this.logoutButton.click();
      await this.page.waitForURL(/\/admin\/login/);
    }
  }

  /**
   * Get count of sidebar links
   */
  async getSidebarLinkCount(): Promise<number> {
    return await this.sidebarLinks.count();
  }
}
