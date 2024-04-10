import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'
import { envVars } from '@/helpers/environment-variables-helper'

export class WorkspaceSecurityPage extends BasePage {
    readonly baseUrl: string
    readonly authBlockTitle: Locator
    readonly passwordBlockTitle: Locator
    readonly enable2FaEnforcementBtn: Locator

    constructor(page: Page) {
        super(page)
        this.baseUrl = `${envVars.baseUrl}/admin/workspace/security`
        this.authBlockTitle = page.locator('//*[contains(text(), "Authentication")]')
        this.passwordBlockTitle = page.locator('//*[contains(text(), "Password")]')
        this.enable2FaEnforcementBtn = page.getByTestId('adminApp_workspace_button-showEnableModalButton')
    }
}