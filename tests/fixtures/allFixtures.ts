// Provides all page object fixtures for Playwright tests.

import { test as base } from '@playwright/test';
import { LoginPage } from '../pom/loginPage';

type AllFixtures = {
    loginPage: LoginPage;    
};

export const test = base.extend<AllFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    }    
});
export { expect } from '@playwright/test';