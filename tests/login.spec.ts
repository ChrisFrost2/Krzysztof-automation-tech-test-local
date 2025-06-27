import { test } from './fixtures/allFixtures'
import { expect } from '@playwright/test';

test.describe('Login tests', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ page, loginPage }) => {
        await loginPage.open();
    });

    [
        { user: 'fake@user.com', password: 'wrongPassword123', message: 'Your email or password was incorrect' },
        { user: 'fake@user.com', password: '', message: 'Your email or password was incorrect' }
    ].forEach(({ user, password, message }) => {
        test(`should show error on invalid credentials for user '${user}' and '${password}'`, {
            tag: ['@smokeTest', '@login']
        }, async ({ page, loginPage }) => {
            await loginPage.login(user, password);
            await loginPage.errorMessagePresented(message);
            await loginPage.userStillOnLogin();
        });
    });

    [
        { user: '', password: '', message: 'Please enter the email address linked to your BoardOutlook profile' },
        { user: '', password: 'wrongPassword123', message: 'Please enter the email address linked to your BoardOutlook profile' }
    ].forEach(({ user, password, message }) => {
        test(`should show error on lack of login and password for user '${user}' and '${password}'`, {
            tag: ['@smokeTest', '@login']
        }, async ({ page, loginPage }) => {
            await loginPage.login(user, password);
            await loginPage.errorMessagePresented('Please enter the email address linked to your BoardOutlook profile');
            await loginPage.userStillOnLogin();
        });
    });

    test('should mask password input field', {
        tag: ['@login', '@ui']
    }, async ({ page, loginPage }) => {
        await page.getByRole('button', { name: /continue/i }).click();
        await expect(loginPage.password_input).toHaveAttribute('type', 'password');
    });

    test('login input expect only email value ', {
        tag: ['@login', '@ui']
    }, async ({ page, loginPage }) => {
        loginPage.username_input.fill('noCorrectEmail');
        loginPage.continue_button.click();
        loginPage.login_button.click();
        await loginPage.error_message_ok_button.click({ timeout: 15000 });
        expect(page.locator(`xpath=/div[contains(@class, 'error')]//input[@id='username']`)).toBeVisible();
    });

});