import { Locator, Page } from '@playwright/test'
import { BasePage } from '@/pages/base-page'
import { envVars } from "@/helpers/environment-variables-helper"

export class ListDetailsPage extends BasePage {
    readonly baseUrl: string
    readonly listTabTitle: Locator
    readonly noContactInListText: Locator
    readonly listTitle:Locator

    constructor(page: Page) {
        super(page)
        this.baseUrl = `${envVars.baseUrl}/contacts/lists/`
        this.listTabTitle = page.locator('//*[contains(@class, "tab--active")]//*[contains(@class, "tab-content-title")]')
        this.noContactInListText = page.getByText('There are no contact in this list.')
        this.listTitle = page.locator('//*[@class="title"]')
    }

    async getCurrentListID(): Promise<string> {
        const id = await this.getCurrentPageURL()
        const i = id.lastIndexOf('/lists/') + 7
        return id.substring(i, i + 36)
    }
}