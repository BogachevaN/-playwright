import { Locator, Page } from '@playwright/test'
import { BasePage } from "@/pages/base-page"
import { envVars } from "@/helpers/environment-variables-helper"

export class DashboardPage extends BasePage {
    readonly baseUrl: string
    readonly redirectUrl: string
    readonly ticketsBlock: Locator

    constructor(page: Page) {
        super(page)
        this.baseUrl = `${envVars.baseUrl}/`
        this.redirectUrl = `${envVars.baseUrl}/home`
        this.ticketsBlock = page.locator('.activity-block:has-text("Tickets")')
    }

    async getContactsLocator(quantity: number) {
        return this.page.getByText(`Contacts ${quantity}Viewchevron_right`)
    }
}