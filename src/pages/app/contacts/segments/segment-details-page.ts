import { Locator, Page } from '@playwright/test'
import { BasePage } from '@/pages/base-page'
import { envVars } from "@/helpers/environment-variables-helper"

export class SegmentDetailsPage extends BasePage {
    readonly baseUrl: string
    readonly segmentTabTitle: Locator
    readonly messageText: Locator
    readonly segmentTitle:Locator
    readonly sendCampaignBtn: Locator

    constructor(page: Page) {
        super(page)
        this.baseUrl = `${envVars.baseUrl}/contacts/segments/`
        this.segmentTabTitle = page.locator('//*[contains(@class, "tab--active")]//*[contains(@class, "tab-content-title")]')
        this.messageText = page.getByText('Please add filters to see segmented contacts')
        this.segmentTitle = page.locator('//*[@class="title"]')
        this.sendCampaignBtn = page.getByRole('button', { name: 'Send campaign'})
    }

    async getCurrentSegmentID(): Promise<string> {
        const id = await this.getCurrentPageURL()
        const i = id.lastIndexOf('/segments/') + 10
        return id.substring(i, i + 36)
    }
}