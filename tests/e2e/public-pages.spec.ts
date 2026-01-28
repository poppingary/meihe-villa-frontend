import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

/**
 * E2E Tests for Public Pages
 *
 * Tests critical user journeys on public-facing pages:
 * - Homepage loading and navigation
 * - Heritage/Architecture pages
 * - News pages
 * - Gallery page
 * - Visit information page
 */

test.describe('Public Pages - Homepage', () => {
  test('homepage loads successfully with hero section', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Verify page loaded
    await expect(page).toHaveURL('/');

    // Verify hero section is visible
    await homePage.verifyHeroVisible();

    // Verify site name is present
    await homePage.verifySiteName();
  });

  test('homepage has working navigation', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Verify navigation is present
    await expect(homePage.nav).toBeVisible();

    // Check for common navigation links
    const navLinks = page.locator('nav a');
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('homepage footer is present', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Scroll to footer
    await homePage.footer.scrollIntoViewIfNeeded();

    // Verify footer is visible
    await expect(homePage.footer).toBeVisible();
  });
});

test.describe('Public Pages - About', () => {
  test('about page loads successfully', async ({ page }) => {
    await page.goto('/about');

    // Verify page loaded
    await expect(page).toHaveURL('/about');

    // Verify main content is present
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();

    // Should have heading about the villa
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });
});

test.describe('Public Pages - Architecture/Heritage', () => {
  test('architecture page loads and displays content', async ({ page }) => {
    await page.goto('/architecture');

    // Verify page loaded
    await expect(page).toHaveURL('/architecture');

    // Verify main content area
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('can navigate to heritage detail page if links exist', async ({ page }) => {
    await page.goto('/architecture');

    // Look for links to heritage details (exclude exact /architecture match)
    const heritageLinks = page
      .locator('a[href^="/architecture/"]')
      .filter({ hasNot: page.locator('[href="/architecture"]') });

    const linkCount = await heritageLinks.count();

    if (linkCount > 0) {
      // Get the href before clicking
      const href = await heritageLinks.first().getAttribute('href');

      // Click first heritage link
      await heritageLinks.first().click();

      // Verify navigated to detail page
      if (href) {
        await expect(page).toHaveURL(href);
      }

      // Verify detail content is present
      const detailContent = page.locator('main');
      await expect(detailContent).toBeVisible();
    } else {
      // No detail links available - test passes (no heritage sites to navigate to)
      expect(linkCount).toBe(0);
    }
  });
});

test.describe('Public Pages - Gallery', () => {
  test('gallery page loads and displays images', async ({ page }) => {
    await page.goto('/gallery');

    // Verify page loaded
    await expect(page).toHaveURL('/gallery');

    // Verify main content
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();

    // Gallery should have images
    const images = page.locator('img');
    const imageCount = await images.count();
    expect(imageCount).toBeGreaterThan(0);
  });
});

test.describe('Public Pages - News', () => {
  test('news page loads successfully', async ({ page }) => {
    await page.goto('/news');

    // Verify page loaded
    await expect(page).toHaveURL('/news');

    // Verify main content
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('can navigate to news detail page', async ({ page }) => {
    await page.goto('/news');

    // Look for links to news articles
    const newsLinks = page.locator('a[href*="/news/"]').filter({
      hasNot: page.locator('[href="/news"]'),
    });

    if ((await newsLinks.count()) > 0) {
      // Click first news link
      await newsLinks.first().click();

      // Verify navigated to detail page
      await expect(page).toHaveURL(/\/news\/.+/);

      // Verify article content is present
      const articleContent = page.locator('main, article');
      await expect(articleContent).toBeVisible();
    }
  });
});

test.describe('Public Pages - Visit Information', () => {
  test('visit page loads with information sections', async ({ page }) => {
    await page.goto('/visit');

    // Verify page loaded
    await expect(page).toHaveURL('/visit');

    // Verify main content
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();

    // Should have some content sections
    const sections = page.locator('section');
    const sectionCount = await sections.count();
    expect(sectionCount).toBeGreaterThan(0);
  });
});

test.describe('Public Pages - Navigation Flow', () => {
  test('user can navigate between main pages', async ({ page }) => {
    // Start at home
    await page.goto('/');
    await expect(page).toHaveURL('/');

    // Navigate to about
    await page.goto('/about');
    await expect(page).toHaveURL('/about');

    // Navigate to gallery
    await page.goto('/gallery');
    await expect(page).toHaveURL('/gallery');

    // Navigate to visit
    await page.goto('/visit');
    await expect(page).toHaveURL('/visit');

    // Navigate to news
    await page.goto('/news');
    await expect(page).toHaveURL('/news');

    // Return to home
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });
});

test.describe('Public Pages - Responsive Design', () => {
  test('pages render correctly on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Verify page loads - use main element specifically
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();

    // Check for mobile menu button (if exists)
    const mobileMenuButton = page.locator(
      'button[aria-label*="menu" i], [class*="mobile-menu"], [class*="hamburger"]'
    );

    if ((await mobileMenuButton.count()) > 0) {
      await expect(mobileMenuButton.first()).toBeVisible();
    }
  });
});
