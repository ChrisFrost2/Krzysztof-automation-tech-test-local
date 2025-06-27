import {type Page, expect } from '@playwright/test';
import { step } from '../decorators/step';

export class BasePage {
  url: string;
  page: Page;

  constructor(page: Page, url: string) {
    this.page = page;
    this.url = `https://experiments.boardoutlook.com/account/login/${url ?? ''}`;

  }

  @step
  async open() {
    await this.page.goto(this.url);
  }

  @step
  async isOpened() {
    expect(this.page).toHaveURL(this.url, { timeout: 15000 });
  }
}