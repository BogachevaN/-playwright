import { Locator, Page } from '@playwright/test'
import { envVars } from '@/helpers/environment-variables-helper'
import { BasePage } from '@/pages/base-page'


export class TicketsSettingsPage extends BasePage {
    readonly url: string
    readonly connectedInboxesBlock: Locator
    readonly statusesBlock: Locator
    readonly filteredViewsBlock: Locator

    constructor(page: Page) {
        super(page)
        this.url = `${envVars.baseUrl}/admin/settings/tickets`
        this.connectedInboxesBlock = page.getByText('Connected inboxes')
        this.statusesBlock = page.getByRole('link', { name: /There are [0-9] ticket statuses in this workspace./ }) 
        this.filteredViewsBlock = page.getByRole('link', { name: /There are [0-9] filtered views in this workspace./ })
    }
}
