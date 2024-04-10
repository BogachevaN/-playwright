import { expect, Locator, Page } from "@playwright/test"
import { BasePage } from '@/pages/base-page'
import { envVars } from '@/helpers/environment-variables-helper'
import { DataProviderInterface } from "@tests/data/types"
import { User } from "@tests/data/UserDataProvider"

export class SignUpPage extends BasePage {

    readonly firstNameInput: Locator
    readonly lastNameInput: Locator
    readonly emailInput: Locator
    readonly passwordInput: Locator
    readonly countryList: Locator
    readonly startFreeTrialBtn: Locator
    readonly passwordRulesPlaceholder: Locator
    readonly showPasswordBtn: Locator
    readonly joinWorkspaceBtn: Locator
    readonly logInLink: Locator

    constructor(page: Page) {
        super(page)
        this.firstNameInput = page.locator('input[name="firstName"]')
        this.lastNameInput = page.locator('input[name="lastName"]')
        this.emailInput = page.locator('input[name="email"]')
        this.passwordInput = page.locator('input[name="password"]')
        this.countryList  = page.locator('input[type="country"]')
        this.startFreeTrialBtn = page.getByTestId('form-signupForm_form-submit')
        this.passwordRulesPlaceholder = page.locator('.password-validation > div > div')
        this.showPasswordBtn = page.locator('text=visibility')
        this.joinWorkspaceBtn = page.getByRole('button', { name: 'Join workspace'})
        this.logInLink = page.getByRole('link', { name: 'Log in'})
    }

    async open() {
        await this.page.goto(envVars.baseUrl + '/signup')
    }

    async loadPage() {
        await expect(this.firstNameInput).toBeVisible()
    }

    async selectCountry() {
        this.countryList.click()
        const count = await this.page.locator('div[class="tp-country"]').count();
        const random = Math.floor(Math.random() * count) + 1;
        const country = this.page.locator('div[class="tp-country"]').innerHTML;
        await this.page.locator('//div[@role="option"][' + random + ']').click();
        return country
    }

    async enterValidDataSignupPage(userDataProvider: DataProviderInterface<User>) {
        await this.firstNameInput.fill(userDataProvider.getField('firstName'));
        await this.lastNameInput.fill(userDataProvider.getField('lastName'));
        await this.emailInput.fill(userDataProvider.getField('email'));
        await this.passwordInput.fill(userDataProvider.getField('password'));
        await this.countryList.click();
        await this.countryList.fill(userDataProvider.getField('country'));
        await this.selectValueInDropdown(userDataProvider.getField('country'));
        await this.startFreeTrialBtn.click();
    }
  }
