import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '@/pages/base-page'
import { envVars } from '@/helpers/environment-variables-helper'

export class LoginPage extends BasePage {
    readonly startFreeTrialLink: Locator
    readonly emailInput: Locator
    readonly continueBtn: Locator
    readonly passwordInput: Locator
    readonly loginBtn: Locator

    constructor(page: Page) {
        super(page)
        this.startFreeTrialLink = page.getByTestId('startFreeTrialLink')
        this.emailInput = page.locator('input[name="email"]')
        this.continueBtn = page.getByTestId('button-continueButton')
        this.passwordInput = page.locator('input[name="password"]')
        this.loginBtn = page.getByTestId('form-loginForm_form-submit')
    }

    async open() {
        await this.page.goto(envVars.baseUrl)
    }

    async logIn(email: string, password: string) {
        await this.emailInput.fill(email)
        await this.continueBtn.click()
        await expect(this.passwordInput).toBeVisible()
        await this.passwordInput.fill(password)
        await this.loginBtn.hover()
        await this.loginBtn.click()
    }

    async loadPage() {
      await expect(this.emailInput).toBeVisible()
    }
  }
