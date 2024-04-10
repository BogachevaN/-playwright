import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'
import { envVars } from '@/helpers/environment-variables-helper'

export class ProfilePage extends BasePage {
    readonly emailInput: Locator
    readonly baseUrl: string
    readonly twoFaBlock: Locator
    readonly detailsSidebar: Locator

    constructor(page: Page) {
        super(page)
        this.emailInput = page.locator("input[name='email']")
        this.baseUrl = `${envVars.baseUrl}/admin/workspace/users/`
        this.twoFaBlock = page.locator('//*[contains(@class,"two-factor")]')
        this.detailsSidebar = page.locator('//*[contains(@class, "details-grid__sidebar")]')
    }
}
