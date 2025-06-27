import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './basePage';
import { step } from '../decorators/step';

export class LoginPage extends BasePage {
  readonly username_input: Locator;
  readonly password_input: Locator;
  readonly login_button: Locator;
  readonly continue_button: Locator;
  readonly error_message_container: Locator;
  readonly error_message_ok_button: Locator;
  

  constructor(page: Page) {
    super(page, '');
    this.username_input = page.locator("#user-name");
    this.password_input = page.locator("#password");
    this.continue_button = page.locator("#continueLogin");
    this.login_button = page.locator("#attemptLogin");
    this.error_message_container = page.getByText('Ok');
  }

  @step
  async login(username: string, password: string) {
    await this.username_input.fill(username);
    await this.continue_button.click();
    await this.password_input.fill(password);
    await this.login_button.click();
  }

  async userStillOnLogin() {
    expect(this.page).toHaveURL(this.url);
  }

  async errorMessagePresented(message?: string) {
    // await expect(this.page.getByText('Your email or password was incorrectPlease try again or request a new')).toBeVisible({ timeout: 15000 });
    // await expect(page.locator('div').filter({ hasText: 'Ok' }).nth(3)).toBeVisible();
    await expect(this.page.locator('div').filter({ hasText: `${message}` })).toBeVisible({ timeout: 15000 });
    // await expect(this.page.getByText('Please try again or request a')).toBeVisible();
    // await expect(this.page.getByText('CancelOk')).toBeVisible();
  }
}