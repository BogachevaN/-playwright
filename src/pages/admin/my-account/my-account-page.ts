import { Locator, Page } from '@playwright/test';
import { envVars } from "@/helpers/environment-variables-helper";
import { BasePage } from '@/pages/base-page';

export class MyAccountPage extends BasePage {
    readonly baseUrl: string
    readonly redirectUrl: string
    readonly userFullNameText: Locator
    readonly firstNameInput: Locator
    readonly lastNameInput: Locator
    readonly emailInput: Locator

    constructor(page: Page) {
        super(page)
        this.baseUrl = `${envVars.baseUrl}/admin/account`
        this.redirectUrl = `${envVars.baseUrl}/admin/account/profile`
        this.userFullNameText = page.locator('.details-hero__title>div:nth-child(1)>div')
        this.firstNameInput = page.locator("input[name='firstName']")
        this.lastNameInput = page.locator("input[name='lastName']")
        this.emailInput = page.locator("input[name='email']")
    }
}