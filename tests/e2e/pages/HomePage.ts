import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for the Home page
 */
export class HomePage extends BasePage {
  readonly heroSection: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly featureCards: Locator;
  readonly ctaButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heroSection = page.locator('section').first();
    this.heroTitle = page.locator('h1');
    this.heroSubtitle = page.locator('h1 + p, h1 ~ p').first();
    this.featureCards = page.locator('[class*="card"], [class*="feature"]');
    this.ctaButton = page.getByRole('link', { name: /參觀|visit|了解更多|learn more/i });
  }

  /**
   * Navigate to home page
   */
  async goto() {
    await super.goto('/');
  }

  /**
   * Verify hero section is visible
   */
  async verifyHeroVisible() {
    await expect(this.heroTitle).toBeVisible();
  }

  /**
   * Verify the site name is present
   */
  async verifySiteName() {
    const pageContent = await this.page.content();
    const hasSiteName =
      pageContent.includes('梅鶴山莊') || pageContent.includes('Meihe Villa');
    expect(hasSiteName).toBeTruthy();
  }

  /**
   * Click the main CTA button
   */
  async clickCta() {
    if (await this.ctaButton.isVisible()) {
      await this.ctaButton.click();
    }
  }

  /**
   * Get count of feature cards
   */
  async getFeatureCardCount(): Promise<number> {
    return await this.featureCards.count();
  }
}
