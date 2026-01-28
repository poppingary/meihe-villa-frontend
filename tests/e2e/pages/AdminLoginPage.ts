import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for the Admin Login page
 */
export class AdminLoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loginForm: Locator;

  constructor(page: Page) {
    super(page);
    this.loginForm = page.locator('form');
    this.emailInput = page.getByLabel(/email|電子郵件/i);
    this.passwordInput = page.getByLabel(/password|密碼/i);
    this.loginButton = page.getByRole('button', { name: /login|登入/i });
    this.errorMessage = page.locator('[role="alert"], .error, [class*="error"]');
  }

  /**
   * Navigate to admin login page
   */
  async goto() {
    await super.goto('/admin/login');
  }

  /**
   * Fill in login credentials
   */
  async fillCredentials(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  /**
   * Submit the login form
   */
  async submit() {
    await this.loginButton.click();
  }

  /**
   * Perform complete login flow
   */
  async login(email: string, password: string) {
    await this.fillCredentials(email, password);
    await this.submit();
  }

  /**
   * Verify login form is displayed
   */
  async verifyLoginFormVisible() {
    await expect(this.loginForm).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Verify error message is displayed
   */
  async verifyErrorDisplayed() {
    await expect(this.errorMessage).toBeVisible();
  }

  /**
   * Wait for redirect after successful login
   */
  async waitForLoginRedirect() {
    await this.page.waitForURL(/\/admin(?!\/login)/, { timeout: 10000 });
  }
}
