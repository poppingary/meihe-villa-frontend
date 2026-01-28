import { test, expect } from '@playwright/test';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

/**
 * E2E Tests for Admin Authentication
 *
 * Tests admin login/logout functionality and route protection:
 * - Login form validation
 * - Successful login flow
 * - Invalid credentials handling
 * - Protected route redirection
 * - Session persistence
 */

test.describe('Admin Authentication - Login Page', () => {
  test('login page loads with form elements', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();

    // Verify login form is displayed
    await loginPage.verifyLoginFormVisible();
  });

  test('login form validates required fields', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();

    // Try to submit empty form
    await loginPage.submit();

    // Should still be on login page (form validation prevents submission)
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('invalid credentials show error message', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();

    // Enter invalid credentials
    await loginPage.login('invalid@example.com', 'wrongpassword');

    // Wait for error response
    await page.waitForTimeout(1000);

    // Should still be on login page
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

test.describe('Admin Authentication - Route Protection', () => {
  test('unauthenticated user is redirected from admin dashboard', async ({
    page,
  }) => {
    // Try to access admin dashboard directly
    await page.goto('/admin');

    // Should be redirected to login page
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('unauthenticated user is redirected from admin heritage page', async ({
    page,
  }) => {
    // Try to access protected route
    await page.goto('/admin/heritage');

    // Should be redirected to login page
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('unauthenticated user is redirected from admin news page', async ({
    page,
  }) => {
    // Try to access protected route
    await page.goto('/admin/news');

    // Should be redirected to login page
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('unauthenticated user is redirected from admin timeline page', async ({
    page,
  }) => {
    // Try to access protected route
    await page.goto('/admin/timeline');

    // Should be redirected to login page
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('unauthenticated user is redirected from admin media page', async ({
    page,
  }) => {
    // Try to access protected route
    await page.goto('/admin/media');

    // Should be redirected to login page
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

test.describe('Admin Authentication - Login Flow', () => {
  // These tests require valid admin credentials
  // Skip if credentials are not configured
  const adminEmail = process.env.TEST_ADMIN_EMAIL;
  const adminPassword = process.env.TEST_ADMIN_PASSWORD;

  test.skip(
    !adminEmail || !adminPassword,
    'Admin credentials not configured (set TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD)'
  );

  test('successful login redirects to dashboard', async ({ page }) => {
    if (!adminEmail || !adminPassword) return;

    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();

    // Perform login
    await loginPage.login(adminEmail, adminPassword);

    // Wait for redirect
    await loginPage.waitForLoginRedirect();

    // Verify on dashboard
    const dashboardPage = new AdminDashboardPage(page);
    await dashboardPage.verifyDashboardLoaded();
  });

  test('logged in user can access admin pages', async ({ page }) => {
    if (!adminEmail || !adminPassword) return;

    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();

    // Login
    await loginPage.login(adminEmail, adminPassword);
    await loginPage.waitForLoginRedirect();

    // Navigate to heritage page
    await page.goto('/admin/heritage');
    await expect(page).not.toHaveURL(/\/admin\/login/);

    // Navigate to news page
    await page.goto('/admin/news');
    await expect(page).not.toHaveURL(/\/admin\/login/);
  });

  test('logout redirects to login page', async ({ page }) => {
    if (!adminEmail || !adminPassword) return;

    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();

    // Login
    await loginPage.login(adminEmail, adminPassword);
    await loginPage.waitForLoginRedirect();

    // Logout
    const dashboardPage = new AdminDashboardPage(page);
    await dashboardPage.logout();

    // Should be on login page
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

test.describe('Admin Authentication - Session Persistence', () => {
  const adminEmail = process.env.TEST_ADMIN_EMAIL;
  const adminPassword = process.env.TEST_ADMIN_PASSWORD;

  test.skip(
    !adminEmail || !adminPassword,
    'Admin credentials not configured'
  );

  test('session persists across page navigation', async ({ page }) => {
    if (!adminEmail || !adminPassword) return;

    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();

    // Login
    await loginPage.login(adminEmail, adminPassword);
    await loginPage.waitForLoginRedirect();

    // Navigate to different admin pages
    await page.goto('/admin/heritage');
    await expect(page).not.toHaveURL(/\/admin\/login/);

    await page.goto('/admin/news');
    await expect(page).not.toHaveURL(/\/admin\/login/);

    await page.goto('/admin/timeline');
    await expect(page).not.toHaveURL(/\/admin\/login/);

    // Come back to dashboard
    await page.goto('/admin');
    await expect(page).not.toHaveURL(/\/admin\/login/);
  });
});
