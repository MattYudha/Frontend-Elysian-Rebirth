import { test, expect } from '@playwright/test';

test.describe('Critical User Journey (CUJ) - Smoke Test', () => {

    test('User can land, log in successfully, and access the dashboard', async ({ page }) => {
        // 1. Mock Authentication & API Endpoints for reliability (Anti-Flaky)
        await page.route('**/api/auth/login', async route => {
            const json = {
                status: 'success',
                data: {
                    access_token: 'mock-access-token-123',
                    user: {
                        id: 'mock-user-id',
                        name: 'Mock Tester',
                        email: 'test@elysian.com',
                        role: 'admin'
                    }
                }
            };
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                json
            });
        });

        await page.route('**/api/v1/users/me', async route => {
            const json = {
                status: 'success',
                data: {
                    id: 'mock-user-id',
                    name: 'Mock Tester',
                    email: 'test@elysian.com',
                    role: 'admin'
                }
            };
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                json
            });
        });

        // 2. Step 1: Navigate to Home Page (/) and verify main elements
        await page.goto('/');
        await expect(page.getByText('Elysian').first()).toBeVisible();

        // 3. Step 2: Navigate to Login page, fill credentials, and submit
        await page.goto('/login');
        
        // Use robust user-facing locators
        await page.getByLabel('Email Address').fill('test@elysian.com');
        await page.getByLabel('Password').fill('password123');
        await page.getByRole('button', { name: 'Sign In' }).click();

        // 4. Step 3: Verify redirection to /dashboard
        // We wait for the URL to change to /dashboard (which has auto-waiting built-in via expect(page).toHaveURL)
        await expect(page).toHaveURL(/.*dashboard/);

        // 5. Step 4: Verify specific dashboard components (Sidebar - Bantuan button)
        await expect(page.getByRole('link', { name: 'Bantuan' })).toBeVisible();
    });
});
