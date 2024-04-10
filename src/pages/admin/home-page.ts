import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'
import { envVars } from "@/helpers/environment-variables-helper"

export class HomePage extends BasePage {
    readonly myAccountBtn: Locator
    readonly baseUrl: string
    readonly redirectUrl: string
    readonly loadSpinner: Locator

    constructor(page: Page) {
        super(page)
        this.myAccountBtn = page.getByTestId('adminApp_admin-homepage_button-user-profile')
        this.baseUrl = `${envVars.baseUrl}/admin`
        this.redirectUrl = `${envVars.baseUrl}/admin/home`
        this.loadSpinner = page.getByText('Loading your workspace...')
    }
}
